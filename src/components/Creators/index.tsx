import React from 'react';
import styled from 'styled-components';

interface CreatorsProps {
  bc: string;
  avatar: string;
  username: string;
}

const CreatorsComponents: React.FC<CreatorsProps> = ({
  bc,
  avatar,
  username,
}) => {
  return (
    <StyledCreatorsComponents>
      <div className='cover'>
        <div className='cover-bc'>
          {bc ? <img src={bc} alt='About' /> : null}
          {bc ? <img src={bc} alt='About' /> : null}
          {bc ? <img src={bc} alt='About' /> : null}
        </div>
        <div className='avatar-box'>
          <div className='avatar'>
            {avatar ? <img src={avatar} alt='Avatar' /> : null}
          </div>
        </div>
      </div>
      <p>{username}</p>
    </StyledCreatorsComponents>
  );
};

const StyledCreatorsComponents = styled.div`
  width: 100%;
  height: 100%;
  /* background: red; */
  .cover {
    height: 184px;
    position: relative;
    &-bc {
      width: calc(100% - 122px);
      height: 100%;
      margin-left: 122px;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.2);
      display: flex;
      justify-content: flex-end;
      img {
        width: 33.33%;
        height: 100%;
        object-fit: cover;
      }
    }
    .avatar-box {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 184px;
      height: 184px;
      &::after {
        content: '';
        display: block;
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(180deg, #f7f3d2, #e7ce8a, #d5a83e);
        z-index: 1;
        animation: rotate 3s linear infinite;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
      }
    }
    .avatar {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 50%;
      border: 4px solid #fff;
      z-index: 2;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  p {
    font-size: 20px;
    font-family: BigCaslon-Medium, BigCaslon;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    padding: 0;
    margin: 24px 0 0 0;
  }
`;

export default CreatorsComponents;
