import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      <button className='date-slider-left-arrow' onClick={sliderRef.current?.slickPrev}>
        <FontAwesomeIcon icon={faAngleLeft} className='text-white' size='xl'/>
      </button>
      <Slider
        ref={sliderRef}
        beforeChange={onDateChange}
        className='center'
        slidesToShow={1}
        slidesToScroll={1}
        speed={300}
        initialSlide={0}
        arrows={false}
        draggable={false}
      >
        {sliderDays.map((date, index) => (
          <div className='slide-content' key={index}>
            <h3 className='slide-text'>
              {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
          </div>
        ))}
      </Slider>
      <button className='date-slider-right-arrow' onClick={sliderRef.current?.slickNext}>
        <FontAwesomeIcon icon={faAngleRight} className='text-white' size='xl'/>
      </button>
    </div>
  );
}