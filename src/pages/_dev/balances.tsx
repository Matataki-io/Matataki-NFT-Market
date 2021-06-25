import { Input, Button, Code, Page } from '@geist-ui/react';
import { utils } from 'ethers';
import React, { useState } from 'react';

import { useBalances } from '../../hooks/useBalances';

export default function BalancesDev() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const { balanceOf } = useBalances(tokens);
  return (
    <Page>
      <Code>{JSON.stringify(tokens)}</Code>
      {tokens.map(t => (
        <p key={t}>
          {t} : {balanceOf(t).toString()}
        </p>
      ))}
      <Input
        placeholder='New Token address here...'
        onChange={e => setInput(e.target.value)}
      />
      <Button
        onClick={() => {
          if (!utils.isAddress(input)) {
            alert('Bad address');
            return;
          }
          setTokens([...tokens, utils.getAddress(input)]);
          setInput('');
        }}>
        Add
      </Button>
    </Page>
  );
}
