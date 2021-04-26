// 首字母大写
export const firstUpperCase = ([first, ...other]: any) => {
  return first.toLocaleUpperCase() + other.join('');
};

// 短钱包账号
export const shortedWalletAccount = (account: string) => {
  if (!account) return;
  return account.slice(0, 6) + '...' + account.slice(-4);
};

// diff
export const diffData = (newData: any, oldData: any) => {
  let data: any = {};
  for (const key in newData) {
    if (Object.prototype.hasOwnProperty.call(newData, key)) {
      if (newData[key] !== oldData[key]) {
        data[key] = newData[key];
      }
    }
  }
  return data;
};
