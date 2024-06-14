import { faBackward, faForward, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './MediaControls.css';

interface MediaProps {
    playing: boolean
    onPlayPauseClicked(): void
    onSkipClicked(increment: number): void
}

export const MediaControls = ({ playing, onPlayPauseClicked, onSkipClicked }: MediaProps)  => {

    return (
        <div className='media-container'>
            <button onClick={() => onSkipClicked(-1)}>
                <FontAwesomeIcon icon={faBackward} className='ml-12' color='#FFFFFF' size='lg'/>
            </button>
            <button onClick={onPlayPauseClicked}>
                <FontAwesomeIcon icon={playing ? faPause : faPlay} color='#FFFFFF' size='lg'/>
            </button>
            <button onClick={() => onSkipClicked(1)}>
                <FontAwesomeIcon icon={faForward} className='mr-12' color='#FFFFFF' size='lg'/>
            </button>
        </div>
    );
}