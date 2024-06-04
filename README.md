# Ton
The Open Network (TON) is a decentralized and open internet platform made up of several components. These include: TON Blockchain, TON DNS, TON Storage, and TON Sites. 

## Custodial vs Non-custodial services
Custodial services are services that are managed by the party responsible for the funds deposited. Online exchanges are typically custodial services because they need to take the coins or tokens on the balance of their own wallets to guarantee settlement of trades.


Non-custodial services are services that do not hold user funds, and users have direct personal control over them.


## Ton blockchain and account

TON's blockchain serves as a ledger for state transitions. It's a ledger of changes in the state of arbitrary accounts.

Every smart contract is also called an account.

accounts:

    has its own storage
    has its own unique address
    store the balance of Toncoins
    store the program code

👀 Contracts have no visibility into anything outside themselves. By isolating contracts from each other, TON is infinitely scalable. TON smart contracts concept look very similar to computers on the internet

✅ The network guarantees the delivery of messages
❌ doesn't guarantee how long this will take.


Every contract has its own little transaction that means it own blockchain.
The blockchain itself is just a data structure. To change it, there must be a signal from outside


Consensus prevents double spending by validators. Proof-of-Stake is used, with validators putting up security deposits.

If the load on the system increases and the number of account grows, then the sets of validators could be split in subgroups. TON allows sharding to be pretty much unlimited down to individual contracts, depending on the load.


In TON we have two-tier system:

We have masterchain. - When all the validator groups achieve agreement on their parts of the blockchain, they record the state of the accounts on a central non-shardable blockchain called masterchain, It is expensive in terms of fees.
It doesn't scale.
It contains only the configuration of the network and snapshots of all subchains from various validator groups.

We have basechain  - The basechain is virtual, because it actually contains all of these various accounts that could be sharded infinitely down to each individual account and could be split and merged into the shardchains.


## Contracts 
Contract also has the identifier or address. This address is a cryptographic hash of the contract's initial data and initial code. done bcoz You don't want to change the address whenever the state of the contract changes, and that's why the address is uniquely identifying the very initial state with which the contract was created

⛺ The second important aspect of the contracts is their locality.
This means that whatever changes are happening to a contract in one transaction are completely independent from changes to another contract in another transaction somewhere else on the blockchain. This is the key to infinite scalability of TON blockchain.

Frozen Contracts - If the contract runs out of funds and because of the rent, then it may become frozen 😰.
This means that the network will offload all of its data and replace it with a cryptographic hash of its latest state. In this case data is not lost, but the network optimizes the storage 💿 and offloads expensive data out of the storage of the validators.

## Tokens
📗 Tokenization – process of breaking down the value stored in the system into transferable chunks.

Non-fungible tokens 
TON DNS records
Telegram usernames

Fungible tokens.
Currencies
Cryptocurrencies
Shares
Voting rights

Instead of having one central contract to manage all token balances, each user has their own mini contract (called a token wallet) that manages their tokens. When you want to send tokens to someone else, your token wallet communicates directly with the recipient's token wallet.This ensures that all token wallets behave consistently, but each one operates independently for each user.


## Cells
The interesting thing about TON is that all the data structures in the entire blockchain, within your own smart contracts and in all the standard data structures in the consensus protocol, they are all built on top of cells. 

Cell is a small building block of the entire data structures in TON blockchain. Each cell has up to 1023 bits of data and up to four references to other cells. And this allows you to use cells to build arbitrarily complex and nested data structures

When the contract receives the incoming message the validating node instantiates TVM which is a special purpose stack-based virtual machine that is designed to execute TON bytecode. This virtual machine is loaded with the current state of a contract and its current code and both the state and the code are stored in the cells. Now all of this data is loaded up in TVM and the job of TVM is really to just go through the code, execute it, verify all the network rules regarding gas costs and the correctness of all the operations and in the end return either an error or a new state of a contract that will be stored in its place. 

❗ The cool result of this design decision is that the entire state of the blockchain can be effectively Merkle-ized which means you can create the Merkle proof, the cryptographic proof of any portion of the data in the blockchain at any state of it.

The only available option for your memory layout is a tree of cells in a contract.

## messages and communication phases

There are two kinds of incoming messages that could arrive to a contract: external and internal ones.

External message is really just a string of data that comes from nowhere from the perspective of a blockchain. This data is not authenticated by itself. It doesn't have any money attached to it in form of Toncoins. And it can really contain anything that the author of a contract wants   

The internal messages are those that are sent by contracts to other contracts. And these messages have a little bit more rich structure. First of all, the internal messages can carry the balances. And when the contract sends the message to another contract, they can attach any amount of coins to it. Second, those messages are securely authenticated by the address of a sending contract. And the entire architecture of TON  guarantees the contracts that this address of a sender is correct. 


 If the contract wants to process different kinds of messages, then it will use something that we call opcodes.
If the contract wants to process different kinds of messages, then it will use something that we call opcodes.



