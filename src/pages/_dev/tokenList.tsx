import React from 'react';
import { useERC20Single } from '../../hooks/useERC20Single';

export default function TokenList() {
  const { tokenProfile } = useERC20Single(
    '0x36eb1b02cb7be3ffa1ee7bd2a3c7d036002730f7'
  );

  return <div>{JSON.stringify(tokenProfile)}</div>;
}
