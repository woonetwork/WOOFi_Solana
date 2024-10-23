import 'dotenv/config';

// Global Program Parameters
export type Cluster = 'localnet' | 'devnet' | 'mainnet';

export function getCluster(_cluster?: string): Cluster {
  let cluster = _cluster ? _cluster : process.env.ANCHOR_PROVIDER_URL!;
  if (cluster.toLowerCase().indexOf("devnet") >= 0) {
      cluster = 'devnet'
  } else if (cluster.toLowerCase().indexOf("mainnet") >= 0) {
    cluster = 'mainnet'
  } else {
    cluster = 'localnet'
  }
  
  return cluster as Cluster;
}

export function endpointFromCluster(cluster: Cluster | undefined): string {
  switch (cluster) {
    case 'mainnet':
      return 'https://api.mainnet-beta.solana.com';
    case 'devnet':
      return 'https://api.devnet.solana.com';
    case 'localnet':
      return 'http://127.0.0.1:8899';
  }
  return 'err';
}
