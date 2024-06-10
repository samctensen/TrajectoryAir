import Slider from "react-slick";
import './DateSlider.css';

interface DateSliderProps {
    onDateChange(current: number, next: number): void
    daySpan: Date[]
}

export const DateSlider = ({ onDateChange, daySpan }: DateSliderProps) => {
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
          {daySpan.map((date, index) => (
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