### There are five phases that the transaction goes through: 
Storage phase is the phase when the blockchain charges the contract for all the rent that it owes for its existence. And the rent is computed as a price per bit per second.

Credit phase is the phase when the coins attached to incoming message get credited to the contract. 

In computation phase the TVM executes the code and verifies each operation and also keeps track of gas usage. 

In action phase, the smart contract transitions to a new state and outgoing messages are processed.

Bounce phase happens if the contract failed and the incoming message had a flag saying I'm a bounceable message. It means that at this phase if there is any failure and there's any money left from the incoming message, then the contract would create the outgoing message back to the sender to bounce the money back. 


## Authentication of messages
The first type of authentication is signature-based authentication, for example, in the case of an external message, the wallet reads  reads off 64 bytes of data 6️⃣4️⃣, that is the signature for the rest of the message, verifies that the signature is correct, and then works with the rest of the message.

The second mechanism is the authentication of a message sender. All the internal messages in TON are identified by a message sender that is guaranteed to be correct and secure by the TON protocol. So every time a contract receives an internal message, it knows for sure from which other contract the message was received.

The third one is building on top of the message sender. Since the addresses in the TON ecosystem are not simply unique identifiers of the contracts, but they're also cryptographically secure hashes of the contract code and data, and more specifically, initial code and data, so they don't change when the data changes. And since those addresses are cryptographic commitments to this code, you could verify what kind of code is talking on the other end by checking the message sender. Also called DNA check

The fourth type of authentication is something not to forget about. It is a lack of authentication at all. ❓ Isn't it insecure to not authenticate the messages? In certain situations, this is where the security actually lies. You can deal with a system that must be censorship resistant like decentralized staking pool


## Fees
In TON there are generally three categories of fees. This is the gas cost, the rent, and the message fees.

The idea behind gas cost is that for each operation in your code, there is a nominal gas cost that allows you to specify how some operations are more or less expensive than the others. 

Rent is simply defined as a cost of a single bit of data that the contract stores per unit of time, which is a second. 

Message fees come to play in the action phase when your contract creates the outgoing messages and specifies new state for itself. And these are typically quite low fees because there's not much data transmitted between the contracts.
comes to play in the action phase when


The contracts per user are called Jetton wallets and the job of those Jetton wallets is to hold the balance of a token for each individual user.🍞 DNA-check is used here because the code of the Jettons is the same.

Instead of directly processing messages, users receive unique tokens encapsulating their requests and votes. These tokens, owned by users, simplify tracking and prevent malicious actors from overwhelming the contract. Honest users gather votes on temporary request tokens, and once a threshold is met, the multi-signature contract executes the action after verifying the request's authenticity. This tokenization streamlines the process and focuses on the temporary state of the system rather than individual contract shares or values.

👀 Since the wallet version 4, the wallets support the plugins that enable people to create subscription payments.


## Smart contract Development cycle
We could think of a TON contract as a satellite that is launched to the orbit of the Earth and the satellite is flying around the Earth, interacting with other satellites, it's able to accept information from the Earth, process it and send some results. But before we actually launch it to the space, there's a few stages it has to go through. 

In the first stage we prepare our local setup that will enable us to bring our satellite smart contract through every other stage.
The actual smart contract on TON blockchain is stored and executed as a binary code.
In the second stage we describe the commands that our smart contract is able to process.
In the third stage we just write our FunC code.
In the fourth stage we test our FunC code behavior locally.
In the fifth stage we deploy our contract to testnet.

## Function specifiers
impure right after the params passed into the function is one of 3 possible function specifiers:

impure - means that the function can have some side effects which can't be ignored. For example, we should put impure specifier if the function can modify contract storage, send messages, or throw an exception when some data is invalid and the function is intended to validate this data.
inline/inline_ref
method_id

In order to manipulate data and write other logic in our contract, We need to import FunC standard library. Currently, this library is just a wrapper for the most common assembler of the TVM commands which are not built-in



## Raw and User-Friendly Addresses
Raw smart contract addresses consist of a workchain ID and account ID (workchain_id, account_id) and are displayed in the following format: [decimal workchain_id]:[64 hexadecimal digits with account_id]
Cons -
When using the raw address format, it's not possible to verify addresses to eliminate errors prior to sending a transaction.
When using the raw address format, it's impossible to add special flags like those used when sending transactions that employ user-friendly addresses

User-friendly addresses were developed to secure and simplify the experience for TON users who share addresses on the interne, User-friendly addresses are made up of 36 bytes in total and are obtained by generating the following components in order:

[flags - 1 byte] - isBounceable (0x11 for "bounceable", 0x51 for "non-bounceable), isTestnetOnly(beginning with 0x80 should not be accepted), isUrlSafe - . Denotes a deprecated flag   

[workchain_id - 1 byte] - (0x00 for the BaseChain, 0xff for the MasterChain)

[account_id - 32 byte] - of a (big-endian) 256-bit address in the workchain.

[address verification - 2 bytes]
