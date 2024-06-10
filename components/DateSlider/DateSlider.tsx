import Slider from "react-slick";
import './DateSlider.css';

interface DateSliderProps {
    sliderDays: Date[]
    onDateChange(current: number, next: number): void
}

export const DateSlider = ({ sliderDays, onDateChange }: DateSliderProps) => {
    return (
        <div className='slider-container'>
        <Slider 
          beforeChange={onDateChange}
          className='center'
          slidesToShow={1}
          slidesToScroll={1}
          speed={300}
          dots={true}
          initialSlide={2}
        >
          {sliderDays.map((date, index) => (
            <div className='slide-content' key={index}>
              <h3 className='slide-text'>
                {index === 2 ? 'Today' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
            </div>
          ))}
        </Slider>
      </div>
    );
}