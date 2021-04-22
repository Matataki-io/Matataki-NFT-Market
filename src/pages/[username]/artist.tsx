import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import Link from 'next/link';

const UserArtist: React.FC = () => {
  return (
    <StyledWrapper>
      <div>
        <Avatar></Avatar>
        <div>
          <p>Phoebe Geber Attila</p>
          <p>The most famous sculptor in France.</p>
        </div>
      </div>
      <StyledLine></StyledLine>
      <div className='title'>Presentation</div>
      <div>
        <img src='https://placeimg.com/540/184/nature?t=1617247698083' alt='' />
      </div>

      <StyledLine></StyledLine>
      <div className='title'>Artworks</div>
      <div>
        <img src='https://placeimg.com/540/184/nature?t=1617247698083' alt='' />
      </div>

      <StyledLine></StyledLine>
      <div className='title'>About</div>
      <div>
        <div>
          <p>
            Since Kukje Gallery opened at the center of Seoul in 1982, it has
            been committed to presenting the work of the most current and
            significant Korean and international contemporary artists. The
            Gallery has established itself as a leading venue for showing works
            by major international artists such as Damien Hirst, Eva Hesse,
            Jean-Michel Basquiat, Joan Mitchell, Cy Twombly, Ed Ruscha, Joseph
            Beuys, Anselm Kiefer, Louise Bourgeois, Jenny Holzer, Candida Hofer,
            Bill Viola, Anish Kapoor, etc. The exhibitions provided the foremost
            rare opportunity for the Korean art audiences to encounter the works
            of world-renowned contemporary artists without going abroad.
            Recognizing the importance of promoting Korean artists abroad, Kukje
            Gallery participates annually in major art fairs such as Art Basel,
            Art Basel Miami Beach and The Armory Show. The Gallery first
            presented the most significant artworks by Korean artists alongside
            more recognizable works of high caliber by international artists.
            Consequently, the Korean artists as well as the Gallery have been
            successfully gaining wide exposure and receiving much attention from
            the non-Korean collectors. The Gallery has also been promoting
            Korean artists to non-commercial venues, using its solid network of
            museum curators and critics worldwide. Many of Korean artists who
            have been presented by Kukje Gallery have gone on to participate in
            international biennials and major art museum exhibitions. Kukje
            Gallery has an unmatched reputation in Korea for having introduced
            many of the most critically acclaimed international artists, and for
            supporting the most promising Korean artists. The Gallery continues
            to play a key role in developing the domestic art market and
            promoting Korean artists; as well as drawing the national audience’s
            attention to the currently international art world.
          </p>
        </div>
        <div>
          <img
            src='https://placeimg.com/540/184/nature?t=1617247698083'
            alt=''
          />
          <p>K1 Gallery</p>
          <div>
            <span>icon</span> <span>@K1Gallery</span>
          </div>
          <div>
            <span>icon</span> <span>@K1Gallery</span>
          </div>
          <div>
            <span>icon</span> <span>@K1Gallery</span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  flex: 1;

  max-width: 1480px;
  padding: 48px 20px 256px;
  box-sizing: border-box;

  margin: 0px auto;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const StyledLine = styled.div`
  width: 100%;
  height: 1px;
  background: #dbdbdb;
`;

export default UserArtist;
