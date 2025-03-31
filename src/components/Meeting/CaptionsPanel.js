import React, { useEffect, useRef, useState } from 'react';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import * as speechCommands from '@tensorflow-models/speech-commands';

const CaptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`;

const CaptionsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
`;

const CaptionItem = styled.div`
  margin-bottom: 15px;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CaptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const CaptionSpeaker = styled.div`
  font-weight: bold;
  color: ${props => props.isSelf ? '#007bff' : '#aaa'};
`;

const CaptionTime = styled.div`
  font-size: 12px;
  color: #777;
`;

const CaptionText = styled.div`
  background-color: ${props => props.isSelf ? '#007bff' : '#3a3a3a'};
  color: white;
  border-radius: 12px;
  padding: 8px 12px;
  word-break: break-word;
`;

const StatusBar = styled.div`
  padding: 10px 15px;
  border-top: 1px solid #3a3a3a;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusText = styled.div`
  font-size: 12px;
  color: ${props => props.active ? '#28a745' : '#dc3545'};
`;

const ToggleButton = styled.button`
  background-color: ${props => props.active ? '#28a745' : '#6c757d'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#218838' : '#5a6268'};
  }
`;

const CaptionsPanel = () => {
  const { currentUser } = useAuth();
  const { captions, sendCaption } = useMeeting();
  const [isListening, setIsListening] = useState(false);
  const [recognizer, setRecognizer] = useState(null);
  const captionsEndRef = useRef(null);

  // Auto-scroll to bottom when new captions arrive
  useEffect(() => {
    captionsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [captions]);

  // Initialize speech recognition
  useEffect(() => {
    const initializeSpeechRecognition = async () => {
      try {
        // Create recognizer
        const recognizerConfig = {
          vocabulary: [
            'hello', 'meeting', 'yes', 'no', 'thanks', 'thank you',
            'okay', 'ok', 'sure', 'agree', 'disagree', 'next',
            'previous', 'continue', 'stop', 'start'
          ],
          probabilityThreshold: 0.75
        };
        
        const rec = speechCommands.create('BROWSER_FFT', undefined, recognizerConfig);
        await rec.ensureModelLoaded();
        
        setRecognizer(rec);
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
      }
    };

    initializeSpeechRecognition();

    // Cleanup
    return () => {
      if (recognizer) {
        recognizer.stopListening();
      }
    };
  }, []);

  // Toggle speech recognition
  const toggleListening = async () => {
    if (!recognizer) return;

    try {
      if (isListening) {
        recognizer.stopListening();
        setIsListening(false);
      } else {
        setIsListening(true);
        
        recognizer.listen(
          result => {
            // Get the most probable word
            const scores = Array.from(result.scores);
            const maxScoreIndex = scores.indexOf(Math.max(...scores));
            const word = recognizer.wordLabels()[maxScoreIndex];
            
            // Send the caption if confidence is high enough
            if (result.scores[maxScoreIndex] > 0.8) {
              sendCaption(word);
            }
          },
          {
            includeSpectrogram: true,
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: false,
            overlapFactor: 0.5
          }
        );
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
      setIsListening(false);
    }
  };

  // Format timestamp
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <CaptionsContainer>
      <CaptionsList>
        {captions.map((caption, index) => {
          const isSelf = caption.userId === currentUser?.uid;
          
          return (
            <CaptionItem key={`caption-${index}`}>
              <CaptionHeader>
                <CaptionSpeaker isSelf={isSelf}>
                  {caption.userName} {isSelf && '(You)'}
                </CaptionSpeaker>
                <CaptionTime>
                  {formatTime(caption.timestamp)}
                </CaptionTime>
              </CaptionHeader>
              <CaptionText isSelf={isSelf}>
                {caption.content}
              </CaptionText>
            </CaptionItem>
          );
        })}
        <div ref={captionsEndRef} />
      </CaptionsList>
      
      <StatusBar>
        <StatusText active={isListening}>
          {isListening ? 'Captions are on' : 'Captions are off'}
        </StatusText>
        <ToggleButton 
          active={isListening}
          onClick={toggleListening}
        >
          {isListening ? 'Turn Off' : 'Turn On'}
        </ToggleButton>
      </StatusBar>
    </CaptionsContainer>
  );
};

export default CaptionsPanel;