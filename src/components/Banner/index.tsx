import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { CSSProperties } from 'react';
import styled from 'styled-components';

const unitedSize: CSSProperties = {
  maxHeight: '648px',
  objectFit: 'cover'
}

const StyledBanner = styled.div`
  width: 100%;
`

const Banner = () => {
  const carouselInterval = 5 * 1000

  return (
      <Carousel
      autoPlay
      interval={carouselInterval}
      infiniteLoop
      swipeable
      emulateTouch
      centerMode
      centerSlidePercentage={100}
      dynamicHeight={false}
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
  )
}
export default Banner