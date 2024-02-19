import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Woospmmtres } from "../target/types/woospmmtres";
import { assert } from "chai";

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

  describe("#create_oracle()", async () => {
    it("creates an oracle account", async () => {
      const feedAccount = new anchor.web3.PublicKey("HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6");
      const chainLinkProgramAccount = new anchor.web3.PublicKey("HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny")

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
  
      await program
        .methods
        .createOracle()
        .accounts({
          cloracle,
          wooracle,
          admin: provider.wallet.publicKey,
          feedAccount: feedAccount,
          chainlinkProgram: chainLinkProgramAccount
        })
        .rpc();
  
      const oracleItemData = await program.account.woOracle.fetch(wooracleAccount);

      assert.ok(
        oracleItemData.authority.equals(provider.wallet.publicKey)
      );
    });
  });
});
