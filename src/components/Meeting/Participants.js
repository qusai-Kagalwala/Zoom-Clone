import React from 'react';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash, 
  FaCrown,
  FaEllipsisV,
  FaVolumeMute,
  FaUserSlash
} from 'react-icons/fa';

const ParticipantsContainer = styled.div`
  padding: 15px;
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #3a3a3a;
  position: relative;
`;

const ParticipantAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  position: relative;
`;

const HostBadge = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: gold;
  color: #333;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
`;

const ParticipantInfo = styled.div`
  flex: 1;
`;

const ParticipantName = styled.div`
  font-weight: 500;
  display: flex;
  align-items: center;
  
  span {
    margin-left: 5px;
    font-size: 12px;
    color: #aaa;
  }
`;

const ParticipantStatus = styled.div`
  display: flex;
  margin-top: 5px;
  
  svg {
    margin-right: 8px;
    color: ${props => props.muted ? '#dc3545' : '#28a745'};
  }
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    color: white;
  }
`;

const ActionsMenu = styled.div`
  position: absolute;
  right: 0;
  top: 45px;
  background-color: #333;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1;
  overflow: hidden;
`;

const ActionItem = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 8px 12px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #444;
  }
`;

const Participants = () => {
  const { currentUser } = useAuth();
  const { 
    participants, 
    isHost,
    muteParticipant,
    removeParticipant 
  } = useMeeting();
  
  const [openMenu, setOpenMenu] = React.useState(null);
  
  const toggleMenu = (participantId) => {
    setOpenMenu(openMenu === participantId ? null : participantId);
  };
  
  // Get participant initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Handle muting a participant
  const handleMute = (participantId) => {
    muteParticipant(participantId);
    setOpenMenu(null);
  };
  
  // Handle removing a participant
  const handleRemove = (participantId) => {
    removeParticipant(participantId);
    setOpenMenu(null);
  };
  
  return (
    <ParticipantsContainer>
      {participants.map(participant => {
        const isCurrentUser = participant.id === currentUser?.uid;
        
        return (
          <ParticipantItem key={participant.id}>
            <ParticipantAvatar>
              {getInitials(participant.name)}
              {participant.isHost && (
                <HostBadge>
                  <FaCrown size={10} />
                </HostBadge>
              )}
            </ParticipantAvatar>
            
            <ParticipantInfo>
              <ParticipantName>
                {participant.name}
                {isCurrentUser && <span>(You)</span>}
              </ParticipantName>
              
              <ParticipantStatus>
                {participant.audioOn ? 
                  <FaMicrophone /> : 
                  <FaMicrophoneSlash />
                }
                
                {participant.videoOn ? 
                  <FaVideo /> : 
                  <FaVideoSlash />
                }
              </ParticipantStatus>
            </ParticipantInfo>
            
            {isHost && !isCurrentUser && (
              <>
                <MoreButton onClick={() => toggleMenu(participant.id)}>
                  <FaEllipsisV />
                </MoreButton>
                
                {openMenu === participant.id && (
                  <ActionsMenu>
                    <ActionItem onClick={() => handleMute(participant.id)}>
                      <FaVolumeMute />
                      Mute
                    </ActionItem>
                    <ActionItem onClick={() => handleRemove(participant.id)}>
                      <FaUserSlash />
                      Remove
                    </ActionItem>
                  </ActionsMenu>
                )}
              </>
            )}
          </ParticipantItem>
        );
      })}
    </ParticipantsContainer>
  );
};

export default Participants;