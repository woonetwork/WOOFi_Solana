import { Program } from "@coral-xyz/anchor";
import Decimal from "decimal.js";
import { Woospmm } from "./artifacts/woospmm";
import * as ix from "./instructions";

export * from "./common";
export * from "./context";
export * from "./client";
export * from "./instructions";

// Global rules for Decimals
//  - 40 digits of precision for the largest number
//  - 20 digits of precision for the smallest number
//  - Always round towards 0 to mirror smart contract rules
Decimal.set({ precision: 40, toExpPos: 40, toExpNeg: -20, rounding: 1 });

/**
 * Instruction builders for the Woospmm program.
 *
 * @category Core
 */
export class WoospmmIx {
    /**
     * Perform a swap in this Woospmm
     *
     * ### Parameters
     * @param program - program object containing services required to generate the instruction
     * @param params - {@link SwapParams}
     * @returns - Instruction to perform the action.
     */
    public static tryQueryIx(program: Program<Woospmm>, params: ix.TryQuerySwapParams) {
        return ix.tryQuerySwapIx(program, params);
    }

    /**
     * Perform a swap in this Woospmm
     *
     * ### Parameters
     * @param program - program object containing services required to generate the instruction
     * @param params - {@link SwapParams}
     * @returns - Instruction to perform the action.
     */
    public static swapIx(program: Program<Woospmm>, params: ix.SwapParams) {
        return ix.swapIx(program, params);
    }
}
