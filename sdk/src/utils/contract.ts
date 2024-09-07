import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Woofi } from "../artifacts/woofi";
import { WoofiContext } from "../context";
import { QuoteFeedAccount, QuotePriceUpdate, QuoteTokenMint, WOOFI_TOKENS } from "../utils/constants";
import { getPythPrice } from "./pyth";

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
    swap_fee: BN,
  }

  const TENPOW18U128 = new BN(10).pow(new BN(18));
  const TE5U128 = new BN(10).pow(new BN(5));

  export const generateQuoteParams = async(
    program: Program<Woofi>
  ) => {
    return generatePoolParams(QuoteTokenMint, QuoteTokenMint, QuoteFeedAccount, QuotePriceUpdate, program);
  }

  export const generatePoolParams = async(
    tokenMint: PublicKey,
    quoteTokenMint: PublicKey,
    feedAccount: PublicKey,
    priceUpdate: PublicKey,
    program: Program<Woofi>
  ) => {
    const [wooconfig] = await PublicKey.findProgramAddressSync(
      [Buffer.from('wooconfig')],
      program.programId
    );

    const [wooracle] = await PublicKey.findProgramAddressSync(
      [Buffer.from('wooracle'), wooconfig.toBuffer(), tokenMint.toBuffer(), feedAccount.toBuffer(), priceUpdate.toBuffer()],
      program.programId
    );

    const [woopool] = await PublicKey.findProgramAddressSync(
      [Buffer.from('woopool'), wooconfig.toBuffer(), tokenMint.toBuffer(), quoteTokenMint.toBuffer()],
      program.programId
    );

    // woopool data should already be created after init
    const {tokenVault} = await program.account.wooPool.fetch(woopool);
  
    // woopool data should already be created after init
    // due to anchor 0.29's js wrapper bug, and consider performance
    // caller should remember the vault for now.
    // const {tokenVault} = await program.account.wooPool.fetch(woopool);
  
    return {
      wooconfig,
      wooracle,
      woopool,
      tokenVault
    }
  }

  export const getOraclePrice = async(
    token: WOOFI_TOKENS,
  ) : Promise<BN> => {
    let basePrice = await getPythPrice(token);
    let quotePrice = await getPythPrice(WOOFI_TOKENS.USDC);

    let price = basePrice.price.mul(new BN(10 ** quotePrice.decimal)).div(quotePrice.price);

    console.log('pyth price in quote token:', price.toNumber());
    return price;
  }
  
  export const getWooPrice = async (
    token: WOOFI_TOKENS,
    wooracle: any,
  ) : Promise<GetStateResult> => {
    const milliseconds = new Date().getTime();
    const now = milliseconds / 1000;

    let pythPrice = await getOraclePrice(token);
  
    const wo_price = wooracle.price;
    const wo_timestamp = wooracle.updatedAt;
    const bound = wooracle.bound;

    const clo_price = pythPrice;
    const wo_feasible = !clo_price.eq(new BN(0)) && new BN(now).lte(wo_timestamp.add(wooracle.staleDuration));
    const wo_price_in_bound = !clo_price.eq(new BN(0)) &&
    ((clo_price.mul(TENPOW18U128.sub(bound)).div(TENPOW18U128)).lte(wo_price) && wo_price.lte(clo_price.mul(TENPOW18U128.add(bound)).div(TENPOW18U128)));
  
    let price_out: BN;
    let feasible_out: boolean;
    if (wo_feasible && wo_price_in_bound) {
        price_out = wo_price;
        feasible_out = true;
    } else {
        price_out = new BN(0);
        feasible_out = false;
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

    console.log('price_out:', price_out.toNumber());
    console.log('feasible_out:', feasible_out);
  
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

  export const checked_mul_div_round = (a: BN, b: BN, c: BN): BN => {
    return a.mul(b).divRound(c)
  }

  export const calc_quote_amount_sell_base = (
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
    let notion_calc_a: BN =
        checked_mul_div(base_amount, state.price_out, decimals.price_dec);
    let notional_swap: BN = checked_mul_div(
        notion_calc_a,
        decimals.quote_dec,
        decimals.base_dec,
    );
    if (notional_swap.gt(woopool.maxNotionalSwap)) {
      throw new Error("Woo pp exceed max notional value");
    }
    
    // gamma = k * price * base_amount; and decimal 18
    let gamma_calc_a: BN =
        checked_mul_div(base_amount, state.price_out, decimals.price_dec);
    let gamma: BN =
        checked_mul_div(gamma_calc_a, state.coeff, decimals.base_dec);
    if (gamma.gt(woopool.maxGamma)) {
          throw new Error("Woo pp exceed max gamma");
    }
  
    // Formula: quoteAmount = baseAmount * oracle.price * (1 - oracle.k * baseAmount * oracle.price - oracle.spread)
    // quoteAmount =
    // (((baseAmount * state.price * decs.quoteDec) / decs.priceDec) *
    //     (uint256(1e18) - gamma - state.spread)) /
    // 1e18 /
    // decs.baseDec;
    // ====>
    // quoteAmount =
    // (((baseAmount * state.price / decs.priceDec) * decs.quoteDec) * (uint256(1e18) - gamma - state.spread)) /
    // 1e18 /
    // decs.baseDec;
    // ====>
    // a = (baseAmount * state.price / decs.priceDec)
    // b = (uint256(1e18) - gamma - state.spread)
    // quoteAmount = ((a * decs.quoteDec) * b) / 1e18 / decs.baseDec;
    //             = ((a * b) / 1e18) * decs.quoteDec / decs.baseDec

    let calc_a: BN = checked_mul_div(base_amount, state.price_out, decimals.price_dec);
    let calc_b: BN = TENPOW18U128
        .sub(gamma)
        .sub(state.spread)
    let calc_c = checked_mul_div(calc_a, calc_b, TENPOW18U128);
    let quote_amount = checked_mul_div(
        calc_c,
        decimals.quote_dec,
        decimals.base_dec,
    );

    // newPrice = oracle.price * (1 - k * oracle.price * baseAmount)
    let new_price = checked_mul_div(
        TENPOW18U128.sub(gamma),
        state.price_out,
        TENPOW18U128,
    );

    return {
      amount: quote_amount,
      new_price
    }
  }

  export const calc_base_amount_sell_quote = (
    quote_amount: BN,
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
  
    if (quote_amount.gt(woopool.maxNotionalSwap)) {
        throw new Error("Woo pp exceed max notional value");
    }

    // gamma = k * quote_amount; and decimal 18
    let gamma: BN = checked_mul_div(
        quote_amount,
        state.coeff,
        decimals.quote_dec,
    );
    if (gamma.gt(woopool.maxGamma)) {
      throw new Error("Woo pp exceed max gamma");
    }

    // Formula: baseAmount = quoteAmount / oracle.price * (1 - oracle.k * quoteAmount - oracle.spread)
    let calc_a: BN = quote_amount
        .mul(decimals.base_dec);
    let calc_b: BN = checked_mul_div(calc_a, decimals.price_dec, state.price_out);
    let calc_c: BN = TENPOW18U128
        .sub(gamma)
        .sub(state.spread);
    let calc_d: BN = checked_mul_div(calc_b, calc_c, TENPOW18U128);
    let base_amount = calc_d.div(decimals.quote_dec);

    // new_price = oracle.price / (1 - k * quoteAmount)
    let new_price: BN = checked_mul_div(
        TENPOW18U128,
        state.price_out,
        TENPOW18U128.sub(gamma),
    );

    return {
      amount: base_amount,
      new_price
    }
  }

  export const tryCalculate = async(
    ctx: WoofiContext,
    fromAmount: BN,
    fromToken: WOOFI_TOKENS,
    fromTokenMint: PublicKey,
    fromOracleFeedAccount: PublicKey,
    fromPriceUpdate: PublicKey,
    toToken: WOOFI_TOKENS,
    toTokenMint: PublicKey,
    toOracleFeedAccount: PublicKey,
    toPriceUpdate: PublicKey,
    quoteTokenMint: PublicKey,
  ): Promise<QueryResult> => {
    const fromPoolParams = await generatePoolParams(fromTokenMint, quoteTokenMint, fromOracleFeedAccount, fromPriceUpdate, ctx.program);
    const wooracle_from = await ctx.program.account.woOracle.fetch(fromPoolParams.wooracle);
    const woopool_from = await ctx.program.account.wooPool.fetch(fromPoolParams.woopool);

    const toPoolParams = await generatePoolParams(toTokenMint, quoteTokenMint, toOracleFeedAccount, toPriceUpdate, ctx.program);
    const wooracle_to = await ctx.program.account.woOracle.fetch(toPoolParams.wooracle);
    const woopool_to = await ctx.program.account.wooPool.fetch(toPoolParams.woopool);

    let fee_rate = woopool_from.feeRate > woopool_to.feeRate ? new BN(woopool_from.feeRate) : new BN(woopool_to.feeRate);

    let decimals_from = newDecimals(
      wooracle_from.priceDecimals,
      wooracle_from.quoteDecimals,
      woopool_from.baseDecimals
    );

    let quote_amount = fromAmount;
    if (!woopool_from.tokenMint.equals(woopool_from.quoteTokenMint)) {
      let state_from = await getWooPrice(fromToken, wooracle_from);

      let {amount, new_price} = calc_quote_amount_sell_base(
        fromAmount, 
        woopool_from, 
        decimals_from, 
        state_from);

      quote_amount = amount;
    }

    let swap_fee = checked_mul_div_round(quote_amount, fee_rate, TE5U128);
    quote_amount = quote_amount.sub(swap_fee);

    let decimals_to = newDecimals(
      wooracle_to.priceDecimals,
      wooracle_to.quoteDecimals,
      woopool_to.baseDecimals,
    );

    let to_amount = quote_amount;
    if (!woopool_to.tokenMint.equals(woopool_to.quoteTokenMint)) {
      let state_to = await getWooPrice(toToken, wooracle_to);

      let {amount, new_price} = calc_base_amount_sell_quote(
        quote_amount,
        woopool_to,
        decimals_to,
        state_to,
      );
      to_amount = amount;
    }

    return {
      to_amount,
      swap_fee
    }
  }