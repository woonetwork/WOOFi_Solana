import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Woospmmtres } from "../target/types/woospmmtres";
import { assert } from "chai";
import Decimal from "decimal.js";
import moment from "moment";

describe("woospmmtres", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Woospmmtres as Program<Woospmmtres>;

  // it("Is initialized!", async () => {
  //   // Add your test here.
  //   const tx = await program.methods.initialize().rpc();
  //   console.log("Your transaction signature", tx);
  // });

  let cloracleAccount;
  let wooracleAccount;
  const feedAccount = new anchor.web3.PublicKey("HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6");
  const chainLinkProgramAccount = new anchor.web3.PublicKey("HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny")


  describe("#create_oracle()", async () => {
    it("creates an oracle account", async () => {

      const [cloracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('cloracle'), feedAccount.toBuffer(), chainLinkProgramAccount.toBuffer()],
        program.programId
      );

      const [wooracle] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('wooracle'), feedAccount.toBuffer()],
        program.programId
      );

      cloracleAccount = cloracle;
      wooracleAccount = wooracle;
  
      // await program
      //   .methods
      //   .createOracle()
      //   .accounts({
      //     cloracle,
      //     wooracle,
      //     admin: provider.wallet.publicKey,
      //     feedAccount: feedAccount,
      //     chainlinkProgram: chainLinkProgramAccount
      //   })
      //   .rpc();
  
      const oracleItemData = await program.account.woOracle.fetch(wooracleAccount);

      assert.ok(
        oracleItemData.authority.equals(provider.wallet.publicKey)
      );
    });

    describe("#update_cloracle()", async () => {
      it("updates chain link oracle account", async () => {
      
        await program
          .methods
          .updateCloracle()
          .accounts({
            cloracle: cloracleAccount,
            authority: provider.wallet.publicKey,
            feedAccount: feedAccount,
            chainlinkProgram: chainLinkProgramAccount
          })
          .rpc();
    
        const result = await program.account.clOracle.fetch(cloracleAccount);
        const price = new Decimal(result.round.toNumber()).mul(new Decimal(10).pow(-result.decimals));
        const updatedAt = moment.unix(result.updatedAt.toNumber());

        console.log(
          `price - ${price}`
        );

        console.log(`round - ${result.round}`);
        console.log(`decimal - ${result.decimals}`);
        console.log(`updated at - ${updatedAt}`);

        assert.ok(
          result.authority.equals(provider.wallet.publicKey),
          "oracle should be finalized"
        );
      });
    });

    
  });
});
