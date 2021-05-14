import { isEmpty } from 'lodash';
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

export const wordItem = (item: any) => {
  if (isEmpty(item)) {
    return [];
  }

  let list: any = {};
  for (let i = 10; i < 36; i++) {
    //   console.log(i.toString(36))
    list[i.toString(36)] = [];
  }
  list['#'] = [];

  item.forEach((i: any) => {
    let key = i.username.substr(0, 1).toLocaleLowerCase();
    if (list[key]) {
      list[key].push(i);
    } else {
      list['#'].push(i);
    }
  });

  for (const key in list) {
    if (Object.prototype.hasOwnProperty.call(list, key)) {
      const element = list[key];
      if (isEmpty(element)) {
        delete list[key];
      }
    }
  }

  return list;
};
