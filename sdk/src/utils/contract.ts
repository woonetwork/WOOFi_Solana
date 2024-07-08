import { BN, Program } from "@coral-xyz/anchor";
import { NATIVE_MINT, createAssociatedTokenAccountInstruction, createSyncNativeInstruction, getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { Woospmmtres } from "../artifacts/woospmmtres";
import { WoospmmtresContext } from "../context";
import { CHAINLINK_PROGRAM_ACCOUNT } from "../utils/constants";

  export const DEFAULT_PRICE_DECIMALS = 8;
  export const DEFAULT_QUOTE_DECIMALS = 6;

  export type Decimals = {
    price_dec: BN,  // 10 ** 8
    quote_dec: BN,  // 10 ** 6, same as native USDC
    base_dec: BN   // 10 ** 18 or 8
  }

  export const newDecimals = (
    price_dec: number,
    quote_dec: number,
    base_dec: number,
  ) : Decimals => {
    return {
        price_dec: new BN(10).pow(new BN(price_dec)),
        quote_dec: new BN(10).pow(new BN(quote_dec)),
        base_dec: new BN(10).pow(new BN(base_dec))
    }
  }

  export type GetStateResult = {
    price_out: BN,
    spread: BN,
    coeff: BN,
    feasible_out: boolean
  }

  export type CalcResult = {
    amount: BN, 
    new_price: BN
  }

  export type QueryResult = {
    to_amount: BN,
    swap_fee_amount: BN,
    swap_fee: BN,
  }

  const TENPOW18U128 = new BN(10).pow(new BN(18));
  const TE5U128 = new BN(10).pow(new BN(5));

  export const generatePoolParams = async(
    feedAccount: PublicKey,
    tokenMint: PublicKey,
    program: Program<Woospmmtres> 
  ) => {
    const [oracle] = await PublicKey.findProgramAddressSync(
      [Buffer.from('cloracle'), feedAccount.toBuffer(), new PublicKey(CHAINLINK_PROGRAM_ACCOUNT).toBuffer()],
      program.programId
    );
  
    const [wooracle] = await PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), feedAccount.toBuffer()],
      program.programId
    );
  
    const [woopool] = await PublicKey.findProgramAddressSync(
      [Buffer.from('woopool'), tokenMint.toBuffer()],
      program.programId
    );
  
    // woopool data should already be created after init
    // due to anchor 0.29's js wrapper bug, and consider performance
    // caller should remember the vault for now.
    // const {tokenVault} = await program.account.wooPool.fetch(woopool);
  
    return {
      oracle,
      wooracle,
      woopool
    }
  }
  
  export const getWooPrice = (
    oracle: any,
    wooracle: any,
  ) : GetStateResult => {
    const now = new Date().getTime();
  
    const wo_price = wooracle.price;
    const wo_timestamp = wooracle.updatedAt;
    const bound = wooracle.bound;
  
    const clo_price = oracle.round;
    const wo_feasible = !clo_price.eq(new BN(0)) && new BN(now).lte(wo_timestamp.add(wooracle.staleDuration));
    const wo_price_in_bound = !clo_price.eq(new BN(0)) &&
    ((clo_price.mul(TENPOW18U128.sub(bound)).div(TENPOW18U128)).lte(wo_price) && wo_price.lte(clo_price.mul(TENPOW18U128.add(bound)).div(TENPOW18U128)));
    // TODO: check upper and low bound
  
    let price_out: BN;
    let feasible_out: boolean;
    if (wo_feasible) {
        price_out = wo_price;
        feasible_out = wo_price_in_bound;
    } else {
        if (oracle.outerPreferred) {
            price_out = clo_price;
        } else {
            price_out = new BN(0);
        }
        feasible_out = !price_out.eq(new BN(0));
    }
  
    if (feasible_out) {
        if (price_out.lt(wooracle.rangeMin)) {
          feasible_out = false;
          price_out = new BN(0);
          throw new Error("Woo oracle price below range MIN");      
        }
        if (price_out.gt(wooracle.rangeMax)) {
          feasible_out = false;
          price_out = new BN(0);
          throw new Error("Woo oracle price exceed range MAX");
        }
    }
  
    return {
      price_out,
      spread: wooracle.spread,
      coeff: wooracle.coeff,
      feasible_out
    }
  }

  export const checked_mul_div = (a: BN, b: BN, c: BN): BN => {
    return a.mul(b).div(c)
  }

  // TODO Prince: use checked mul div muldiv to do the calc
  export const calc_usd_amount_sell_base = (
    base_amount: BN,
    woopool: any,
    decimals: Decimals,
    state: GetStateResult
  ) : CalcResult => {
    if (!state.feasible_out) {
        throw new Error("Woo oracle is not feasible");
    }
    if (state.price_out.lte(new BN(0))) {
        throw new Error("Woo oracle price is not valid");
    }

    //let notionalSwap : u128 = (base_amount * state.price_out * decimals.quote_dec) / decimals.base_dec / decimals.price_dec;
    let notion_calc_a: BN = checked_mul_div(base_amount, state.price_out, decimals.price_dec);
    let notional_swap: BN = checked_mul_div(notion_calc_a, decimals.quote_dec, decimals.base_dec);
    if (notional_swap.gt(woopool.maxNotionalSwap)) {
        throw new Error("Woo pp exceed max notional value");
    }

    // gamma = k * price * base_amount; and decimal 18
    let gamma_calc_a: BN = checked_mul_div(base_amount, state.price_out, decimals.price_dec);
    let gamma: BN = checked_mul_div(gamma_calc_a, state.coeff, decimals.base_dec);
    if (gamma.gt(woopool.maxGamma)) {
        throw new Error("Woo pp exceed max gamma");
    }

    // Formula: quoteAmount = baseAmount * oracle.price * (1 - oracle.k * baseAmount * oracle.price - oracle.spread)
    // amount = 100000, price = 1
    // 1e5 * 1e18 * 1e6 = 1e29
    // amount = 10,000,000, price = 10
    // 1e7*1e18 * 1e2*1e8 * 1e6 / 1e8 1e33

    // so change the position of priceDec and baseDec
    
    // let calcA: u128 = checked_mul_div(base_amount, state.price_out, decimals.price_dec as u128)?
    //                  .checked_mul(decimals.quote_dec as u128).ok_or(ErrorCode::MulDivOverflow)?;
    // let calcB: u128 = TENPOW18U128.checked_sub(gamma).ok_or(ErrorCode::MathOverflow)?
    //                  .checked_sub(state.spread as u128).ok_or(ErrorCode::MathOverflow)?;
    // let usd_amount: u128 = checked_mul_div(calcA, calcB, TENPOW18U128)?
    //                  .checked_div(decimals.base_dec as u128).ok_or(ErrorCode::MathOverflow)?;
    let calc_a: BN = checked_mul_div(base_amount, state.price_out, decimals.base_dec)
                     .mul(decimals.quote_dec);
    let calc_b: BN = TENPOW18U128.sub(gamma)
                     .sub(state.spread);
    let usd_amount: BN = checked_mul_div(calc_a, calc_b, TENPOW18U128)
                     .div(decimals.price_dec);

    // newPrice = oracle.price * (1 - k * oracle.price * baseAmount)
    let new_price: BN = checked_mul_div(TENPOW18U128.sub(gamma), state.price_out, TENPOW18U128);

    return {
      amount: usd_amount,
      new_price
    }
  }

  export const calc_base_amount_sell_usd = (
    usd_amount: BN,
    woopool: any, 
    decimals: Decimals, 
    state: GetStateResult
  ): CalcResult => {
    if (!state.feasible_out) {
        throw new Error("Woo oracle is not feasible");
    }
    if (state.price_out.lte(new BN(0)) ){
        throw new Error("Woo oracle price is not valid");
    }
    
    if (usd_amount.gt(woopool.maxNotionalSwap)) {
        throw new Error("Woo pp exceed max notional value");
    }

    // gamma = k * quote_amount; and decimal 18
    let gamma: BN = checked_mul_div(usd_amount, state.coeff, decimals.quote_dec);
    if (gamma.gt(woopool.maxGamma)) {
        throw new Error("Woo pp exceed max gamma");
    }
    
    // Formula: baseAmount = quoteAmount / oracle.price * (1 - oracle.k * quoteAmount - oracle.spread)
    let calc_a: BN = usd_amount.mul(decimals.base_dec);
    let calc_b: BN = checked_mul_div(calc_a, decimals.price_dec, state.price_out);
    let calc_c: BN = TENPOW18U128.sub(gamma)
                      .sub(state.spread);
    let calc_d: BN = checked_mul_div(calc_b, calc_c, TENPOW18U128);
    let base_amount = calc_d.div(decimals.quote_dec);

    // new_price = oracle.price / (1 - k * quoteAmount)
    let new_price: BN = checked_mul_div(TENPOW18U128, state.price_out, TENPOW18U128.sub(gamma));
       
    return {
      amount: base_amount,
      new_price
    }
  }

  export const tryCalculate = async(
    ctx: WoospmmtresContext,
    fromAmount: BN,
    fromTokenMint: PublicKey,
    fromOracleFeedAccount: PublicKey,
    toTokenMint: PublicKey,
    toOracleFeedAccount: PublicKey,
  ): Promise<QueryResult> => {
    const fromPoolParams = await generatePoolParams(fromOracleFeedAccount, fromTokenMint, ctx.program);
    const oracle_from = await ctx.program.account.oracle.fetch(fromPoolParams.oracle);
    const wooracle_from = await ctx.program.account.woOracle.fetch(fromPoolParams.wooracle);
    const woopool_from = await ctx.program.account.wooPool.fetch(fromPoolParams.woopool);

    const toPoolParams = await generatePoolParams(toOracleFeedAccount, toTokenMint, ctx.program);
    const wooracle_to = await ctx.program.account.woOracle.fetch(toPoolParams.wooracle);
    const oracle_to = await ctx.program.account.oracle.fetch(toPoolParams.oracle);
    const woopool_to = await ctx.program.account.wooPool.fetch(toPoolParams.woopool);

    let state_from = getWooPrice(oracle_from, wooracle_from);
    let state_to = getWooPrice(oracle_to, wooracle_to);

    let spread = state_from.spread.gt(state_to.spread) ? state_from.spread : state_to.spread;
    let fee_rate = woopool_from.feeRate > woopool_to.feeRate ? new BN(woopool_from.feeRate) : new BN(woopool_to.feeRate);

    state_from.spread = spread;
    state_to.spread = spread;

    let decimals_from = newDecimals(
        oracle_from.decimals,
        DEFAULT_QUOTE_DECIMALS, 
        woopool_from.baseDecimals
    );

    let swap_fee_amount = checked_mul_div(fromAmount, fee_rate, TE5U128);
    let swap_fee = checked_mul_div(swap_fee_amount, state_from.price_out, decimals_from.price_dec);
    let remain_amount = fromAmount.sub(swap_fee_amount);

    // console.log('state_from: ', state_from.price_out, state_from.feasible_out);
    // console.log('state_to: ', state_to.price_out, state_to.feasible_out);
    // console.log('woopool_from: ', JSON.stringify(woopool_from));
    
    let from_result = calc_usd_amount_sell_base(
        remain_amount, 
        woopool_from, 
        decimals_from, 
        state_from);
    let remain_usd_amount = from_result.amount;
    
    // TODO Prince: we currently subtract fee on coin, can enable below when we have base usd
    // let (usd_amount, _) = swap_math::calc_usd_amount_sell_base(
    //     from_amount, 
    //     woopool_from, 
    //     &decimals_from, 
    //     wooracle_from.coeff, 
    //     spread, 
    //     &price_from)?;
    
    // let swap_fee = checked_mul_div(usd_amount, fee_rate as u128, TE5U128)?;
    // let remain_amount = usd_amount.checked_sub(swap_fee).unwrap();

    let decimals_to = newDecimals(
        oracle_to.decimals,
        DEFAULT_QUOTE_DECIMALS, 
        woopool_to.baseDecimals
    );

    let to_result = calc_base_amount_sell_usd(
        remain_usd_amount, 
        woopool_to, 
        decimals_to, 
        state_to);
    let to_amount = to_result.amount;

    return {
      to_amount,
      swap_fee_amount,
      swap_fee
    }
  }
