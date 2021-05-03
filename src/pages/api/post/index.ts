import * as _ from 'lodash';
import moment from 'moment';
import { Post } from '../../../types/post';

export default function handler(req, res) {
  const p: Post = {
    id: 1,
    title: 'How to collect your favorite NFTs at Maven NFT?',
    author: 'haskell',
    intro: _.fill(Array(99), 'intro').join(' '),
    cover: 'https://placeimg.com/540/184/nature?t=1617247698083',
    content: _.fill(Array(99), 'content').join(' '),
    createdAt: '2021/5/1',
    updateAt: '2021/5/1',
  };
  const ps = _.fill(Array(10), p);
  for (let i = 0; i < ps.length; ++i) {
    ps[i].id = i + 1;
  }
  res.json(ps);
}
