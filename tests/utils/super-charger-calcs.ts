import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { ConfirmOptions, SystemProgram } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { solTokenMint, usdcTokenMint } from "./test-consts";
import { getCluster } from "../global";
import { SuperCharger } from "../../target/types/super_charger";
import { sendAndConfirm } from "./web3";
import { airdropIfRequired } from "@solana-developers/helpers";
import { createAssociatedTokenAccount } from "./token";

const sleep = async (ms: number) => {
  return new Promise(r => setTimeout(r, ms));
};

export class SuperChargerCalcs {
  public provider: anchor.AnchorProvider;
  public program: Program<SuperCharger>;
  public sol_priceFeed;
  public usdc_priceFeed;

  public stakeTokenMint: anchor.web3.PublicKey;

  public confirmOptionsRetryTres: ConfirmOptions = { maxRetries: 3, commitment: "confirmed" };
  public tenpow28 = new BN(10).pow(new BN(28));
  public tenpow18 = new BN(10).pow(new BN(18));
  public tenpow16 = new BN(10).pow(new BN(16));
  public tenpow15 = new BN(10).pow(new BN(15));
  public tenpow12 = new BN(10).pow(new BN(12));
  public tenpow14 = new BN(10).pow(new BN(14));

  public initEnv = () => {
    this.provider = anchor.AnchorProvider.env();
    // Configure the client to use the local cluster.
    anchor.setProvider(this.provider);

    this.program = anchor.workspace.SuperCharger as Program<SuperCharger>;

    // TODO Prince: for test simplicity, change base to sol for test
    // this.stakeTokenMint = usdcTokenMint;
    this.stakeTokenMint = solTokenMint;
  };

  // debt = borrowedPrincipal + borrowedInterest
  public debt = (lendingManager) : BN =>  {
    return new BN(lendingManager.borrowedPrincipal).add(new BN(lendingManager.borrowedInterest));
  }

  public balance = (stakeVaultAmount: BN, lendingManager): BN => {
    let lendingBalance = this.debt(lendingManager);
    return stakeVaultAmount.add(lendingBalance);
  }

  public get_price_per_full_share = (
    stakeVaultAmount: BN,
    stakeTokenDecimals: BN,
    lendingManager,
    weTokenMintSupply: BN,
    weTokenDecimals: BN,
  ): BN => {
    console.log('++++++start get_price_per_full_share input:');
    console.log('stakeVaultAmount:' + stakeVaultAmount);
    console.log('stakeTokenDecimals:' + stakeTokenDecimals);
    console.log('weTokenMintSupply:' + weTokenMintSupply);
    console.log('weTokenDecimals:' + weTokenDecimals);
    console.log('++++++start get_price_per_full_share calc:');

    let totalBalance = this.balance(stakeVaultAmount, lendingManager);
    console.log('totalBalance:' + totalBalance);

    let stakeTokenDec = new BN(10).pow(stakeTokenDecimals);
    let weTokenDec = new BN(10).pow(weTokenDecimals);
  
    return this.calculate_share_price(totalBalance, weTokenMintSupply, stakeTokenDec, weTokenDec);
  }

  // share_price = (total_balance / total_we_token_amount) * (we_decimals / base_decimals)
  public calculate_share_price = (
    total_balance: BN,
    total_we_token_amount: BN,
    stakeTokenDecimal: BN,
    weTokenDecimal: BN
  ): BN => {
    if (total_we_token_amount == new BN(0)) {
        return this.tenpow18;
    } else {
        return total_balance.mul(this.tenpow18)
                            .mul(weTokenDecimal)
                            .div(total_we_token_amount)
                            .div(stakeTokenDecimal)
        ;
    }
  }

  // shares = deposit_amount / share_price
  public shares = (amount: BN, share_price: BN) => {
    let shares = amount.mul(this.tenpow18).div(share_price);
    return shares;
  }

}