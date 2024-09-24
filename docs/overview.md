# WooFi's sPMM in Solana

Woofi's sPMM is Synthetic Proactive Market Making (sPMM) contract on the Solana blockchain.
This repository contains the Rust smart contract as well as the Typescript SDK (`@woonetwork/WOOFi_Solana`) to interact with a deployed program.

The contract has been audited by [...](...).

## Rust Smart Contract

Get access to the Anchor IDL, account name documentation in this portal to help you integrate your smart-contract with Woo sPMM.

## Typescript SDK Features

With the Typescript SDK, you can easily do the following:

- Use the WoofiClient or construct your own transactions with the raw instructions to:
    - Swap tokens on WooFi sPMM contract.

- Quotes - helper functions to help developers perform quote estimations on tasks such as:
    - Get a quote on a swap and swap fee off-chain.
    - Get a quote on a swap and swap fee on-chain.

- Utility classes
    - Get contract supported tokens.
    - Get pyth oracle for supported tokens (in USD).
    - Other helper functions to help interact with Woo sPMM components