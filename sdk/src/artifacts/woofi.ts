export type Woofi = {
  "version": "0.1.0",
  "name": "woofi",
  "instructions": [
    {
      "name": "createOracle",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feedAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteFeedAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quotePriceUpdate",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maximumAge",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setOracleMaximumAge",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "maximumAge",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setStaleDuration",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "staleDuration",
          "type": "i64"
        }
      ]
    },
    {
      "name": "setWooBound",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "bound",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setWooRange",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "rangeMin",
          "type": "u128"
        },
        {
          "name": "rangeMax",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setWooPrice",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setWooCoeff",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "coeff",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setWooSpread",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "spread",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setOutPreferred",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "outPreferred",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setWooAdmin",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "adminAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setWooState",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u128"
        },
        {
          "name": "coeff",
          "type": "u64"
        },
        {
          "name": "spread",
          "type": "u64"
        }
      ]
    },
    {
      "name": "getPrice",
      "accounts": [
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quotePriceUpdate",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": {
        "defined": "GetPriceResult"
      }
    },
    {
      "name": "createPool",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wooracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "adminAuthority",
          "type": "publicKey"
        },
        {
          "name": "feeAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createRebatePool",
      "accounts": [
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rebateAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebatePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopoolQuote",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setPoolAdmin",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "adminAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setPoolFeeAdmin",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "feeAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setPoolPauseAuth",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "pauseAuthority",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "pausePool",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "unpausePool",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "setRebatePoolPaused",
      "accounts": [
        {
          "name": "rebatePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "paused",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setPoolFeeRate",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "feeRate",
          "type": "u16"
        }
      ]
    },
    {
      "name": "setPoolMaxGamma",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "maxGamma",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setPoolMaxNotionalSwap",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "maxNotionalSwap",
          "type": "u128"
        }
      ]
    },
    {
      "name": "tryQuery",
      "accounts": [
        {
          "name": "wooracleFrom",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolFrom",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdateFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wooracleTo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolTo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdateTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quotePriceUpdate",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fromAmount",
          "type": "u128"
        }
      ],
      "returns": {
        "defined": "QueryResult"
      }
    },
    {
      "name": "query",
      "accounts": [
        {
          "name": "wooracleFrom",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolFrom",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdateFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wooracleTo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolTo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVaultTo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdateTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopoolQuote",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quotePriceUpdate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fromAmount",
          "type": "u128"
        },
        {
          "name": "minToAmount",
          "type": "u128"
        }
      ],
      "returns": {
        "defined": "QueryResult"
      }
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "wooracleFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopoolFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenOwnerAccountFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "priceUpdateFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wooracleTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopoolTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenOwnerAccountTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "priceUpdateTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopoolQuote",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quotePriceUpdate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rebateTo",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fromAmount",
          "type": "u128"
        },
        {
          "name": "minToAmount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenOwnerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenOwnerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "claimFee",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "woopool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claimFeeToAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimFeeAmount",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "woopool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claimFeeToAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "claimAmount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "claimRebateFee",
      "accounts": [
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebateAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "woopoolQuote",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rebatePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimFeeToAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "rebatePool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "rebateAuthority",
            "type": "publicKey"
          },
          {
            "name": "quoteTokenMint",
            "type": "publicKey"
          },
          {
            "name": "woopoolQuote",
            "type": "publicKey"
          },
          {
            "name": "woopoolVault",
            "type": "publicKey"
          },
          {
            "name": "pendingRebate",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "wooPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "woopoolBump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "adminAuthority",
            "type": "publicKey"
          },
          {
            "name": "feeAuthority",
            "type": "publicKey"
          },
          {
            "name": "pauseAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "wooracle",
            "type": "publicKey"
          },
          {
            "name": "feeRate",
            "type": "u16"
          },
          {
            "name": "reserve",
            "type": "u128"
          },
          {
            "name": "maxGamma",
            "type": "u128"
          },
          {
            "name": "maxNotionalSwap",
            "type": "u128"
          },
          {
            "name": "unclaimedFee",
            "type": "u128"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenVault",
            "type": "publicKey"
          },
          {
            "name": "quoteTokenMint",
            "type": "publicKey"
          },
          {
            "name": "baseDecimals",
            "docs": [
              "Number of base 10 digits to the right of the decimal place."
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "woOracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "adminAuthority",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "feedAccount",
            "type": "publicKey"
          },
          {
            "name": "priceUpdate",
            "type": "publicKey"
          },
          {
            "name": "maximumAge",
            "type": "u64"
          },
          {
            "name": "priceDecimals",
            "type": "u8"
          },
          {
            "name": "quoteDecimals",
            "type": "u8"
          },
          {
            "name": "baseDecimals",
            "type": "u8"
          },
          {
            "name": "outerPreferred",
            "type": "bool"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          },
          {
            "name": "staleDuration",
            "type": "i64"
          },
          {
            "name": "bound",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u128"
          },
          {
            "name": "coeff",
            "type": "u64"
          },
          {
            "name": "spread",
            "type": "u64"
          },
          {
            "name": "rangeMin",
            "type": "u128"
          },
          {
            "name": "rangeMax",
            "type": "u128"
          },
          {
            "name": "quoteTokenMint",
            "type": "publicKey"
          },
          {
            "name": "quoteFeedAccount",
            "type": "publicKey"
          },
          {
            "name": "quotePriceUpdate",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "GetPriceResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceOut",
            "type": "u128"
          },
          {
            "name": "feasibleOut",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "GetStateResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceOut",
            "type": "u128"
          },
          {
            "name": "spread",
            "type": "u64"
          },
          {
            "name": "coeff",
            "type": "u64"
          },
          {
            "name": "feasibleOut",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "QueryResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "toAmount",
            "type": "u128"
          },
          {
            "name": "swapFee",
            "type": "u128"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "DepositEvent",
      "fields": [
        {
          "name": "tokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "depositAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawEvent",
      "fields": [
        {
          "name": "tokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "withdrawAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimFeeEvent",
      "fields": [
        {
          "name": "quoteTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimFeeToAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimRebateFeeEvent",
      "fields": [
        {
          "name": "quoteTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebateAuthority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimFeeToAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "AdminUpdatedEvent",
      "fields": [
        {
          "name": "woopool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "adminAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "FeeAdminUpdatedEvent",
      "fields": [
        {
          "name": "woopool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "feeAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "PauseRoleUpdatedEvent",
      "fields": [
        {
          "name": "woopool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pauseAuthority",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "WooracleAdminUpdatedEvent",
      "fields": [
        {
          "name": "wooracle",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "adminAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "SwapEvent",
      "fields": [
        {
          "name": "sender",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fromTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "toTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fromAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "toAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "fromAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "toAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebateTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "swapVol",
          "type": "u128",
          "index": false
        },
        {
          "name": "swapFee",
          "type": "u128",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "DivideByZero",
      "msg": "Unable to divide by zero"
    },
    {
      "code": 6001,
      "name": "NumberCastError",
      "msg": "Unable to cast number into BigInt"
    },
    {
      "code": 6002,
      "name": "NumberDownCastError",
      "msg": "Unable to down cast number"
    },
    {
      "code": 6003,
      "name": "FeeRateMaxExceeded",
      "msg": "Exceeded max fee rate"
    },
    {
      "code": 6004,
      "name": "CapBalanceSmallerThanTargetBalance",
      "msg": "Cap balance smaller than 2 times target balance"
    },
    {
      "code": 6005,
      "name": "IntegerOverflow",
      "msg": "Integer overflow"
    },
    {
      "code": 6006,
      "name": "ConversionFailure",
      "msg": "Conversion failure"
    },
    {
      "code": 6007,
      "name": "MathOverflow",
      "msg": "Mathematical operation with overflow"
    },
    {
      "code": 6008,
      "name": "MulDivOverflow",
      "msg": "Muldiv overflow"
    },
    {
      "code": 6009,
      "name": "MulDivInvalidInput",
      "msg": "Invalid div_u256 input"
    },
    {
      "code": 6010,
      "name": "MultiplicationOverflow",
      "msg": "Multiplication overflow"
    },
    {
      "code": 6011,
      "name": "ProtocolFeeMaxExceeded",
      "msg": "Exceeded max protocol fee"
    },
    {
      "code": 6012,
      "name": "ProtocolFeeNotEnough",
      "msg": "Protocol fee not enough"
    },
    {
      "code": 6013,
      "name": "RebateFeeMaxExceeded",
      "msg": "Exceeded max rebate fee"
    },
    {
      "code": 6014,
      "name": "RebateFeeNotEnough",
      "msg": "Rebate fee not enough"
    },
    {
      "code": 6015,
      "name": "ReserveMaxExceeded",
      "msg": "Exceeded max reserve"
    },
    {
      "code": 6016,
      "name": "ReserveNotEnough",
      "msg": "Reserve not enough"
    },
    {
      "code": 6017,
      "name": "ReserveLessThanFee",
      "msg": "Reserve less than fee"
    },
    {
      "code": 6018,
      "name": "TooManyAuthorities",
      "msg": "Too Many Authorities"
    },
    {
      "code": 6019,
      "name": "WooOracleNotFeasible",
      "msg": "Woo oracle is not feasible"
    },
    {
      "code": 6020,
      "name": "WooOraclePriceNotValid",
      "msg": "Woo oracle price is not valid"
    },
    {
      "code": 6021,
      "name": "WooOraclePriceRangeMin",
      "msg": "Woo oracle price below range MIN"
    },
    {
      "code": 6022,
      "name": "WooOraclePriceRangeMax",
      "msg": "Woo oracle price exceed range MAX"
    },
    {
      "code": 6023,
      "name": "WooOracleSpreadExceed",
      "msg": "Woo oracle spread exceed 1E18"
    },
    {
      "code": 6024,
      "name": "WooPoolExceedMaxNotionalValue",
      "msg": "Woo pp exceed max notional value"
    },
    {
      "code": 6025,
      "name": "WooPoolExceedMaxGamma",
      "msg": "Woo pp exceed max gamma"
    },
    {
      "code": 6026,
      "name": "NotEnoughBalance",
      "msg": "Src Balance < LP Deposit Amount."
    },
    {
      "code": 6027,
      "name": "NoPoolMintOutput",
      "msg": "Pool Mint Amount < 0 on LP Deposit"
    },
    {
      "code": 6028,
      "name": "BurnTooMuch",
      "msg": "Trying to burn too much"
    },
    {
      "code": 6029,
      "name": "NotEnoughOut",
      "msg": "Not enough out"
    },
    {
      "code": 6030,
      "name": "AmountOutBelowMinimum",
      "msg": "Amount out below minimum threshold"
    }
  ]
};

export const IDL: Woofi = {
  "version": "0.1.0",
  "name": "woofi",
  "instructions": [
    {
      "name": "createOracle",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feedAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteFeedAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quotePriceUpdate",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maximumAge",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setOracleMaximumAge",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "maximumAge",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setStaleDuration",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "staleDuration",
          "type": "i64"
        }
      ]
    },
    {
      "name": "setWooBound",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "bound",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setWooRange",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "rangeMin",
          "type": "u128"
        },
        {
          "name": "rangeMax",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setWooPrice",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setWooCoeff",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "coeff",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setWooSpread",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "spread",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setOutPreferred",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "outPreferred",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setWooAdmin",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "adminAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setWooState",
      "accounts": [
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u128"
        },
        {
          "name": "coeff",
          "type": "u64"
        },
        {
          "name": "spread",
          "type": "u64"
        }
      ]
    },
    {
      "name": "getPrice",
      "accounts": [
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quotePriceUpdate",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": {
        "defined": "GetPriceResult"
      }
    },
    {
      "name": "createPool",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wooracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "adminAuthority",
          "type": "publicKey"
        },
        {
          "name": "feeAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createRebatePool",
      "accounts": [
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rebateAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebatePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopoolQuote",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setPoolAdmin",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "adminAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setPoolFeeAdmin",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "feeAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setPoolPauseAuth",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "pauseAuthority",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "pausePool",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "unpausePool",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "setRebatePoolPaused",
      "accounts": [
        {
          "name": "rebatePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "paused",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setPoolFeeRate",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "feeRate",
          "type": "u16"
        }
      ]
    },
    {
      "name": "setPoolMaxGamma",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "maxGamma",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setPoolMaxNotionalSwap",
      "accounts": [
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "maxNotionalSwap",
          "type": "u128"
        }
      ]
    },
    {
      "name": "tryQuery",
      "accounts": [
        {
          "name": "wooracleFrom",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolFrom",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdateFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wooracleTo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolTo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdateTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quotePriceUpdate",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fromAmount",
          "type": "u128"
        }
      ],
      "returns": {
        "defined": "QueryResult"
      }
    },
    {
      "name": "query",
      "accounts": [
        {
          "name": "wooracleFrom",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolFrom",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdateFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wooracleTo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolTo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVaultTo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdateTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopoolQuote",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quotePriceUpdate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fromAmount",
          "type": "u128"
        },
        {
          "name": "minToAmount",
          "type": "u128"
        }
      ],
      "returns": {
        "defined": "QueryResult"
      }
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "wooracleFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopoolFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenOwnerAccountFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "priceUpdateFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wooracleTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopoolTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenOwnerAccountTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "priceUpdateTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopoolQuote",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quotePriceUpdate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rebateTo",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "fromAmount",
          "type": "u128"
        },
        {
          "name": "minToAmount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenOwnerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenOwnerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "claimFee",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "woopool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claimFeeToAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimFeeAmount",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "woopool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claimFeeToAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "claimAmount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "claimRebateFee",
      "accounts": [
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebateAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "woopoolQuote",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rebatePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimFeeToAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "rebatePool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "rebateAuthority",
            "type": "publicKey"
          },
          {
            "name": "quoteTokenMint",
            "type": "publicKey"
          },
          {
            "name": "woopoolQuote",
            "type": "publicKey"
          },
          {
            "name": "woopoolVault",
            "type": "publicKey"
          },
          {
            "name": "pendingRebate",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "wooPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "woopoolBump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "adminAuthority",
            "type": "publicKey"
          },
          {
            "name": "feeAuthority",
            "type": "publicKey"
          },
          {
            "name": "pauseAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "wooracle",
            "type": "publicKey"
          },
          {
            "name": "feeRate",
            "type": "u16"
          },
          {
            "name": "reserve",
            "type": "u128"
          },
          {
            "name": "maxGamma",
            "type": "u128"
          },
          {
            "name": "maxNotionalSwap",
            "type": "u128"
          },
          {
            "name": "unclaimedFee",
            "type": "u128"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenVault",
            "type": "publicKey"
          },
          {
            "name": "quoteTokenMint",
            "type": "publicKey"
          },
          {
            "name": "baseDecimals",
            "docs": [
              "Number of base 10 digits to the right of the decimal place."
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "woOracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "adminAuthority",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "feedAccount",
            "type": "publicKey"
          },
          {
            "name": "priceUpdate",
            "type": "publicKey"
          },
          {
            "name": "maximumAge",
            "type": "u64"
          },
          {
            "name": "priceDecimals",
            "type": "u8"
          },
          {
            "name": "quoteDecimals",
            "type": "u8"
          },
          {
            "name": "baseDecimals",
            "type": "u8"
          },
          {
            "name": "outerPreferred",
            "type": "bool"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          },
          {
            "name": "staleDuration",
            "type": "i64"
          },
          {
            "name": "bound",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u128"
          },
          {
            "name": "coeff",
            "type": "u64"
          },
          {
            "name": "spread",
            "type": "u64"
          },
          {
            "name": "rangeMin",
            "type": "u128"
          },
          {
            "name": "rangeMax",
            "type": "u128"
          },
          {
            "name": "quoteTokenMint",
            "type": "publicKey"
          },
          {
            "name": "quoteFeedAccount",
            "type": "publicKey"
          },
          {
            "name": "quotePriceUpdate",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "GetPriceResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceOut",
            "type": "u128"
          },
          {
            "name": "feasibleOut",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "GetStateResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceOut",
            "type": "u128"
          },
          {
            "name": "spread",
            "type": "u64"
          },
          {
            "name": "coeff",
            "type": "u64"
          },
          {
            "name": "feasibleOut",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "QueryResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "toAmount",
            "type": "u128"
          },
          {
            "name": "swapFee",
            "type": "u128"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "DepositEvent",
      "fields": [
        {
          "name": "tokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "depositAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawEvent",
      "fields": [
        {
          "name": "tokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "withdrawAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimFeeEvent",
      "fields": [
        {
          "name": "quoteTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimFeeToAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimRebateFeeEvent",
      "fields": [
        {
          "name": "quoteTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebateAuthority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimFeeToAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "AdminUpdatedEvent",
      "fields": [
        {
          "name": "woopool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "adminAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "FeeAdminUpdatedEvent",
      "fields": [
        {
          "name": "woopool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "feeAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "PauseRoleUpdatedEvent",
      "fields": [
        {
          "name": "woopool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pauseAuthority",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "WooracleAdminUpdatedEvent",
      "fields": [
        {
          "name": "wooracle",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "adminAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "SwapEvent",
      "fields": [
        {
          "name": "sender",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fromTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "toTokenMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fromAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "toAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "fromAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "toAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebateTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "swapVol",
          "type": "u128",
          "index": false
        },
        {
          "name": "swapFee",
          "type": "u128",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "DivideByZero",
      "msg": "Unable to divide by zero"
    },
    {
      "code": 6001,
      "name": "NumberCastError",
      "msg": "Unable to cast number into BigInt"
    },
    {
      "code": 6002,
      "name": "NumberDownCastError",
      "msg": "Unable to down cast number"
    },
    {
      "code": 6003,
      "name": "FeeRateMaxExceeded",
      "msg": "Exceeded max fee rate"
    },
    {
      "code": 6004,
      "name": "CapBalanceSmallerThanTargetBalance",
      "msg": "Cap balance smaller than 2 times target balance"
    },
    {
      "code": 6005,
      "name": "IntegerOverflow",
      "msg": "Integer overflow"
    },
    {
      "code": 6006,
      "name": "ConversionFailure",
      "msg": "Conversion failure"
    },
    {
      "code": 6007,
      "name": "MathOverflow",
      "msg": "Mathematical operation with overflow"
    },
    {
      "code": 6008,
      "name": "MulDivOverflow",
      "msg": "Muldiv overflow"
    },
    {
      "code": 6009,
      "name": "MulDivInvalidInput",
      "msg": "Invalid div_u256 input"
    },
    {
      "code": 6010,
      "name": "MultiplicationOverflow",
      "msg": "Multiplication overflow"
    },
    {
      "code": 6011,
      "name": "ProtocolFeeMaxExceeded",
      "msg": "Exceeded max protocol fee"
    },
    {
      "code": 6012,
      "name": "ProtocolFeeNotEnough",
      "msg": "Protocol fee not enough"
    },
    {
      "code": 6013,
      "name": "RebateFeeMaxExceeded",
      "msg": "Exceeded max rebate fee"
    },
    {
      "code": 6014,
      "name": "RebateFeeNotEnough",
      "msg": "Rebate fee not enough"
    },
    {
      "code": 6015,
      "name": "ReserveMaxExceeded",
      "msg": "Exceeded max reserve"
    },
    {
      "code": 6016,
      "name": "ReserveNotEnough",
      "msg": "Reserve not enough"
    },
    {
      "code": 6017,
      "name": "ReserveLessThanFee",
      "msg": "Reserve less than fee"
    },
    {
      "code": 6018,
      "name": "TooManyAuthorities",
      "msg": "Too Many Authorities"
    },
    {
      "code": 6019,
      "name": "WooOracleNotFeasible",
      "msg": "Woo oracle is not feasible"
    },
    {
      "code": 6020,
      "name": "WooOraclePriceNotValid",
      "msg": "Woo oracle price is not valid"
    },
    {
      "code": 6021,
      "name": "WooOraclePriceRangeMin",
      "msg": "Woo oracle price below range MIN"
    },
    {
      "code": 6022,
      "name": "WooOraclePriceRangeMax",
      "msg": "Woo oracle price exceed range MAX"
    },
    {
      "code": 6023,
      "name": "WooOracleSpreadExceed",
      "msg": "Woo oracle spread exceed 1E18"
    },
    {
      "code": 6024,
      "name": "WooPoolExceedMaxNotionalValue",
      "msg": "Woo pp exceed max notional value"
    },
    {
      "code": 6025,
      "name": "WooPoolExceedMaxGamma",
      "msg": "Woo pp exceed max gamma"
    },
    {
      "code": 6026,
      "name": "NotEnoughBalance",
      "msg": "Src Balance < LP Deposit Amount."
    },
    {
      "code": 6027,
      "name": "NoPoolMintOutput",
      "msg": "Pool Mint Amount < 0 on LP Deposit"
    },
    {
      "code": 6028,
      "name": "BurnTooMuch",
      "msg": "Trying to burn too much"
    },
    {
      "code": 6029,
      "name": "NotEnoughOut",
      "msg": "Not enough out"
    },
    {
      "code": 6030,
      "name": "AmountOutBelowMinimum",
      "msg": "Amount out below minimum threshold"
    }
  ]
};
