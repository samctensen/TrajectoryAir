import { DAYS_OF_WEEK } from '@/constants/constants';
import { faWind } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CornerHUD.css';

interface CornerHUDProps {
    time: number,
    sliderDate: Date,
    showHUD: boolean
}

export const CornerHUD = ({ time, sliderDate, showHUD }: CornerHUDProps) => {
  
    return (
        <div className={`corner-logo ${showHUD ? 'hud-fade-in' : ''}`}>
            <h1 className='text-3xl font-bold text-white'>
                Trajectory Air 
                <FontAwesomeIcon icon={faWind} className='ml-2' />
            </h1>
            <h1 className='text-xl font-bold text-white ml-4 mt-1'>{`${DAYS_OF_WEEK[sliderDate.getDay()]}, ${time % 12 === 0 ? 12 : time % 12} ${time >= 12 ? 'PM' : 'AM'}`}</h1>
        </div>
    );
  };
  