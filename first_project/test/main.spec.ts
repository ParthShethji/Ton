import { Cell, toNano } from "@ton/core";
import { hex } from "../build/main.compiled.json"
import {Blockchain} from "@ton/sandbox"
import { MainContract } from "../wrappers/mainContract";
import "@ton/test-utils"

describe("main.fc contract tests", () => {

    it("gettind addres correctly", async () => {
      const blockchain = await Blockchain.create();
      const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0]

      // to create instance of contract the way to use it is to write wrappers for your contract using the Contract interface from ton-core
      const myContract =  blockchain.openContract(
        await MainContract.createFromConfig({}, codeCell)
      )

      const senderWallet = await blockchain.treasury("sender")
      const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(), toNano("0.05")); //10 to power 9 nanos is 1 ton

      expect((sentMessageResult).transactions).toHaveTransaction({
        from: senderWallet.address,
        to: myContract.address,
        success: true,
      });

      const data = await myContract.getData();

    expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());

    });
  });
  