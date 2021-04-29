import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head';

const md = `# Web3 个人代币平台 Meta Network 完成新一轮 200 万美元的融资，参投方包括 NGC

链闻消息，Web3 个人代币平台 Meta Network 宣布已于近日正式完成新一轮 200 万美元的融资，参与投资的机构与个人包括 NGC Ventures、Cyberight Capital、OG Labs、YFII 社区开发者高金、MCDEX 创始人刘杰、dForce 创始人 Mindao、币安研究院分析师 Calvin Chu、橙皮书主编李阳、499 DAOs、OG Labs、Primitive Crypto 合伙人 Dovey Wan 等。另外，前轮投资者 Tony Tao 继续追加投资。链闻注，Meta Network （原名 Matataki ）是一个帮助创作者创建个人代币的协议，第三方开发者可以基于 Meta Network 所提供的 SDK 为创作者开发各类基于个人代币的应用场景。

> 除最核心的聚合流动性之外，V3 版本也带来多级费率控制、范围订单（Range Orders）、历史预言机等功能，服务于 LP、交易者、第三方应用开发者。

**撰文：潘致雄**

众望所归的 Uniswap 终于公开了 3.0 版的全新自动做市商（AMM）方案，并与 Paradigm 的研究员共同发布了该版本的白皮书。Uniswap V3 通过在原本的 AMM 曲线上增加名为「聚合流动性」的粒度控制功能，将资金效率「提升 4000 倍」。

团队表示，Uniswap V3 已经经过了多轮的审计，但是由于此次改动较大，所以会先在几天后上线测试网，然后计划在 5 月 5 日正式上线以太坊主网，然后就可能会部署至二层解决方案 Optimism 网络，以进一步降低 Gas 成本。

除了最核心的聚合流动性之外，V3 版本也带来多级费率控制、范围订单（Range Orders）、历史预言机等功能，服务于 LP、交易者、第三方应用开发者。

但是协议的复杂化也带来了一些潜在的问题或缺点，比如更复杂的流动性聚合可能会增加 Gas 成本，LP Token 的非同质化也可能会影响可组合性，以及 Uniswap 为了保护自己协议早期的优势，也更改了软件许可协议，其他商业应用只能在两年后使用 Uniswap 的开源代码。

### 新功能：可进行粒度控制的「聚合流动性」

Uniswap V3 核心亮点是为原本平淡无味的「XY=K」曲线增加了「粒度控制」，用户可以将资金效率集中在交易最频繁的区间内，以获得最大收益。比如说，USDC/DAI 的价格大多数都处于 0.99 至 1.01 的范围内，用户就可以将自己的资金仅放入该区间内的 XY=K 曲线内，而不需要考虑极端情况。

对于一些常规交易对也能进行类似的操作，比如 ETH/DAI 很多时候是处于 1000 至 2000 范围内的，那 LP （流动性提供者）就可以将资金仅放入该区间的曲线内，而不用考虑曲线外。这样对于一个希望赚取交易费的 LP 而言，就可以以更少的资金，覆盖到绝大多数的交易量。

![速览 Uniswap V3 新特性、缺点、疑问和争议](https://ssimg.frontenduse.top/image/2021/03/25/aa72ada09af3cf58e97ba3364f853a10.jpg)

另外，这个新机制的加入也就可以部分解决另一个问题：无常损失。这是个 AMM 经常被社区诟病的缺点之一，但是通过粒度控制，用户可以将自己的资金投入到一个非常小的范围内，如果价格偏离出该范围，那用户就会自动止损，不参与范围外的交易。

### 新功能：多级费率

Uniswap V3 为 LP 提供了三级的费率，分别是 0.05%、0.30% 和 1.00%。通过这些设置，就可以在风险更高的交易对（ETH/DAI）上设置更高费率，而风险更低的交易对（USDC/DAI）上设置更低费率。

Uniswap 团队认为，一种可能的情况是，对于价格波动较小的资产之间可以使用 0.05% 手续费，对于 ETH/DAI 这种交易量较高但波动也较大的交易对可以设置 0.3% 手续费，而其他类资产可以设置 1% 手续费。

### 新功能：范围订单（Range Orders）

Uniswap V3 也为交易者和 LP 提供了全新的功能：范围订单（Range Orders），以补充现在的市价单，这个功能有点像是交易所里限价单（Limit Order）的升级版。

用户可以在设定的某个价格范围内充值某一个资产，如果该资产进入用户设定的范围，该资产就会逐渐换成交易对的另一种资产，如果该资产价格超过价格范围的区间，就会全部换成另一类资产。

![速览 Uniswap V3 新特性、缺点、疑问和争议](https://ssimg.frontenduse.top/image/2021/03/25/b2188c1f02a9124d5a9b3b9d7903a158.jpg)

以上这些都可以通过协议自动实现，Uniswap 团队认为该功能可以用在获取收益、抄底（buying the dip）或代币发行等场景中。

### 新功能：预言机可读取多次历史数据，成本也下降

Uniswap 在 V2 版本中就加入了时间加权的平均价格（TWAP）预言机功能，为第三方提供价格数据，已集成到几十个项目中。

V3 版本对预言机的重大改进是第三方可以通过一次链上调用计算过去约 9 天内任何的 TWAP 价格，同时通过整体优化，相比 V2 降低了 50% 的 Gas 消耗。

### 缺点：可能会增加 Gas，但是可以通过二层解决

Uniswap 的 Gas 消耗一直都是 DEX 中最低的之一，但是此次聚合流动性功能的上线，可能会增加整体的复杂度并增加 Gas 消耗，幸好上线了 Optimism 的 Layer 2 就能解决这样的问题。

有意思的是，团队曾在文章中先表示，V3 版本的 Gas 消耗会比 V2 略微降低，但是随后又在详细介绍的时候称「更多的粒度资金池可能会增加交易的 Gas 成本」。具体如何可能只有上线主网才能知道了。

### 缺点：LP Token 变为非同质化代币，也就是仓位即 NFT

由于此次每位 LP 都可以为不同的价格区间提供流动性，每一个 LP Token 都可能是独特的，所以 LP Token 将不会是 ERC-20 代币，而是 NFT。这可能会让集成 Uniswap LP 代币的的第三方带来可组合性的问题。

Uniswap 团队也做了一些设想，比如共享的头寸可以通过其他合约或者第三方实现可互换，或者将其他复杂的策略代币化（标准化称为其他协议？），这些策略可能是多仓位的，自动重平衡在市场价格周围等等。

### 疑问：如何聚合 Layer1 和 Layer2 的流动性？

虽然 Uniswap 最快在 5 月就会上线以太坊主网和 Optimism 二层网络，但是这两者的流动性目前来看是割裂的，团队也没有对这件事做过多的披露，或许他们有思考这方面的机制设计但还没公开。还有一种可能性就是他们认为未来可能都是会去 Optimism 网络的，所以也可能不需要合并流动性。

### 争议：软件许可

Uniswap 自从被 SushiSwap 进行吸血鬼攻击后，就有一点被动，特别是他们的代币发行计划可能就是在 SushiSwap 的刺激下不得不做的。

所以 Uniswap 这次对于软件许可也做了很大的改变（Business Source License 1.1），虽然最终还会给第三方直接使用权力的（GPL 2.0），但是在两年内，商业或生产级应用是不可以直接使用 Uniswap V3 代码的。

或许这是 Uniswap 团队设置的一种护城河，当两年内可以积累足够的流动性之后，其他协议就算直接使用他们的代码，也无法提供像他们这样的流动性。

但是既然 Uniswap V3 的机制和方案是公开的，所以其他 DeFi 协议是不是会绕开它们具体的开源代码，而用其他的方式来实现，也未尝不可。而且，甚至某些团队本身就是匿名的，这些条款是否真的可以落实到，也可能是个问号。`;

