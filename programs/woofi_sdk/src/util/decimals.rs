#[derive(Clone, Default, Copy)]
pub struct Decimals {
    pub price_dec: u64, // 10 ** 8
    pub quote_dec: u64, // 10 ** 6, same as native USDC
    pub base_dec: u64,  // 10 ** 18 or 8
}

impl Decimals {
    pub fn new(price: u32, quote: u32, base: u32) -> Self {
        Decimals {
            price_dec: 10_u64.checked_pow(price).unwrap(),
            quote_dec: 10_u64.checked_pow(quote).unwrap(),
            base_dec: 10_u64.checked_pow(base).unwrap(),
        }
    }
}
