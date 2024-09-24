# WooFi's sPMM in Solana

WooFi's sPMM is Synthetic Proactive Market Making (sPMM) contract on the Solana blockchain.
This repository contains the Rust smart contract as well as the Typescript SDK (`@woonetwork/WOOFi_Solana`) to interact with a deployed program.

The contract has been audited by [...](...).

## Requirements

- Anchor 0.29.0
- Solana 1.17.31
- Rust 1.72.0

## Setup

Install Anchor using instructions found [here](https://book.anchor-lang.com/getting_started/installation.html#anchor).

Set up a valid Solana keypair at the path specified in the `wallet` in `Anchor.toml` to do local testing with `anchor test` flows.

`$NODE_PATH` must be set to the `node_modules` directory of your global installs.
For example, using Node 18.20.4 installed through `nvm`, the $NODE_PATH is the following:

```
$ echo $NODE_PATH
/Users/<home_dir>/.nvm/versions/node/v18.20.4/lib/node_modules
```

## Usage

## Tests

- Run "cargo test --lib" to run Rust unit tests

---

# WooFi's sPMM SDK

Use the SDK to interact with a deployed WooFi sPMM program via Typescript.

## Installation & Test

In your package, run:

```
yarn
yarn build
```

## Usage

Read instructions on how to use the SDK on the [Woo sPMM Developer Portal](https://learn.woo.org/v/woofi-dev-docs).

## Run Typescript tests via local validator

In the WOOFi_Solana/sdk folder, run:

```
yarn test
```

## Generate TypeDoc

In the `sdk` folder, run `yarn run docs`

You can also see the generated [TypeDoc](https://#).

## Sample Codes

You can find sample code covering basic operations [here](https://#).

---
