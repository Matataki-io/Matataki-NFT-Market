import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { User } from '../../types/User.types.d';
import { WordItemState } from '../../types/utiils.d';

interface Props {
  list: WordItemState;
}

const Word = ({ list }: Props) => {
  return (
    <StyledWord>
      {Object.keys(list).map((key: string, idx) => (
        <ul key={idx} className='item'>
          <li>
            <h3>{key.toLocaleUpperCase()}</h3>
          </li>
          {list[key].map((i: User, idx: number) => (
            <li key={idx}>
              <Link href={`/${i.username}`}>
                <a>
                  {i.username}({i.nickname})
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </StyledWord>
  );
};

const StyledWord = styled.div`
  column-count: 4;
  margin-top: 16px;
  column-gap: 20px;
  @media screen and (max-width: 768px) {
    column-count: 2;
  }
  .item {
    /* 防止多列布局，分页媒体和多区域上下文中的意外中断 */
    break-inside: avoid;
    padding: 48px 0 0 0;
    margin: 0;
    list-style: none;
    @media screen and (max-width: 567px) {
      padding-top: 20px;
    }
    li {
      margin: 9px 0;
      font-family: 'Playfair Display', serif;
      font-weight: 500;
      color: #333333;
      a {
        font-size: 16px;
        line-height: 19px;
        color: #333333;
        &:hover {
          text-decoration: underline;
        }
      }
      &:nth-child(1) {
        margin: 0;
      }
      &:nth-child(2) {
        margin-top: 16px;
      }
      h3 {
        font-size: 32px;
        line-height: 39px;
        padding: 0;
        margin: 0;
      }
    }
  }
`;

export default Word;
