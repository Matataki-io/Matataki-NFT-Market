import { Themes } from '@geist-ui/react';

export const light = Themes.createFromLight({
  type: 'clight',
  palette: {
    success: '#000',
  },
});

export const dark = Themes.createFromDark({
  type: 'cdark',
  palette: {
    success: '#000',
  },
});