const CommunityId: React.FC = () => {
  return (
    <StyledWrapper>
      <Head>
        <title>
          Web3 个人代币平台 Meta Network 完成新一轮 200 万美元的融资，参投方包括
          NGC
        </title>
        <link
          rel='preload'
          href='https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css'
          as='style'
        />
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css'
        />
      </Head>
      <StyledTitle>
        Web3 个人代币平台 Meta Network 完成新一轮 200 万美元的融资，参投方包括
        NGC
      </StyledTitle>
      <StyledTime>March 28, 2021</StyledTime>
      <StyledUser>
        <Avatar></Avatar>
        <span className='username'>Behance</span>
      </StyledUser>
      <StyledLine></StyledLine>
      <StyledMd>
        <ReactMarkdown className='markdown-body'>{md}</ReactMarkdown>
      </StyledMd>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1114px;
  padding: 48px 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const StyledTitle = styled.h1`
  font-size: 48px;
  font-family: BigCaslon-Medium, BigCaslon;
  font-weight: 500;
  color: #333333;
  line-height: 58px;
  padding: 0;
  margin: 0;
`;
const StyledTime = styled.time`
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #777777;
  line-height: 20px;
  padding: 0;
  margin: 24px 0 16px 0;
  display: inline-block;
`;
const StyledUser = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 44px;
  .username {
    margin-left: 8px;
  }
`;
const StyledLine = styled.div`
  height: 1px;
  background: #dbdbdb;
`;
const StyledMd = styled.div`
  margin: 28px 0 0 0;
  .markdown-body {
  }
`;
export default CommunityId;
