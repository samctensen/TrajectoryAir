import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './DateSlider.css';

interface DateSliderProps {
    sliderDays: Date[]
    onDateChange(current: number, next: number): void
}

export const DateSlider = ({ sliderDays, onDateChange }: DateSliderProps) => {

  const sliderRef = useRef<Slider>(null);

  return (
    <div className='slider-container'>
      <Slider
        ref={sliderRef}
        beforeChange={onDateChange}
        className='center'
        slidesToShow={1}
        slidesToScroll={1}
        speed={300}
        dots={true}
        initialSlide={0}
        arrows={false}
      >
        {sliderDays.map((date, index) => (
          <div className='slide-content' key={index}>
            <h3 className='slide-text'>
              {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
          </div>
        ))}
      </Slider>
    </div>
  );
}