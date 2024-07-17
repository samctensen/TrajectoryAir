import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MapLegend.css';

interface MapLegendProps {
    showLegend: boolean,
    onClick: () => void
}

export const MapLegend = ({showLegend, onClick}: MapLegendProps) => {

    return (
        <div className={`legend ${showLegend ? 'legend-slide-in' : 'legend-slide-out'}`}>
            <button className='legend-button' onClick={onClick}>
                    <FontAwesomeIcon icon={showLegend ? faAngleRight : faAngleLeft} className='text-white' style={{ transform: 'scaleY(2)' }}/>
            </button>
            <div className='legend-container'>
                <div className='legend-row'>
                        <div className='legend-color' style={{ backgroundColor: '#7E0023' }} />
                        <hr className='legend-line' />
                        <h1 className='text-2s text-white ml-1'>Hazardous</h1>
                </div>
                <div className='legend-row'>
                        <div className='legend-color' style={{ backgroundColor: '#8F3F97' }} />
                        <hr className='legend-line' />
                        <h1 className='text-2s text-white ml-1'>Very Unhealthy</h1>
                </div>
                <div className='legend-row'>
                        <div className='legend-color' style={{ backgroundColor: '#FF0000' }} />
                        <hr className='legend-line' />
                        <h1 className='text-2s text-white ml-1'>Unhealthy for Everyone</h1>
                </div>
                <div className='legend-row'>
                        <div className='legend-color' style={{ backgroundColor: '#FF7E00' }} />
                        <hr className='legend-line' />
                        <h1 className='text-2s text-white ml-1'>Unhealthy for Sensitive Groups</h1>
                </div>
                <div className='legend-row'>
                        <div className='legend-color' style={{ backgroundColor: '#FFFF00' }} />
                        <hr className='legend-line' />
                        <h1 className='text-2s text-white ml-1'>Moderate</h1>
                </div>
                <div className='legend-row'>
                        <div className='legend-color' style={{ backgroundColor: '#00E400' }} />
                        <hr className='legend-line' />
                        <h1 className='text-2s text-white ml-1'>Good</h1>
                </div>
            </div>
        </div>
    );
};
