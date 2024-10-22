import "./ControlCenter.css";
import { DateSlider } from "./DateSlider/DateSlider";
import { MediaControls } from "./MediaControls/MediaControls";
import { TimeSlider } from "./TimeSlider/TimeSlider";

interface ControlCenterProps {
  showControls: boolean;
  sliderTime: number;
  onTimeChange(
    event: Event,
    value: number | number[],
    activeThumb: number
  ): void;
  playing: boolean;
  onPlayPauseClicked(): void;
  onSkipClicked(increment: number): void;
  sliderDays: Date[];
  sliderDateIndex: number
  onDateChange(current: number, next: number): void;
}

export const ControlCenter = ({
  showControls,
  sliderTime,
  onTimeChange,
  playing,
  onPlayPauseClicked,
  onSkipClicked,
  sliderDays,
  sliderDateIndex,
  onDateChange,
}: ControlCenterProps) => {
  return (
    <div
      className={`control-center-container ${
        showControls ? "control-center-fade-in" : ""
      }`}
    >
      <TimeSlider sliderValue={sliderTime} onTimeChange={onTimeChange} sliderDateIndex={sliderDateIndex}/>
      <MediaControls
        playing={playing}
        onPlayPauseClicked={onPlayPauseClicked}
        onSkipClicked={onSkipClicked}
      />
      <DateSlider sliderDays={sliderDays} onDateChange={onDateChange}/>
    </div>
  );
};
