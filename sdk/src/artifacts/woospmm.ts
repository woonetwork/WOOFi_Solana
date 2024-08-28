export type Woofi = {
  "version": "0.1.0",
  "name": "woofi",
  "instructions": [
    {
      "name": "createOracleChainlink",
      "accounts": [
        {
          "name": "cloracle",
          "isMut": true,
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
          "name": "chainlinkProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createOraclePyth",
      "accounts": [
        {
          "name": "pythoracle",
          "isMut": true,
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
          "name": "oracle",
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
      "name": "setCloPreferred",
      "accounts": [
        {
          "name": "oracle",
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
          "name": "cloPreferred",
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
      "name": "updateCloracle",
      "accounts": [
        {
          "name": "cloracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "feedAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "chainlinkProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updatePythoracle",
      "accounts": [
        {
          "name": "pythoracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "priceUpdate",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
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
          "name": "wooracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdate",
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
          "name": "oracle",
          "isMut": false,
          "isSigner": false
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
      "name": "setPoolState",
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
        },
        {
          "name": "capBalance",
          "type": "u128"
        },
        {
          "name": "tgtBalance",
          "type": "u128"
        },
        {
          "name": "shiftMax",
          "type": "u16"
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
      "name": "setPoolCapBalance",
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
          "name": "capBalance",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setPoolTgtBalance",
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
          "name": "tgtBalance",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setPoolShiftMax",
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
          "name": "shiftMax",
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
          "name": "oracleFrom",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleTo",
          "isMut": false,
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
          "name": "oracleFrom",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleTo",
          "isMut": false,
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
          "name": "oracleFrom",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleTo",
          "isMut": false,
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
      "name": "createRebatePool",
      "accounts": [
        {
          "name": "tokenMint",
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
          "name": "woopool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": true
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
      "name": "swapWithRebate",
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
          "name": "oracleFrom",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleTo",
          "isMut": false,
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebateAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebatePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebateVault",
          "isMut": true,
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
      "name": "claimFee",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebateAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "woopool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebatePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebateVault",
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
    }
  ],
  "accounts": [
    {
      "name": "oracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
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
            "name": "updatedAt",
            "type": "i64"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "round",
            "type": "i128"
          },
          {
            "name": "outerPreferred",
            "type": "bool"
          },
          {
            "name": "oracleType",
            "type": {
              "defined": "OracleType"
            }
          }
        ]
      }
    },
    {
      "name": "rebatePool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "rebateAuthority",
            "type": "publicKey"
          },
          {
            "name": "woopool",
            "type": "publicKey"
          },
          {
            "name": "rebateRate",
            "type": "u16"
          },
          {
            "name": "rebateReserve",
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
            "name": "baseDecimals",
            "docs": [
              "Number of base 10 digits to the right of the decimal place."
            ],
            "type": "u8"
          },
          {
            "name": "enabled",
            "type": "bool"
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
            "name": "oracle",
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
            "name": "capBalance",
            "type": "u128"
          },
          {
            "name": "shiftMax",
            "type": "u16"
          },
          {
            "name": "tgtBalance",
            "type": "u128"
          },
          {
            "name": "protocolFeeOwed",
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
            "name": "oracle",
            "type": "publicKey"
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
            "name": "swapFeeAmount",
            "type": "u128"
          },
          {
            "name": "swapFee",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "OracleType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pyth"
          },
          {
            "name": "ChainLink"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "ClaimFeeEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVault",
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
          "name": "rebateAuthority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebatePool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebateVault",
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
      "name": "SetPoolAdminEvent",
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
      "name": "SetPoolFeeAdminEvent",
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
      "name": "SetWooracleAdminEvent",
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
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oracleFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "wooracleFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopoolFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenOwnerAccountFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVaultFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUpdateFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oracleTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "wooracleTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopoolTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenOwnerAccountTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVaultTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUpdateTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fromAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "minToAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "toAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "SwapWithRebateEvent",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oracleFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "wooracleFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopoolFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenOwnerAccountFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVaultFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUpdateFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oracleTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "wooracleTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopoolTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenOwnerAccountTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVaultTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUpdateTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebateAuthority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebatePool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebateVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fromAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "minToAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "toAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "swapFeeAfterRebate",
          "type": "u128",
          "index": false
        },
        {
          "name": "rebateFeeAmount",
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
      "name": "WooOracleNotFeasible",
      "msg": "Woo oracle is not feasible"
    },
    {
      "code": 6016,
      "name": "WooOraclePriceNotValid",
      "msg": "Woo oracle price is not valid"
    },
    {
      "code": 6017,
      "name": "WooOraclePriceRangeMin",
      "msg": "Woo oracle price below range MIN"
    },
    {
      "code": 6018,
      "name": "WooOraclePriceRangeMax",
      "msg": "Woo oracle price exceed range MAX"
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
      "name": "NoPoolMintOutput",
      "msg": "Pool Mint Amount < 0 on LP Deposit"
    },
    {
      "code": 6023,
      "name": "BurnTooMuch",
      "msg": "Trying to burn too much"
    },
    {
      "code": 6024,
      "name": "NotEnoughOut",
      "msg": "Not enough out"
    },
    {
      "code": 6025,
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
      "name": "createOracleChainlink",
      "accounts": [
        {
          "name": "cloracle",
          "isMut": true,
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
          "name": "chainlinkProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createOraclePyth",
      "accounts": [
        {
          "name": "pythoracle",
          "isMut": true,
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
          "name": "oracle",
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
      "name": "setCloPreferred",
      "accounts": [
        {
          "name": "oracle",
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
          "name": "cloPreferred",
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
      "name": "updateCloracle",
      "accounts": [
        {
          "name": "cloracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "feedAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "chainlinkProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updatePythoracle",
      "accounts": [
        {
          "name": "pythoracle",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "priceUpdate",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
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
          "name": "wooracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceUpdate",
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
          "name": "oracle",
          "isMut": false,
          "isSigner": false
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
      "name": "setPoolState",
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
        },
        {
          "name": "capBalance",
          "type": "u128"
        },
        {
          "name": "tgtBalance",
          "type": "u128"
        },
        {
          "name": "shiftMax",
          "type": "u16"
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
      "name": "setPoolCapBalance",
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
          "name": "capBalance",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setPoolTgtBalance",
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
          "name": "tgtBalance",
          "type": "u128"
        }
      ]
    },
    {
      "name": "setPoolShiftMax",
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
          "name": "shiftMax",
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
          "name": "oracleFrom",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleTo",
          "isMut": false,
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
          "name": "oracleFrom",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleTo",
          "isMut": false,
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
          "name": "oracleFrom",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleTo",
          "isMut": false,
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
      "name": "createRebatePool",
      "accounts": [
        {
          "name": "tokenMint",
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
          "name": "woopool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": true
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
      "name": "swapWithRebate",
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
          "name": "oracleFrom",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleTo",
          "isMut": false,
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebateAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebatePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebateVault",
          "isMut": true,
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
      "name": "claimFee",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebateAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "woopool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebatePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rebateVault",
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
    }
  ],
  "accounts": [
    {
      "name": "oracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
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
            "name": "updatedAt",
            "type": "i64"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "round",
            "type": "i128"
          },
          {
            "name": "outerPreferred",
            "type": "bool"
          },
          {
            "name": "oracleType",
            "type": {
              "defined": "OracleType"
            }
          }
        ]
      }
    },
    {
      "name": "rebatePool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "rebateAuthority",
            "type": "publicKey"
          },
          {
            "name": "woopool",
            "type": "publicKey"
          },
          {
            "name": "rebateRate",
            "type": "u16"
          },
          {
            "name": "rebateReserve",
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
            "name": "baseDecimals",
            "docs": [
              "Number of base 10 digits to the right of the decimal place."
            ],
            "type": "u8"
          },
          {
            "name": "enabled",
            "type": "bool"
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
            "name": "oracle",
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
            "name": "capBalance",
            "type": "u128"
          },
          {
            "name": "shiftMax",
            "type": "u16"
          },
          {
            "name": "tgtBalance",
            "type": "u128"
          },
          {
            "name": "protocolFeeOwed",
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
            "name": "oracle",
            "type": "publicKey"
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
            "name": "swapFeeAmount",
            "type": "u128"
          },
          {
            "name": "swapFee",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "OracleType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pyth"
          },
          {
            "name": "ChainLink"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "ClaimFeeEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVault",
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
          "name": "rebateAuthority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebatePool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebateVault",
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
      "name": "SetPoolAdminEvent",
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
      "name": "SetPoolFeeAdminEvent",
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
      "name": "SetWooracleAdminEvent",
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
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oracleFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "wooracleFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopoolFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenOwnerAccountFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVaultFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUpdateFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oracleTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "wooracleTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopoolTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenOwnerAccountTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVaultTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUpdateTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fromAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "minToAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "toAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "SwapWithRebateEvent",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oracleFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "wooracleFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopoolFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenOwnerAccountFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVaultFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUpdateFrom",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oracleTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "wooracleTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "woopoolTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenOwnerAccountTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenVaultTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUpdateTo",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebateAuthority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebatePool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rebateVault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fromAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "minToAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "toAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "swapFeeAfterRebate",
          "type": "u128",
          "index": false
        },
        {
          "name": "rebateFeeAmount",
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
      "name": "WooOracleNotFeasible",
      "msg": "Woo oracle is not feasible"
    },
    {
      "code": 6016,
      "name": "WooOraclePriceNotValid",
      "msg": "Woo oracle price is not valid"
    },
    {
      "code": 6017,
      "name": "WooOraclePriceRangeMin",
      "msg": "Woo oracle price below range MIN"
    },
    {
      "code": 6018,
      "name": "WooOraclePriceRangeMax",
      "msg": "Woo oracle price exceed range MAX"
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
      "name": "NoPoolMintOutput",
      "msg": "Pool Mint Amount < 0 on LP Deposit"
    },
    {
      "code": 6023,
      "name": "BurnTooMuch",
      "msg": "Trying to burn too much"
    },
    {
      "code": 6024,
      "name": "NotEnoughOut",
      "msg": "Not enough out"
    },
    {
      "code": 6025,
      "name": "AmountOutBelowMinimum",
      "msg": "Amount out below minimum threshold"
    }
  ]
};
