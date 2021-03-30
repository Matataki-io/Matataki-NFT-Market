import { Button, ButtonDropdown, Divider, Grid, Text, Tooltip } from '@geist-ui/react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { CSSProperties } from 'react';

const unitedSize: CSSProperties = {
  maxHeight: '720px',
  objectFit: 'cover'
}

export default function NFTsList() {
  const carouselInterval = 5 * 1000
  return (
    <div className="home">
      <div className="carousel-wrapper" style={{ maxHeight: '720px' }}>
        <Carousel autoPlay interval={carouselInterval} infiniteLoop
        swipeable emulateTouch 
        centerMode centerSlidePercentage={100} dynamicHeight={false}
        showThumbs={false}
      >
        <div>
            <img style={unitedSize} src="https://placeimg.com/1280/720/arch/grayscale" />
        </div>
        <div>
            <img style={unitedSize} src="https://placeimg.com/1080/720/arch/grayscale" />
        </div>
        <div>
            <img style={unitedSize} src="https://placeimg.com/720/720/arch/grayscale" />
        </div>
      </Carousel>
      </div>
      <Text h4>Upcoming NFTs</Text>
      <p>T.B.C</p>

      <Text h4>Top NFT Creators</Text>
      <p>T.B.C</p>

      <Text h4>Learn More about NFT Market</Text>
      <p>T.B.C</p>

    </div>
  )
}
