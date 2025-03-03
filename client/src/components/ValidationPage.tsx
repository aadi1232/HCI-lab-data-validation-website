import { useState, useEffect } from 'react';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import '../styles/ValidationPage.css';

interface User {
  id: number;
  username: string;
  name: string;
}

interface Video {
  id: string;
  path: string;
  correctSign: string;
}

interface Progress {
  completed: number;
  total: number;
  percentage: number;
}

interface ValidationPageProps {
  user: User;
}

const ValidationPage = ({ user }: ValidationPageProps) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [handSigns, setHandSigns] = useState<string[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<Progress>({ completed: 0, total: 0, percentage: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch hand signs, videos, and progress on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch hand signs
        const handSignsResponse = await axios.get('http://localhost:5000/api/handsigns');
        setHandSigns(handSignsResponse.data);
        
        // Fetch videos
        const videosResponse = await axios.get('http://localhost:5000/api/videos');
        setVideos(videosResponse.data);
        
        // Fetch progress
        const progressResponse = await axios.get(`http://localhost:5000/api/progress/${user.id}`);
        setProgress(progressResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user.id]);

  // Get current video
  const currentVideo = videos[currentVideoIndex] || null;

  // Handle sign selection
  const handleSignSelect = (sign: string) => {
    setSelectedSign(sign);
    setSubmitSuccess(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedSign || !currentVideo) return;
    
    try {
      setSubmitting(true);
      
      // Submit validation
      await axios.post('http://localhost:5000/api/submit', {
        userId: user.id,
        videoId: currentVideo.id,
        selectedSign
      });
      
      // Update progress
      const progressResponse = await axios.get(`http://localhost:5000/api/progress/${user.id}`);
      setProgress(progressResponse.data);
      
      setSubmitSuccess(true);
      setSubmitting(false);
      
      // Move to next video after a short delay
      setTimeout(() => {
        if (currentVideoIndex < videos.length - 1) {
          setCurrentVideoIndex(prevIndex => prevIndex + 1);
          setSelectedSign(null);
          setSubmitSuccess(false);
        }
      }, 1000);
      
    } catch (err) {
      console.error('Error submitting validation:', err);
      setError('Failed to submit validation. Please try again.');
      setSubmitting(false);
    }
  };

  // Handle moving to next video
  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prevIndex => prevIndex + 1);
      setSelectedSign(null);
      setSubmitSuccess(false);
    }
  };

  // Handle moving to previous video
  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prevIndex => prevIndex - 1);
      setSelectedSign(null);
      setSubmitSuccess(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (videos.length === 0) {
    return <div className="no-videos">No videos available for validation.</div>;
  }

  // Check if all videos are validated
  const allVideosValidated = progress.completed === progress.total && progress.total > 0;

  return (
    <div className="validation-container">
      <ProgressBar progress={progress.percentage} />
      
      {allVideosValidated ? (
        <div className="completion-message">
          <h2>All Done! 🎉</h2>
          <p>You have completed all video validations. Thank you for your contribution!</p>
        </div>
      ) : (
        <>
          <div className="video-section">
            <h2>Video {currentVideoIndex + 1} of {videos.length}</h2>
            
            <div className="video-player">
              {currentVideo && (
                <video 
                  src={`http://localhost:5000${currentVideo.path}`} 
                  controls 
                  autoPlay 
                  loop 
                  muted
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            
            <div className="video-navigation">
              <button 
                onClick={handlePreviousVideo} 
                disabled={currentVideoIndex === 0}
                className="nav-button"
              >
                Previous
              </button>
              <button 
                onClick={handleNextVideo} 
                disabled={currentVideoIndex === videos.length - 1}
                className="nav-button"
              >
                Next
              </button>
            </div>
          </div>
          
          <div className="selection-section">
            <h3>Select the hand sign shown in the video:</h3>
            
            <div className="sign-options">
              {handSigns.map(sign => (
                <button
                  key={sign}
                  className={`sign-button ${selectedSign === sign ? 'selected' : ''}`}
                  onClick={() => handleSignSelect(sign)}
                >
                  {sign}
                </button>
              ))}
            </div>
            
            <div className="submit-section">
              {submitSuccess && (
                <div className="success-message">Validation submitted successfully!</div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={!selectedSign || submitting}
                className="submit-button"
              >
                {submitting ? 'Submitting...' : 'Submit Validation'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ValidationPage; 