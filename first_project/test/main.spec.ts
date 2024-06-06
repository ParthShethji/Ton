// import { Cell, toNano } from "@ton/core";
// import { hex } from "../build/main.compiled.json"
// import {Blockchain, SandboxContract, TreasuryContract} from "@ton/sandbox"
// import { MainContract } from "../wrappers/mainContract";
import "@ton/test-utils"

// describe("main.fc contract tests", () => {

//     it("getting addresses correctly and updating counters", async () => {
//       const blockchain = await Blockchain.create();
//       const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0]

//       const intiAddress = await blockchain.treasury("initAddress");
//       const owner_address = await blockchain.treasury("ownerAddress")

//       // to create instance of contract the way to use it is to write wrappers for your contract using the Contract interface from ton-core
//       const myContract =  blockchain.openContract(
//         await MainContract.createFromConfig({
//           number: 0,
//           address: intiAddress.address,
//           owner_address: owner_address.address
//         }, 
//         codeCell)
//       )

//       const senderWallet = await blockchain.treasury("sender")
//       const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(), toNano("0.05")); //10 to power 9 nanos is 1 ton

//       expect((sentMessageResult).transactions).toHaveTransaction({
//         from: senderWallet.address,
//         to: myContract.address,
//         success: true,
//       });

//       const data = await myContract.getData();

//     expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());

//     });
//   });
  

  import { Cell, toNano } from "@ton/core";
  import { hex } from "../build/main.compiled.json";
  import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
  } from "@ton/sandbox";
  import { MainContract } from "../wrappers/mainContract";
  // import "@ton-community/test-utils";
  // import { compile } from "@ton-community/blueprint";

  describe("main.fc contract tests", () => {
    let blockchain: Blockchain;
    let myContract: SandboxContract<MainContract>;
    let initWallet: SandboxContract<TreasuryContract>;
    let ownerWallet: SandboxContract<TreasuryContract>;

    // beforeAll(async () => {
    //   codeCell = await compile("MainContract");
    // });

    beforeEach(async () => {
      blockchain = await Blockchain.create();
      initWallet = await blockchain.treasury("initWallet");
      ownerWallet = await blockchain.treasury("ownerWallet");
  
      const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];

      myContract = blockchain.openContract(
        await MainContract.createFromConfig(
          {
            number: 0,
            address: initWallet.address,
            owner_address: ownerWallet.address,
          },
          codeCell
        )
      );
    });

  it("should get the proper most recent sender address", async () => {
    const senderWallet = await blockchain.treasury("sender");

    const sentMessageResult = await myContract.sendIncrement(
      senderWallet.getSender(),
      toNano("0.05"),
      1
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: true,
    });

    const data = await myContract.getData();

    expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());
    expect(data.number).toEqual(1);
  });
  it("successfully deposits funds", async () => {
    const senderWallet = await blockchain.treasury("sender");

    const depositMessageResult = await myContract.sendDeposit(
      senderWallet.getSender(),
      toNano("5")
    );

    expect(depositMessageResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: true,
    });

    const balanceRequest = await myContract.getBalance();

    expect(balanceRequest.number).toBeGreaterThan(toNano("4.99"));
  });
  it("should return deposit funds as no command is sent", async () => {
    const senderWallet = await blockchain.treasury("sender");

    const depositMessageResult = await myContract.sendNoCodeDeposit(
      senderWallet.getSender(),
      toNano("5")
    );

    expect(depositMessageResult.transactions).toHaveTransaction({
      from: myContract.address,
      to: senderWallet.address,
      success: true,
    });

    const balanceRequest = await myContract.getBalance();

    expect(balanceRequest.number).toBe(0);
  });
  it("successfully withdraws funds on behalf of owner", async () => {
    const senderWallet = await blockchain.treasury("sender");

    await myContract.sendDeposit(senderWallet.getSender(), toNano("5"));

    const withdrawalRequestResult = await myContract.sendWithdrawalRequest(
      ownerWallet.getSender(),
      toNano("0.05"),
      toNano("1")
    );

    expect(withdrawalRequestResult.transactions).toHaveTransaction({
      from: myContract.address,
      to: ownerWallet.address,
      success: true,
      value: toNano(1),
    });
  });
  it("fails to withdraw funds on behalf of not-owner", async () => {
    const senderWallet = await blockchain.treasury("sender");

    await myContract.sendDeposit(senderWallet.getSender(), toNano("5"));

    const withdrawalRequestResult = await myContract.sendWithdrawalRequest(
      senderWallet.getSender(),
      toNano("0.5"),
      toNano("1")
    );

    expect(withdrawalRequestResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: false,
      exitCode: 103,
    });
  });
  it("fails to withdraw funds because lack of balance", async () => {
    const withdrawalRequestResult = await myContract.sendWithdrawalRequest(
      ownerWallet.getSender(),
      toNano("0.5"),
      toNano("1")
    );

    expect(withdrawalRequestResult.transactions).toHaveTransaction({
      from: ownerWallet.address,
      to: myContract.address,
      success: false,
      exitCode: 104,
    });
  });
});