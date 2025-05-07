import React, { useState, useEffect, useRef } from 'react';
import { Button, Progress } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import '../styles/audio-player.css';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const AudioPlayer = ({ src, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const audioRef = useRef(null);
  const waveformRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };
    
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    
    // Events
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);
    
    // Generate random waveform pattern for visual effect
    generateWaveform();
    
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  const generateWaveform = () => {
    if (!waveformRef.current) return;
    
    const canvas = waveformRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Generate a random waveform pattern
    const barCount = compact ? 20 : 40;
    const barWidth = width / barCount;
    const barGap = 2;
    
    for (let i = 0; i < barCount; i++) {
      // Random height for each bar
      const barHeight = Math.random() * (height * 0.8) + (height * 0.2);
      
      // Gradient color based on position
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(124, 58, 237, 0.8)');
      gradient.addColorStop(1, 'rgba(79, 70, 229, 0.4)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(
        i * (barWidth + barGap), 
        (height - barHeight) / 2, 
        barWidth, 
        barHeight
      );
    }
  };
  
  const togglePlayPause = () => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      audio.play();
      animationRef.current = requestAnimationFrame(updateProgress);
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const updateProgress = () => {
    setCurrentTime(audioRef.current.currentTime);
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    animationRef.current = requestAnimationFrame(updateProgress);
  };
  
  const handleProgressChange = (value) => {
    const audio = audioRef.current;
    const newTime = (value / 100) * audio.duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(value);
  };
  
  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !audio.muted;
    setIsMuted(!isMuted);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    cancelAnimationFrame(animationRef.current);
  };
  
  return (
    <div className={`custom-audio-player ${compact ? 'compact' : ''}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="audio-controls">
        <Button 
          appearance="primary"
          circle
          className="play-btn"
          onClick={togglePlayPause}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </Button>
        
        {!compact && (
          <Button
            appearance="subtle"
            circle
            className="volume-btn"
            onClick={toggleMute}
          >
            <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
          </Button>
        )}
      </div>
      
      <div className="audio-progress">
        <canvas 
          ref={waveformRef} 
          className="waveform-canvas"
          width={compact ? 100 : 200}
          height={compact ? 30 : 40}
        />
        
        <Progress.Line
          percent={progress}
          strokeColor="#7c3aed"
          showInfo={false}
          className="progress-bar"
          onClick={handleProgressChange}
        />
        
        {!compact && (
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{isLoaded ? formatTime(duration) : '--:--'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
