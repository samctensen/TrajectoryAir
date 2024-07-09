import { faWind } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Logo.css';

interface LogoProps {
  fadeOut: boolean;
}

export const Logo = ({ fadeOut }: LogoProps) => {
  return (
    <div
      className={`flex items-center justify-center h-screen w-screen absolute top-0 left-0 z-10 pointer-events-none 
        ${fadeOut ? 'logo-fade-out' : ''}`}
    >
      <div className='text-center pointer-events-auto'>
        <h1 className='text-6xl font-bold text-white'>
          Trajectory Air
          <FontAwesomeIcon
            icon={faWind}
            className='text-white ml-4'
          />
        </h1>
      </div>
    </div>
  );
};
