import { isEmpty } from 'lodash';
import { WordItemState } from '../types/utiils.d';
import { User } from '../types/User.types.d';

// 首字母大写
export const firstUpperCase = ([first, ...other]: any) => {
  return first.toLocaleUpperCase() + other.join('');
};

// 短钱包账号
export const shortedWalletAccount = (account: string | null) => {
  if (!account) return '';
  return account.slice(0, 6) + '...' + account.slice(-4);
};

/**
 * 短截取
 * @param account
 * @param len
 * @returns
 */
export const shortedAccount = (account: string | null, len = 12) => {
  if (!account) return '';
  if (account.length > len) {
    return account.slice(0, len) + '...';
  }
  return account;
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

/**
 * 首字母 单词分类
 * @param item
 * @returns
 */
export const wordItem = (item: User[]): WordItemState => {
  if (isEmpty(item)) {
    return {} as WordItemState;
  }

  let list: any = {};
  for (let i = 10; i < 36; i++) {
    //   console.log(i.toString(36))
    list[i.toString(36)] = [];
  }
  list['#'] = [];

  item.forEach(i => {
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

/**
 * 余额小数处理
 * @param amount
 * @param decimal
 * @returns
 */
export const balanceDecimal = (amount: string, decimal: number) => {
  // utils.formatUnits 是 0.0
  if (amount === '0.0') return '0';

  let point = amount.indexOf('.');
  if (~point) {
    return amount.slice(0, point + 1 + decimal);
  }
  return amount;
};
