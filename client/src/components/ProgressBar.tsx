import '../styles/ProgressBar.css';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className="progress-container">
      <div className="progress-label">Progress: {clampedProgress}%</div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 