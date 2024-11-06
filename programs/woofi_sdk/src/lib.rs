/*

░██╗░░░░░░░██╗░█████╗░░█████╗░░░░░░░███████╗██╗
░██║░░██╗░░██║██╔══██╗██╔══██╗░░░░░░██╔════╝██║
░╚██╗████╗██╔╝██║░░██║██║░░██║█████╗█████╗░░██║
░░████╔═████║░██║░░██║██║░░██║╚════╝██╔══╝░░██║
░░╚██╔╝░╚██╔╝░╚█████╔╝╚█████╔╝░░░░░░██║░░░░░██║
░░░╚═╝░░░╚═╝░░░╚════╝░░╚════╝░░░░░░░╚═╝░░░░░╚═╝

*
* MIT License
* ===========
*
* Copyright (c) 2020 WooTrade
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
use solana_sdk::{instruction::AccountMeta, pubkey::Pubkey};

use jupiter_amm_interface::{
    try_get_account_data, AccountMap, Amm, AmmContext, KeyedAccount, Quote, QuoteParams, Swap,
    SwapAndAccountMetas, SwapParams,
};

pub struct WoofiSwap {
    key: Pubkey,
    label: String,
    reserve_mints: [Pubkey; 2],
    reserves: [u128; 2],
    program_id: Pubkey,
}

impl WoofiSwap {
    fn get_authority(&self) -> Pubkey {
        Pubkey::find_program_address(&[&self.key.to_bytes()], &self.program_id).0
    }
}

impl Amm for WoofiSwap {
    fn program_id(&self) -> Pubkey {
        self.program_id
    }

    fn from_keyed_account(keyed_account: &KeyedAccount, amm_context: &AmmContext) -> Result<Self>
    where
        Self: Sized {
        todo!()
    }
    
    fn label(&self) -> String {
        self.label.clone()
    }
    
    fn key(&self) -> Pubkey {
        self.key
    }
    
    fn get_reserve_mints(&self) -> Vec<Pubkey> {
        // vec![self.base_mint, self.quote_mint]
    }
    
    fn get_accounts_to_update(&self) -> Vec<Pubkey> {
        todo!()
    }
    
    fn update(&mut self, account_map: &AccountMap) -> Result<()> {
        todo!()
    }
    
    fn quote(&self, quote_params: &QuoteParams) -> Result<Quote> {
        todo!()
    }
    
    fn get_swap_and_account_metas(&self, swap_params: &SwapParams) -> Result<SwapAndAccountMetas> {
        todo!()
    }
    
    fn clone_amm(&self) -> Box<dyn Amm + Send + Sync> {
        Box::new(self.clone())
    }
    
    // fn get_accounts_to_update(&self) -> Vec<Pubkey> {
    //     vec![self.market_key]
    // }

    // fn update(&mut self, accounts_map: &HashMap<Pubkey, PartialAccount>) -> Result<()> {
    //     let market_account = accounts_map.get(&self.market_key).unwrap();
    //     let (header_bytes, bytes) = &market_account.data.split_at(size_of::<MarketHeader>());
    //     let header = bytemuck::try_from_bytes::<MarketHeader>(header_bytes).unwrap();
    //     let market = load_with_dispatch(&header.market_size_params, bytes)?;
    //     self.ladder = market.inner.get_ladder(u64::MAX);
    //     Ok(())
    // }

    // fn quote(&self, quote_params: &QuoteParams) -> Result<Quote> {
    //     let mut out_amount = 0;
    //     if quote_params.input_mint == self.base_mint {
    //         let mut base_lot_budget = quote_params.in_amount / self.base_atoms_per_base_lot;
    //         for LadderOrder {
    //             price_in_ticks,
    //             size_in_base_lots,
    //         } in self.ladder.bids.iter()
    //         {
    //             if base_lot_budget == 0 {
    //                 break;
    //             }
    //             out_amount += self.base_lots_and_price_to_quote_atoms(
    //                 *size_in_base_lots.min(&base_lot_budget),
    //                 *price_in_ticks,
    //             );
    //             base_lot_budget = base_lot_budget.saturating_sub(*size_in_base_lots);
    //         }
    //     } else {
    //         let mut quote_lot_budget = quote_params.in_amount / self.quote_atoms_per_quote_lot;
    //         for LadderOrder {
    //             price_in_ticks,
    //             size_in_base_lots,
    //         } in self.ladder.asks.iter()
    //         {
    //             if quote_lot_budget == 0 {
    //                 break;
    //             }
    //             let book_amount_in_quote_lots =
    //                 self.base_lots_and_price_to_quote_atoms(*size_in_base_lots, *price_in_ticks);

    //             out_amount += size_in_base_lots.min(
    //                 &((quote_lot_budget * self.num_base_lots_per_base_unit)
    //                     / (self.tick_size_in_quote_atoms_per_base_unit * price_in_ticks)),
    //             ) * self.base_atoms_per_base_lot;
    //             quote_lot_budget = quote_lot_budget.saturating_sub(book_amount_in_quote_lots);
    //         }
    //     };

    //     // Not 100% accurate, but it's a reasoanble enough approximation
    //     Ok(Quote {
    //         out_amount: (out_amount * (10000 - self.taker_fee_bps as u64)) / 10000,
    //         ..Quote::default()
    //     })
    // }

    // fn get_swap_leg_and_account_metas(
    //     &self,
    //     swap_params: &SwapParams,
    // ) -> Result<SwapAndAccountMetas> {
    //     let SwapParams {
    //         destination_mint,
    //         source_mint,
    //         user_destination_token_account,
    //         user_source_token_account,
    //         user_transfer_authority,
    //         ..
    //     } = swap_params;

    //     let log_authority = Pubkey::find_program_address(&["log".as_ref()], &self.program_id).0;

    //     let (side, base_account, quote_account) = if source_mint == &self.base_mint {
    //         if destination_mint != &self.quote_mint {
    //             return Err(Error::msg("Invalid quote mint"));
    //         }
    //         (
    //             Side::Ask,
    //             user_source_token_account,
    //             user_destination_token_account,
    //         )
    //     } else {
    //         if destination_mint != &self.base_mint {
    //             return Err(Error::msg("Invalid base mint"));
    //         }
    //         (
    //             Side::Bid,
    //             user_destination_token_account,
    //             user_source_token_account,
    //         )
    //     };

    //     let base_vault = Pubkey::find_program_address(
    //         &[b"vault", self.market_key.as_ref(), self.base_mint.as_ref()],
    //         &self.program_id,
    //     )
    //     .0;

    //     let quote_vault = Pubkey::find_program_address(
    //         &[b"vault", self.market_key.as_ref(), self.quote_mint.as_ref()],
    //         &self.program_id,
    //     )
    //     .0;

    //     let account_metas = vec![
    //         AccountMeta::new(self.market_key, false),
    //         AccountMeta::new(*user_transfer_authority, true),
    //         AccountMeta::new_readonly(log_authority, false),
    //         AccountMeta::new_readonly(self.program_id, false),
    //         AccountMeta::new(*base_account, false),
    //         AccountMeta::new(*quote_account, false),
    //         AccountMeta::new(base_vault, false),
    //         AccountMeta::new(quote_vault, false),
    //         AccountMeta::new_readonly(spl_token::id(), false),
    //     ];

    //     Ok(SwapAndAccountMetas {
    //         swap: Swap::Serum { side },
    //         account_metas,
    //     })
    // }

}