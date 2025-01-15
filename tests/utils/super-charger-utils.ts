import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { ConfirmOptions } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { usdcTokenMint } from "./test-consts";
import { getCluster } from "../global";
import { SuperCharger } from "../../target/types/super_charger";
import { sendAndConfirm } from "./web3";

const sleep = async (ms: number) => {
  return new Promise(r => setTimeout(r, ms));
};

export class SuperChargerUtils {
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

    this.stakeTokenMint = usdcTokenMint;
  };

  public getLatestBlockHash = async () => {
    if (getCluster() == 'localnet') {
      return;
    }

    const blockhashResponse = await this.provider.connection.getLatestBlockhash();
    const lastValidBlockHeight = blockhashResponse.lastValidBlockHeight - 150;
    let blockheight = await this.provider.connection.getBlockHeight();
    console.log("blockhashResponse", blockhashResponse);
    console.log("current blockheight", blockheight);

    while (blockheight <= lastValidBlockHeight) {
      await sleep(500);
      blockheight = await this.provider.connection.getBlockHeight();
      console.log("current blockheight", blockheight);
    }
  }

  public getReturnLog = (confirmedTransaction) => {
    const prefix = "Program return: ";
    let log = confirmedTransaction.meta.logMessages.find((log) =>
      log.startsWith(prefix)
    );
    log = log.slice(prefix.length);
    const [key, data] = log.split(" ", 2);
    const buffer = Buffer.from(data, "base64");
    return [key, data, buffer];
  };

  public createConfig = async () => {
    const [superChargerConfig] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('superchargerconfig')],
      this.program.programId
    );
    
    let superChargerConfigData = null;
    try {
      superChargerConfigData = await this.program.account.superChargerConfig.fetch(superChargerConfig);
    } catch (e) {
      const error = e as Error;
      if (error.message.indexOf("Account does not exist") >= 0) {
          await this.getLatestBlockHash();

          const tx = await this.program
            .methods
            .createConfig()
            .accounts({
              superChargerConfig,
              authority: this.provider.wallet.publicKey,
            })
            .transaction();

          await sendAndConfirm(this.provider, tx);
      }
    }

    if (superChargerConfigData == null) {
      superChargerConfigData = await this.program.account.superChargerConfig.fetch(superChargerConfig);
    }

    return superChargerConfigData;
  }

  public createSuperCharger = async (woopoolTokenVault: anchor.web3.PublicKey) => {
    const [superChargerConfig] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('superchargerconfig')],
      this.program.programId
    );
    
    const [superCharger] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('supercharger'), superChargerConfig.toBuffer(), this.stakeTokenMint.toBuffer()],
      this.program.programId
    );

    const [lendingManager] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('lendingmanager'), superChargerConfig.toBuffer(), this.stakeTokenMint.toBuffer()],
      this.program.programId
    );

    const [stakeVault] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('superchargerstakevault'), superCharger.toBuffer(), this.stakeTokenMint.toBuffer()],
      this.program.programId
    );

    const [weTokenMint] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('superchargerwetokenmint'), superCharger.toBuffer(), this.stakeTokenMint.toBuffer()],
      this.program.programId
    );

    const [weTokenVault] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('superchargerwetokenvault'), superCharger.toBuffer(), this.stakeTokenMint.toBuffer()],
      this.program.programId
    );

    let superChargerData = null;
    try {
      superChargerData = await this.program.account.superCharger.fetch(superCharger);
    } catch (e) {
      const error = e as Error;
      if (error.message.indexOf("Account does not exist") >= 0) {
          await this.getLatestBlockHash();

          const tx = await this.program
            .methods
            .createSuperCharger()
            .accounts({
              superChargerConfig,
              authority: this.provider.wallet.publicKey,
              superCharger,
              lendingManager,
              stakeTokenMint: this.stakeTokenMint,
              stakeVault,
              weTokenMint,
              weTokenVault,
              stakeTokenProgram: token.TOKEN_PROGRAM_ID, 
              weTokenProgram: token.TOKEN_PROGRAM_ID,
              systemProgram: web3.SystemProgram.programId,
              woopoolTokenVault
            })
            .transaction();
            
            await sendAndConfirm(this.provider, tx);
      }
    }

    if (superChargerData == null) {
      superChargerData = await this.program.account.superCharger.fetch(superCharger);
    }

    return superChargerData;
  }
}