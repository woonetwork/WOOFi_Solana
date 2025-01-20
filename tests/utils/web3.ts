import { AnchorProvider, web3 } from "@coral-xyz/anchor";
import { getLogs } from "@solana-developers/helpers";

export async function sendAndConfirm(
  provider: AnchorProvider,
  tx: web3.Transaction,
  signers?: web3.Signer[]
): Promise<web3.TransactionSignature> {
    
    tx.recentBlockhash = (await provider.connection.getLatestBlockhash()).blockhash;
    console.log('tx.recentBlockhash', tx.recentBlockhash);
    const sig = await provider.sendAndConfirm(tx, signers);
    
    const logs = await getLogs(provider.connection, sig);
    console.log(logs);

    return sig;
}

