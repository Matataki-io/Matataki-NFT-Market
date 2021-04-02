import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Page from '../../components/Page';
import MediaViewer from '../../components/MediaViewer';
import SwitchOptions, {
  SwitchOptionsOnChangeParam,
} from '../../components/SwitchOptions';
import MediaMarketInfo from '../../components/MediaMarketInfo';
import MediaTradeActions from '../../components/MediaTradeActions';
import MediaOwnershipInfo, {
  MediaOwnership,
} from '../../components/MediaOwnershipInfo';
import ProofOfAuthenticity from '../../components/ProofOfAuthenticity';

const MediaPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const switchOptions = ['Media', 'Market'] as const;
  const handleSwitchChange = (
    o: SwitchOptionsOnChangeParam<typeof switchOptions[number]>
  ) => {
    console.log(o.option);
  };

  const exampleMediaOwnership: MediaOwnership = {
    creator: {
      avatar:
        'https://ipfs.fleek.co/ipfs/bafybeib6gfnnniiapr7haxeo7ao36ffzcvm6xwjvsl4sfzvf2p7yxkwyei',
      username: 'kikillo',
      isVerified: true,
    },
    owner: {
      avatar: '',
      username: 'mattjrob',
      isVerified: true,
    },
  };
  const scanLink =
    'https://etherscan.io/token/0xabEFBc9fD2F806065b4f3C237d4b59D9A97Bcac7?a=2284';
  const ipfsLink =
    'https://ipfs.fleek.co/ipfs/bafybeichszqqkvvqpy53cwg6hpv623m2jf6xerz66cxdnxaq7siksnlo2i';

  return (
    <Page>
      <StyledWrapper>
        <StyledContentWrapper>
          <StyledContentLeft>
            <StyledMarketContainer>
              <MediaViewer
                type='image'
                src='https://ipfs.fleek.co/ipfs/bafybeichszqqkvvqpy53cwg6hpv623m2jf6xerz66cxdnxaq7siksnlo2i'
              />
              <SwitchOptions
                options={switchOptions}
                onChange={handleSwitchChange}
              />
            </StyledMarketContainer>
          </StyledContentLeft>
          <StyledContentRight>
            <StyledMediaTitle>Oktarpia 1</StyledMediaTitle>
            <MediaMarketInfo value={20} />
            <MediaTradeActions />
            <StyledAuthor>by Kikillo®</StyledAuthor>
            <MediaOwnershipInfo info={exampleMediaOwnership} />
            <ProofOfAuthenticity scanLink={scanLink} ipfsLink={ipfsLink} />
          </StyledContentRight>
        </StyledContentWrapper>
      </StyledWrapper>
      <p>{id}</p>
    </Page>
  );
};

const StyledWrapper = styled.div`
  box-sizing: border-box;
  padding: 30px;
  margin: 0px auto;
  width: 100%;
  max-width: calc(1330px);
`;

const StyledContentWrapper = styled.div`
  width: 100%;
  display: inline-grid;
  column-gap: 30px;
  grid-template-columns: repeat(12, 1fr);
`;

const StyledContentLeft = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  align-items: flex-start;
  height: auto;
  grid-column: 1 / 8;
`;

const StyledContentRight = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  align-items: flex-start;
  height: auto;
  grid-column: 8 / 13;
`;

const StyledMarketContainer = styled.div`
  width: 100%;
  height: 470px;
  position: sticky;
  top: 125px;
  left: 0px;
  right: 0px;
`;

const StyledMediaTitle = styled.h1`
  font-size: 50px;
  font-weight: 400;
  margin-top: 0px;
  margin-bottom: 30px;
  word-break: break-word;
`;

const StyledAuthor = styled.p`
  font-size: 16px;
  line-height: 28px;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.7);
  word-break: break-word;
  white-space: pre-line;
  font-weight: 400;
  margin-top: 0px;
`;

export default MediaPage;
