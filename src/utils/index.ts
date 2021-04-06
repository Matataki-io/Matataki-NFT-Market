// 首字母大写
export const firstUpperCase = ([first, ...other]: any) => {
  return first.toLocaleUpperCase() + other.join('');
};
