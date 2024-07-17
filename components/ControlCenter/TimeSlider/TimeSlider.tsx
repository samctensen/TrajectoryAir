import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slider, SliderThumb } from '@mui/material';
import './TimeSlider.css';

interface TimeSliderProps {
    sliderValue: number
    onTimeChange(event: Event, value: number | number[], activeThumb: number): void
}

export const TimeSlider = ({ sliderValue, onTimeChange }: TimeSliderProps) => {

    return (
        <div className='time-container'>
            <Slider
                sx={{
                    color: '#000000',
                    height: '7px',
                    width: '220px',
                    justifyContent: 'center',
                    '& .MuiSlider-thumb': {
                    backgroundColor: '#FFFFFF',
                    color: '#FFFFFF',
                    '&:hover, &.Mui-focusVisible': {
                        boxShadow: 'none'
                    },
                    '&.Mui-active': {
                        boxShadow: 'none'
                    },
                    },
                    '& .MuiSlider-mark': {
                    backgroundColor: '#FFFFFF',
                    },
                    '& .MuiSlider-markActive': {
                    backgroundColor: '#000000',
                    },
                    '& .MuiSlider-track': {
                    backgroundColor: '#FFFFFF',
                    },
                    '& .MuiSlider-valueLabel': {
                    backgroundColor: '#000000',
                    color: '#FFFFFF', 
                    borderRadius: '5px',
                    },
                }}
                slots={{
                    thumb: ClockThumbComponent,
                }}
                aria-label='Time'
                defaultValue={0}
                valueLabelDisplay='auto'
                valueLabelFormat={(value) => `${value % 12 === 0 ? 12 : value % 12} ${value >= 12 ? 'PM' : 'AM'}`}
                step={1}
                min={0}
                max={23}
                marks
                value={sliderValue}
                onChange={onTimeChange}
                disabled={true}
            />
        </div>
    );
}

interface ClockThumbComponentProps extends React.HTMLAttributes<unknown> {}

function ClockThumbComponent(props: ClockThumbComponentProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <FontAwesomeIcon icon={faClock} color='#292929' size='xl'/>
    </SliderThumb>
  );
}