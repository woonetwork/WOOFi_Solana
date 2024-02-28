pub const CLORACLE_SEED: &str = "cloracle";
pub const WOORACLE_SEED: &str = "wooracle";
pub const CONFIGURATION_SEED: &str = "configuration";
pub const WOOPOOL_SEED: &str = "woopool"; 
pub const WOOPOOL_VAULT_SEED: &str = "woopoolvault"; 

pub const DEFAULT_STALE_DURATION : i64 = 300_000; // Default to 300s
pub const DEFAULT_BOUND : u64 = 10_000_000_000_000_000;
pub const TENPOW18U64: u64 = 1_000_000_000_000_000_000;
pub const TENPOW18U128: u128 = 1_000_000_000_000_000_000;

// Fee rate is represented as hundredths of a basis point.
// Fee amount = total_amount * fee_rate / 100_000.
// Max fee rate supported is u16::MAX around 65.5%.
pub const MAX_FEE_RATE: u16 = u16::MAX - 1;

