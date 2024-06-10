import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slider, SliderThumb } from "@mui/material";
import './TimeSlider.css';

export const TimeSlider = () => {

    return (
        <div className='time-container'>
            <Slider
            sx={{
                color: '#000000',
                height: '100%',
                width: '230px',
                justifyContent: 'center',
                borderBottomLeftRadius: '0px',
                borderBottomRightRadius: '0px',
                '& .MuiSlider-thumb': {
                backgroundColor: '#C9C9C9',
                color: '#FFFFFF',
                '&:hover, &.Mui-focusVisible': {
                    boxShadow: 'none'
                },
                '&.Mui-active': {
                    boxShadow: 'none'
                },
                },
                '& .MuiSlider-mark': {
                backgroundColor: '#C9C9C9',
                },
                '& .MuiSlider-markActive': {
                backgroundColor: '#FFFFFF',
                },
                '& .MuiSlider-track': {
                backgroundColor: '#000000',
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
            aria-label="Time"
            defaultValue={0}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value % 12 === 0 ? 12 : value % 12} ${value >= 12 ? 'PM' : 'AM'}`}
            step={1}
            marks
            min={0}
            max={24}
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