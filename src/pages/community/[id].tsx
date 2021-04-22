import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';

const CommunityId: React.FC = () => {
  return (
    <StyledWrapper>
      <h1>Top 3 Visual Trends of 2020</h1>
      <time>March 28, 2021</time>
      <div>
        <Avatar></Avatar>
        <span>Behance</span>
      </div>
      <div>line</div>
      <div>
        <p>
          2020 was a year of challenges and changes. Despite all the hardships,
          the creative community rallied together to support and inspire each
          other, and to create work that pushed boundaries and embraced new
          influences.We looked back at some of the most appreciated projects on
          Behance this year to identify three distinct creative trends that
          defined 2020. With all the adversities we faced this past year, it’s
          no surprise that many of us were looking for an escape to help us cope
          and heal. From drone photography that put our world into perspective
          to pastel-toned 3D spaces that embraced minimalism, the Behance
          community found avenues of escape and restoration through creativity.
          See the full Restorative Escapes moodboard. Illustrator Xuan Loc Xuan
          has always gravitated towards nature, even as a child. “Among my
          artworks, I really like the paintings which have the nature like
          trees, flowers and the night. Nature gives a relaxing and soothing
          feeling for me. It gives me a lot of inspiration to compose,” she
          shares. For Xuan, illustrating nature also provides an escape from
          reality: “Creating art helps me run away from the reality of this
          life. It makes me dream up beautiful things.”
        </p>
        <img src='https://placeimg.com/540/184/nature?t=1617247698083' alt='' />
        <p>
          2020 was a year of challenges and changes. Despite all the hardships,
          the creative community rallied together to support and inspire each
          other, and to create work that pushed boundaries and embraced new
          influences.We looked back at some of the most appreciated projects on
          Behance this year to identify three distinct creative trends that
          defined 2020. With all the adversities we faced this past year, it’s
          no surprise that many of us were looking for an escape to help us cope
          and heal. From drone photography that put our world into perspective
          to pastel-toned 3D spaces that embraced minimalism, the Behance
          community found avenues of escape and restoration through creativity.
          See the full Restorative Escapes moodboard. Illustrator Xuan Loc Xuan
          has always gravitated towards nature, even as a child. “Among my
          artworks, I really like the paintings which have the nature like
          trees, flowers and the night. Nature gives a relaxing and soothing
          feeling for me. It gives me a lot of inspiration to compose,” she
          shares. For Xuan, illustrating nature also provides an escape from
          reality: “Creating art helps me run away from the reality of this
          life. It makes me dream up beautiful things.”
        </p>
        <p>
          2020 was a year of challenges and changes. Despite all the hardships,
          the creative community rallied together to support and inspire each
          other, and to create work that pushed boundaries and embraced new
          influences.We looked back at some of the most appreciated projects on
          Behance this year to identify three distinct creative trends that
          defined 2020. With all the adversities we faced this past year, it’s
          no surprise that many of us were looking for an escape to help us cope
          and heal. From drone photography that put our world into perspective
          to pastel-toned 3D spaces that embraced minimalism, the Behance
          community found avenues of escape and restoration through creativity.
          See the full Restorative Escapes moodboard. Illustrator Xuan Loc Xuan
          has always gravitated towards nature, even as a child. “Among my
          artworks, I really like the paintings which have the nature like
          trees, flowers and the night. Nature gives a relaxing and soothing
          feeling for me. It gives me a lot of inspiration to compose,” she
          shares. For Xuan, illustrating nature also provides an escape from
          reality: “Creating art helps me run away from the reality of this
          life. It makes me dream up beautiful things.”
        </p>
      </div>
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
export default CommunityId;
