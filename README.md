# WOOFi Solana

WOOFi Solana is a liquidity AMM contract on the Solana blockchain.
This repository contains the Rust smart contract as well as the Typescript SDK (`@woonetwork/woofi-solana-sdk`) to interact with a deployed program.

## Requirements

- Anchor 0.29.0
- Solana 1.17.22
- Rust 1.72.0

## Setup

Install Anchor using instructions found [here](https://book.anchor-lang.com/getting_started/installation.html#anchor).

Set up a valid Solana keypair at the path specified in the `wallet` in `Anchor.toml` to do local testing with `anchor test` flows.

## Usage

```
anchor build
```

```
anchor test
```