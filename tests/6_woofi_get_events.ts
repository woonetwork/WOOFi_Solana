import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import {BorshCoder, EventParser} from "@coral-xyz/anchor";
import { PoolUtils } from "./utils/pool";
import { solTokenMint, solPriceUpdate } from "./utils/test-consts";

describe("woofi", () => {
  const poolUtils = new PoolUtils();
  poolUtils.initEnv();

  const provider = poolUtils.provider;
  const program = poolUtils.program;

  // SOL/USD
  const solFeedAccount = poolUtils.solFeedAccount;
  // USDC/USD
  const usdcFeedAccount = poolUtils.usdcFeedAccount;
  const quoteFeedAccount = usdcFeedAccount;

  let wooracleAccount: anchor.web3.PublicKey;

  describe("#get_events()", async () => {
    it("get woofi events", async () => {

      const setSpread = new BN(800);

      const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('wooracle'), solTokenMint.toBuffer(), solFeedAccount.toBuffer(), solPriceUpdate.toBuffer()],
        program.programId
      );

      wooracleAccount = wooracle;

      const pubKey = new anchor.web3.PublicKey(program.programId);
      provider.opts.commitment = 'confirmed';
      let transactionList = await provider.connection.getSignaturesForAddress(pubKey, {limit: 10}, 'finalized');
      let signatureList = transactionList.map(transaction => transaction.signature);

      for await (const sig of signatureList) {
        if (sig == '54SUf5BZPVPaqiHpzJ7mbmnJV5sc7wTH7Kx7M2XMVzwLgHLLC15i8TUUg5bqaBh1gnhT1yi69aoaExLDfLVHLZLA') {
            const tx = await provider.connection.getParsedTransaction(sig, 
                {maxSupportedTransactionVersion: 0, commitment: 'finalized'});
            const eventParser = new EventParser(program.programId, new BorshCoder(program.idl));
            const events = eventParser.parseLogs(tx.meta.logMessages);
            for (let event of events) {
                console.log(event);
            }

        }
      }

      console.log(signatureList);

    });
  });
  
});
