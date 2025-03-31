import React, { useState } from 'react';
import { useMeeting } from '../../context/MeetingContext';
import styled from 'styled-components';
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash, 
  FaDesktop, 
  FaUsers, 
  FaCommentAlt, 
  FaEllipsisV,
  FaClosedCaptioning,
  FaLink,
  FaCheck,
  FaPhoneSlash
} from 'react-icons/fa';

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: #2a2a2a;
  border-top: 1px solid #3a3a3a;
`;

const ControlButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.active ? '#dc3545' : 'transparent'};
  color: white;
  border: none;
  border-radius: 8px;
  width: 60px;
  height: 60px;
  margin: 0 5px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#c82333' : '#3a3a3a'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 20px;
    margin-bottom: 5px;
  }
  
  span {
    font-size: 11px;
  }
`;

const EndCallButton = styled(ControlButton)`
  background-color: #dc3545;
  
  &:hover {
    background-color: #c82333;
  }
`;

const MeetingLinkPopup = styled.div`
  position: absolute;
  bottom: 80px;
  background-color: #333;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 300px;
  z-index: 10;
`;

const CopyLinkInput = styled.div`
  display: flex;
  margin-top: 10px;
`;

const LinkInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #444;
  border-radius: 4px 0 0 4px;
  background-color: #222;
  color: white;
`;

const CopyButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 0 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #0069d9;
  }
  
  svg {
    margin-right: 5px;
  }
`;

const MoreOptionsMenu = styled.div`
  position: absolute;
  bottom: 80px;
  right: 20px;
  background-color: #333;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const OptionItem = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  padding: 12px 15px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
  
  &:hover {
    background-color: #444;
  }
`;

const Controls = ({ onToggleParticipants, onToggleChat, onToggleCaptions }) => {
  const { 
    isMicOn,
    isCameraOn,
    toggleMic,
    toggleCamera,
    leaveMeeting,
    currentMeeting
  } = useMeeting();
  
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showMeetingLink, setShowMeetingLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  const toggleScreenShare = async () => {
    // This is a simplified version of screen sharing
    // In a real app, you would need to handle capturing and sharing the screen stream
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // In a real implementation, you would replace the video track
        // with the screen sharing track
        
        setIsScreenSharing(true);
        
        // Listen for when user stops screen sharing
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      } else {
        // Stop screen sharing
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };
  
  const copyMeetingLink = () => {
    // Create a meeting link
    const meetingLink = `${window.location.origin}/meeting/${currentMeeting}`;
    navigator.clipboard.writeText(meetingLink);
    
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };
  
  const endCall = () => {
    leaveMeeting();
  };
  
  return (
    <ControlsContainer>
      <ControlButton 
        active={!isMicOn}
        onClick={toggleMic}
      >
        {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        <span>Mic</span>
      </ControlButton>
      
      <ControlButton 
        active={!isCameraOn}
        onClick={toggleCamera}
      >
        {isCameraOn ? <FaVideo /> : <FaVideoSlash />}
        <span>Camera</span>
      </ControlButton>
      
      <ControlButton 
        active={isScreenSharing}
        onClick={toggleScreenShare}
      >
        <FaDesktop />
        <span>Screen</span>
      </ControlButton>
      
      <ControlButton onClick={onToggleParticipants}>
        <FaUsers />
        <span>People</span>
      </ControlButton>
      
      <ControlButton onClick={onToggleChat}>
        <FaCommentAlt />
        <span>Chat</span>
      </ControlButton>
      
      <ControlButton
        onClick={() => setShowMeetingLink(!showMeetingLink)}
      >
        <FaLink />
        <span>Share</span>
      </ControlButton>
      
      <ControlButton onClick={onToggleCaptions}>
        <FaClosedCaptioning />
        <span>Captions</span>
      </ControlButton>
      
      <ControlButton 
        onClick={() => setShowMoreOptions(!showMoreOptions)}
      >
        <FaEllipsisV />
        <span>More</span>
      </ControlButton>
      
      <EndCallButton onClick={endCall}>
        <FaPhoneSlash />
        <span>End</span>
      </EndCallButton>
      
      {showMeetingLink && (
        <MeetingLinkPopup>
          <h4>Share Meeting Link</h4>
          <p>Copy the link to invite others to your meeting</p>
          
          <CopyLinkInput>
            <LinkInput 
              type="text" 
              value={`${window.location.origin}/meeting/${currentMeeting}`}
              readOnly
            />
            <CopyButton onClick={copyMeetingLink}>
              {linkCopied ? <FaCheck /> : <FaLink />}
              {linkCopied ? 'Copied' : 'Copy'}
            </CopyButton>
          </CopyLinkInput>
        </MeetingLinkPopup>
      )}
      
      {showMoreOptions && (
        <MoreOptionsMenu>
          <OptionItem onClick={() => {
            // Toggle captions
            onToggleCaptions();
            setShowMoreOptions(false);
          }}>
            <FaClosedCaptioning />
            Live Captions
          </OptionItem>
          {/* Add more options as needed */}
        </MoreOptionsMenu>
      )}
    </ControlsContainer>
  );
};

export default Controls;