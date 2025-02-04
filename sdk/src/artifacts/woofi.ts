export type Woofi = {
  "version": "0.1.0",
  "name": "woofi",
  "instructions": [
    {
      "name": "createConfig",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wooconfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createWooracle",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
      "name": "setWooAdmin",
      "accounts": [
        {
          "name": "wooconfig",
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
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "setGuardianAdmin",
      "accounts": [
        {
          "name": "wooconfig",
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
          "name": "guardianAuthority",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "setWooState",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
        }
      ],
      "args": []
    },
    {
      "name": "createWooAmmPool",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wooammpool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wooracleA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wooracleB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
          "name": "wooconfig",
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
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "setFeeAdmin",
      "accounts": [
        {
          "name": "wooconfig",
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
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "setPauseRole",
      "accounts": [
        {
          "name": "wooconfig",
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
      "name": "pause",
      "accounts": [
        {
          "name": "wooconfig",
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
      "name": "unpause",
      "accounts": [
        {
          "name": "wooconfig",
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
      "name": "setPoolFeeRate",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
      "name": "setPoolCapBal",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "capBal",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setPoolMinSwapAmount",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "minSwapAmount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "tryQuery",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "toTokenAccount",
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
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
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
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
    },
    {
      "name": "claimFeeAmount",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
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
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
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
      "args": [
        {
          "name": "claimAmount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "incaseTokenGotStuck",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "toTokenAccount",
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
      "name": "setWooconfigNewAuthority",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "wooconfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimWooconfigAuthority",
      "accounts": [
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "wooconfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimWooracleAuthority",
      "accounts": [
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimWoopoolAuthority",
      "accounts": [
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "wooAmmPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wooconfig",
            "type": "publicKey"
          },
          {
            "name": "wooammpoolBump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "wooracleA",
            "type": "publicKey"
          },
          {
            "name": "woopoolA",
            "type": "publicKey"
          },
          {
            "name": "feedAccountA",
            "type": "publicKey"
          },
          {
            "name": "priceUpdateA",
            "type": "publicKey"
          },
          {
            "name": "tokenMintA",
            "type": "publicKey"
          },
          {
            "name": "tokenVaultA",
            "type": "publicKey"
          },
          {
            "name": "wooracleB",
            "type": "publicKey"
          },
          {
            "name": "woopoolB",
            "type": "publicKey"
          },
          {
            "name": "feedAccountB",
            "type": "publicKey"
          },
          {
            "name": "priceUpdateB",
            "type": "publicKey"
          },
          {
            "name": "tokenMintB",
            "type": "publicKey"
          },
          {
            "name": "tokenVaultB",
            "type": "publicKey"
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
    },
    {
      "name": "wooConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "woopoolAdminAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "wooracleAdminAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "feeAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "guardianAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "pauseAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "newAuthority",
            "type": "publicKey"
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
            "name": "wooconfig",
            "type": "publicKey"
          },
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
            "name": "authority",
            "type": "publicKey"
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
            "name": "maxGamma",
            "type": "u128"
          },
          {
            "name": "maxNotionalSwap",
            "type": "u128"
          },
          {
            "name": "capBal",
            "type": "u128"
          },
          {
            "name": "minSwapAmount",
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
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "wooracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wooconfig",
            "type": "publicKey"
          },
          {
            "name": "authority",
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
      "name": "PauseEvent",
      "fields": [
        {
          "name": "wooconfig",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UnPauseEvent",
      "fields": [
        {
          "name": "wooconfig",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
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
      "name": "WooPoolAdminUpdatedEvent",
      "fields": [
        {
          "name": "wooconfig",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "admins",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "FeeAdminUpdatedEvent",
      "fields": [
        {
          "name": "wooconfig",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "feeAdmins",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "PauseRoleUpdatedEvent",
      "fields": [
        {
          "name": "wooconfig",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pauseRoles",
          "type": {
            "vec": "publicKey"
          },
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
      "name": "FeeRateMaxExceeded",
      "msg": "Exceeded max fee rate"
    },
    {
      "code": 6003,
      "name": "MathOverflow",
      "msg": "Mathematical operation with overflow"
    },
    {
      "code": 6004,
      "name": "MulDivOverflow",
      "msg": "Muldiv overflow"
    },
    {
      "code": 6005,
      "name": "ProtocolFeeMaxExceeded",
      "msg": "Exceeded max protocol fee"
    },
    {
      "code": 6006,
      "name": "ProtocolFeeNotEnough",
      "msg": "Protocol fee not enough"
    },
    {
      "code": 6007,
      "name": "RebateFeeMaxExceeded",
      "msg": "Exceeded max rebate fee"
    },
    {
      "code": 6008,
      "name": "RebateFeeNotEnough",
      "msg": "Rebate fee not enough"
    },
    {
      "code": 6009,
      "name": "ReserveMaxExceeded",
      "msg": "Exceeded max reserve"
    },
    {
      "code": 6010,
      "name": "ReserveNotEnough",
      "msg": "Reserve not enough"
    },
    {
      "code": 6011,
      "name": "ReserveLessThanFee",
      "msg": "Reserve less than fee"
    },
    {
      "code": 6012,
      "name": "TooManyAuthorities",
      "msg": "Too Many Authorities"
    },
    {
      "code": 6013,
      "name": "WooOracleBoundLimit",
      "msg": "Woo oracle bound exceed limit"
    },
    {
      "code": 6014,
      "name": "WooOracleNotFeasible",
      "msg": "Woo oracle is not feasible"
    },
    {
      "code": 6015,
      "name": "WooOraclePriceNotValid",
      "msg": "Woo oracle price is not valid"
    },
    {
      "code": 6016,
      "name": "WooOraclePriceRangeMin",
      "msg": "Woo oracle price below range MIN"
    },
    {
      "code": 6017,
      "name": "WooOraclePriceRangeMax",
      "msg": "Woo oracle price exceed range MAX"
    },
    {
      "code": 6018,
      "name": "WooOracleSpreadExceed",
      "msg": "Woo oracle spread exceed 1E18"
    },
    {
      "code": 6019,
      "name": "WooPoolExceedMaxNotionalValue",
      "msg": "Woo pp exceed max notional value"
    },
    {
      "code": 6020,
      "name": "WooPoolExceedMaxGamma",
      "msg": "Woo pp exceed max gamma"
    },
    {
      "code": 6021,
      "name": "NotEnoughBalance",
      "msg": "Src Balance < LP Deposit Amount."
    },
    {
      "code": 6022,
      "name": "NotEnoughOut",
      "msg": "Not enough out"
    },
    {
      "code": 6023,
      "name": "AmountOutBelowMinimum",
      "msg": "Amount out below minimum threshold"
    },
    {
      "code": 6024,
      "name": "BalanceCapExceeds",
      "msg": "Amount exceeds max balance cap"
    },
    {
      "code": 6025,
      "name": "SwapPoolInvalid",
      "msg": "Swap pool invalid"
    },
    {
      "code": 6026,
      "name": "InvalidAuthority",
      "msg": "invalid authority"
    }
  ]
};

export const IDL: Woofi = {
  "version": "0.1.0",
  "name": "woofi",
  "instructions": [
    {
      "name": "createConfig",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wooconfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createWooracle",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
      "name": "setWooAdmin",
      "accounts": [
        {
          "name": "wooconfig",
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
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "setGuardianAdmin",
      "accounts": [
        {
          "name": "wooconfig",
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
          "name": "guardianAuthority",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "setWooState",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
        }
      ],
      "args": []
    },
    {
      "name": "createWooAmmPool",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wooammpool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wooracleA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wooracleB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopoolB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
          "name": "wooconfig",
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
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "setFeeAdmin",
      "accounts": [
        {
          "name": "wooconfig",
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
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "setPauseRole",
      "accounts": [
        {
          "name": "wooconfig",
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
      "name": "pause",
      "accounts": [
        {
          "name": "wooconfig",
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
      "name": "unpause",
      "accounts": [
        {
          "name": "wooconfig",
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
      "name": "setPoolFeeRate",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
      "name": "setPoolCapBal",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "capBal",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setPoolMinSwapAmount",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "minSwapAmount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "tryQuery",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "toTokenAccount",
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
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
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
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
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
    },
    {
      "name": "claimFeeAmount",
      "accounts": [
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
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
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
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
      "args": [
        {
          "name": "claimAmount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "incaseTokenGotStuck",
      "accounts": [
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "toTokenAccount",
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
      "name": "setWooconfigNewAuthority",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "wooconfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimWooconfigAuthority",
      "accounts": [
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "wooconfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimWooracleAuthority",
      "accounts": [
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "wooracle",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimWoopoolAuthority",
      "accounts": [
        {
          "name": "newAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "wooconfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "woopool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "wooAmmPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wooconfig",
            "type": "publicKey"
          },
          {
            "name": "wooammpoolBump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "wooracleA",
            "type": "publicKey"
          },
          {
            "name": "woopoolA",
            "type": "publicKey"
          },
          {
            "name": "feedAccountA",
            "type": "publicKey"
          },
          {
            "name": "priceUpdateA",
            "type": "publicKey"
          },
          {
            "name": "tokenMintA",
            "type": "publicKey"
          },
          {
            "name": "tokenVaultA",
            "type": "publicKey"
          },
          {
            "name": "wooracleB",
            "type": "publicKey"
          },
          {
            "name": "woopoolB",
            "type": "publicKey"
          },
          {
            "name": "feedAccountB",
            "type": "publicKey"
          },
          {
            "name": "priceUpdateB",
            "type": "publicKey"
          },
          {
            "name": "tokenMintB",
            "type": "publicKey"
          },
          {
            "name": "tokenVaultB",
            "type": "publicKey"
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
    },
    {
      "name": "wooConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "woopoolAdminAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "wooracleAdminAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "feeAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "guardianAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "pauseAuthority",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "newAuthority",
            "type": "publicKey"
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
            "name": "wooconfig",
            "type": "publicKey"
          },
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
            "name": "authority",
            "type": "publicKey"
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
            "name": "maxGamma",
            "type": "u128"
          },
          {
            "name": "maxNotionalSwap",
            "type": "u128"
          },
          {
            "name": "capBal",
            "type": "u128"
          },
          {
            "name": "minSwapAmount",
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
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "wooracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wooconfig",
            "type": "publicKey"
          },
          {
            "name": "authority",
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
      "name": "PauseEvent",
      "fields": [
        {
          "name": "wooconfig",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UnPauseEvent",
      "fields": [
        {
          "name": "wooconfig",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
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
      "name": "WooPoolAdminUpdatedEvent",
      "fields": [
        {
          "name": "wooconfig",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "admins",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "FeeAdminUpdatedEvent",
      "fields": [
        {
          "name": "wooconfig",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "feeAdmins",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "PauseRoleUpdatedEvent",
      "fields": [
        {
          "name": "wooconfig",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pauseRoles",
          "type": {
            "vec": "publicKey"
          },
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
      "name": "FeeRateMaxExceeded",
      "msg": "Exceeded max fee rate"
    },
    {
      "code": 6003,
      "name": "MathOverflow",
      "msg": "Mathematical operation with overflow"
    },
    {
      "code": 6004,
      "name": "MulDivOverflow",
      "msg": "Muldiv overflow"
    },
    {
      "code": 6005,
      "name": "ProtocolFeeMaxExceeded",
      "msg": "Exceeded max protocol fee"
    },
    {
      "code": 6006,
      "name": "ProtocolFeeNotEnough",
      "msg": "Protocol fee not enough"
    },
    {
      "code": 6007,
      "name": "RebateFeeMaxExceeded",
      "msg": "Exceeded max rebate fee"
    },
    {
      "code": 6008,
      "name": "RebateFeeNotEnough",
      "msg": "Rebate fee not enough"
    },
    {
      "code": 6009,
      "name": "ReserveMaxExceeded",
      "msg": "Exceeded max reserve"
    },
    {
      "code": 6010,
      "name": "ReserveNotEnough",
      "msg": "Reserve not enough"
    },
    {
      "code": 6011,
      "name": "ReserveLessThanFee",
      "msg": "Reserve less than fee"
    },
    {
      "code": 6012,
      "name": "TooManyAuthorities",
      "msg": "Too Many Authorities"
    },
    {
      "code": 6013,
      "name": "WooOracleBoundLimit",
      "msg": "Woo oracle bound exceed limit"
    },
    {
      "code": 6014,
      "name": "WooOracleNotFeasible",
      "msg": "Woo oracle is not feasible"
    },
    {
      "code": 6015,
      "name": "WooOraclePriceNotValid",
      "msg": "Woo oracle price is not valid"
    },
    {
      "code": 6016,
      "name": "WooOraclePriceRangeMin",
      "msg": "Woo oracle price below range MIN"
    },
    {
      "code": 6017,
      "name": "WooOraclePriceRangeMax",
      "msg": "Woo oracle price exceed range MAX"
    },
    {
      "code": 6018,
      "name": "WooOracleSpreadExceed",
      "msg": "Woo oracle spread exceed 1E18"
    },
    {
      "code": 6019,
      "name": "WooPoolExceedMaxNotionalValue",
      "msg": "Woo pp exceed max notional value"
    },
    {
      "code": 6020,
      "name": "WooPoolExceedMaxGamma",
      "msg": "Woo pp exceed max gamma"
    },
    {
      "code": 6021,
      "name": "NotEnoughBalance",
      "msg": "Src Balance < LP Deposit Amount."
    },
    {
      "code": 6022,
      "name": "NotEnoughOut",
      "msg": "Not enough out"
    },
    {
      "code": 6023,
      "name": "AmountOutBelowMinimum",
      "msg": "Amount out below minimum threshold"
    },
    {
      "code": 6024,
      "name": "BalanceCapExceeds",
      "msg": "Amount exceeds max balance cap"
    },
    {
      "code": 6025,
      "name": "SwapPoolInvalid",
      "msg": "Swap pool invalid"
    },
    {
      "code": 6026,
      "name": "InvalidAuthority",
      "msg": "invalid authority"
    }
  ]
};
