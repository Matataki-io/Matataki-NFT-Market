// 首字母大写
export const firstUpperCase = ([first, ...other]: any) => {
  return first.toLocaleUpperCase() + other.join('');
};

// 短钱包账号
export const shortedWalletAccount = (account: string) => {
  return account?.slice(0, 6) + '...' + account?.slice(-4);
};
