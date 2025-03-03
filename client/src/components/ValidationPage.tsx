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
      }, 1500);
      
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
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="no-videos">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
        </svg>
        <p>No videos available for validation.</p>
      </div>
    );
  }

  // Check if all videos are validated
  const allVideosValidated = progress.completed === progress.total && progress.total > 0;

  return (
    <div className="validation-container">
      <ProgressBar progress={progress.percentage} />
      
      {allVideosValidated ? (
        <div className="completion-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h2>All Done! 🎉</h2>
          <p>You have completed all video validations. Thank you for your contribution!</p>
        </div>
      ) : (
        <>
          <div className="video-section">
            <h2>
              <span>Video {currentVideoIndex + 1} of {videos.length}</span>
              <div className="video-counter">
                <span className="completed">{progress.completed}</span>
                <span className="separator">/</span>
                <span className="total">{progress.total}</span>
              </div>
            </h2>
            
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
              <div className="video-controls">
                <button 
                  onClick={handlePreviousVideo} 
                  disabled={currentVideoIndex === 0}
                  className="control-button"
                  title="Previous video"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button 
                  onClick={handleNextVideo} 
                  disabled={currentVideoIndex === videos.length - 1}
                  className="control-button"
                  title="Next video"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
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
                  {selectedSign === sign && (
                    <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            <div className="submit-section">
              {submitSuccess && (
                <div className="success-message">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Validation submitted successfully!</span>
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={!selectedSign || submitting}
                className="submit-button"
              >
                {submitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Submit Validation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ValidationPage; 