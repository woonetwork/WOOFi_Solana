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

    // TODO Prince: for test simplicity, change base to sol for test
    // this.stakeTokenMint = usdcTokenMint;
    this.stakeTokenMint = solTokenMint;
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

  public generateSuperChargerPDAs = async () => {
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

    return {
      superChargerConfig,
      superCharger,
      lendingManager,
      stakeVault,
      weTokenMint,
      weTokenVault
    }
  }

  public createSuperCharger = async (woopoolTokenVault: anchor.web3.PublicKey) => {
    const {
      superChargerConfig,
      superCharger,
      lendingManager,
      stakeVault,
      weTokenMint,
      weTokenVault
    } = await this.generateSuperChargerPDAs();

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

  public initializeUser = async (payer: web3.Signer) => {
    const {
      superChargerConfig,
      superCharger,
      lendingManager,
      stakeVault,
      weTokenMint,
      weTokenVault
    } = await this.generateSuperChargerPDAs();
    
    const [userState] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('superchargeruserstate'), superCharger.toBuffer(), payer.publicKey.toBuffer()],
      this.program.programId
    );

    let userStateData = null;
    try {
      userStateData = await this.program.account.userState.fetch(userState);
    } catch (e) {
      const error = e as Error;
      if (error.message.indexOf("Account does not exist") >= 0) {
          await this.getLatestBlockHash();

          const tx = await this.program
            .methods
            .initializeUser()
            .accounts({
              payer: payer.publicKey,
              userState,
              superCharger,
              systemProgram: web3.SystemProgram.programId,
            })
            .transaction();
            
            await sendAndConfirm(this.provider, tx, [payer]);
      }
    }

    if (userStateData == null) {
      userStateData = await this.program.account.userState.fetch(userState);
    }

    return userStateData;
  }

  public increaseWSOL = async (receiver: web3.Keypair) => {
    let fromAmount = 0.1 * web3.LAMPORTS_PER_SOL;

    let payerPubkey = this.provider.wallet.publicKey;
    if (getCluster() == 'localnet') {
      // payerPubkey = keypair.publicKey;
      await airdropIfRequired(
        this.provider.connection,
        payerPubkey,
        1 * web3.LAMPORTS_PER_SOL,
        0.5 * web3.LAMPORTS_PER_SOL,
      );
    }

    const wsolTokenAccount = await createAssociatedTokenAccount(
      this.provider,
      solTokenMint,
      receiver.publicKey,
      payerPubkey
    );
    const usdcTokenAccount = await createAssociatedTokenAccount(
      this.provider,
      usdcTokenMint,
      receiver.publicKey,
      payerPubkey
    );
    console.log("receiver PublicKey:" + receiver.publicKey);
    console.log('wsolTokenAccount:' + wsolTokenAccount);
    console.log('usdcTokenAccount:' + usdcTokenAccount);    

    // increase from pool liquidity
    const transferTranscation = new web3.Transaction().add(
      // transfer SOL to from wallet
      SystemProgram.transfer({
        fromPubkey: payerPubkey,
        toPubkey: receiver.publicKey,
        lamports: fromAmount,
      }),
      // trasnfer SOL to WSOL into ata account
      SystemProgram.transfer({
        fromPubkey: receiver.publicKey,
        toPubkey: wsolTokenAccount,
        lamports: fromAmount * 0.8,
      }),
      // sync wrapped SOL balance
      token.createSyncNativeInstruction(wsolTokenAccount)
    );

    await this.getLatestBlockHash();
    await this.provider.sendAndConfirm(transferTranscation, [receiver], { commitment: "confirmed" });

    return {
      wsolTokenAccount,
      usdcTokenAccount,
    }
  }

  public deposit = async (depositAmount: BN, user: web3.Keypair, userDepositAccount: web3.PublicKey) => {
    const {
      superChargerConfig,
      superCharger,
      lendingManager,
      stakeVault,
      weTokenMint,
      weTokenVault
    } = await this.generateSuperChargerPDAs();
    
    const [userState] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('superchargeruserstate'), superCharger.toBuffer(), user.publicKey.toBuffer()],
      this.program.programId
    );

    console.log('userState:{}', userState);
    const userWeAccount = await createAssociatedTokenAccount(
      this.provider,
      weTokenMint,
      user.publicKey,
      user.publicKey,
      [user]
    );
    console.log('userWeAccount:{}', userWeAccount);

    const tx = await this.program
                .methods
                .deposit(new BN(depositAmount))
                .accounts({
                  user: user.publicKey,
                  userState,
                  superCharger,
                  lendingManager,
                  stakeVault,
                  userDepositAccount,
                  stakeTokenMint: this.stakeTokenMint,
                  tokenProgram: token.TOKEN_PROGRAM_ID,
                  weTokenMint,
                  userWeAccount,
                  weTokenProgram: token.TOKEN_PROGRAM_ID
                }).transaction();
    await sendAndConfirm(this.provider, tx, [user]);

    return {
      userWeAccount,
      stakeVault,
      lendingManager,
    }
  }

  public setWoopoolTokenVault = async(woopoolTokenVault: web3.PublicKey) => {
    const {
      superChargerConfig,
      superCharger,
      lendingManager,
      stakeVault,
      weTokenMint,
      weTokenVault
    } = await this.generateSuperChargerPDAs();
    
    const tx = await this.program
                .methods
                .setLendingManagerWoopool(woopoolTokenVault)
                .accounts({
                  authority: this.provider.wallet.publicKey,
                  superChargerConfig,
                  lendingManager,
                }).transaction();
    await sendAndConfirm(this.provider, tx);
  }

  public borrow = async (borrowAmount: BN) => {
    const {
      superChargerConfig,
      superCharger,
      lendingManager,
      stakeVault,
      weTokenMint,
      weTokenVault
    } = await this.generateSuperChargerPDAs();
    
    const lendingManagerData = await this.program.account.lendingManager.fetch(lendingManager);
    const woopoolTokenVault = lendingManagerData.woopoolTokenVault;

    const tx = await this.program
                .methods
                .borrow(borrowAmount)
                .accounts({
                  authority: this.provider.wallet.publicKey,
                  superChargerConfig,
                  superCharger,
                  lendingManager,
                  stakeVault,
                  woopoolTokenVault,
                  tokenProgram: token.TOKEN_PROGRAM_ID
                }).transaction();
    await sendAndConfirm(this.provider, tx);

    return {
      lendingManager,
      stakeVault,
      woopoolTokenVault
    }
  }
}