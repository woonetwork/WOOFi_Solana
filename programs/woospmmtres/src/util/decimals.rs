

#[derive(Clone, Default, Copy)]
pub struct Decimals {
    pub price_dec: u64,  // 8
    pub quote_dec: u64,  // 6, same as native USDC
    pub base_dec: u64,   // 18 or 8
}

impl Decimals {
    pub fn new(price: u32, quote: u32, base: u32) -> Self {
        Decimals {
            price_dec: (10 as u64).pow(price),
            quote_dec: (10 as u64).pow(quote),
            base_dec: (10 as u64).pow(base),
        }
    }
}