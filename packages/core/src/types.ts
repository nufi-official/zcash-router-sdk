import { SendDepositFn } from './swapApi/domain';

export type RouteAsset = {
  blockchain: 'solana';
  tokenId: string;
};

type AccountBase = {
  asset: RouteAsset;
  getAddress: () => Promise<string>;
  assetToBaseUnits: (amount: string) => bigint;
};

export type AccountAddressOnly = AccountBase & {
  type: 'addressOnly';
};

export type AccountFull = AccountBase & {
  type: 'full';
  getBalance: () => Promise<bigint>;
  sendDeposit: SendDepositFn;
};
