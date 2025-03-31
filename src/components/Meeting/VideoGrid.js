import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaCrown } from 'react-icons/fa';
import { useMeeting } from '../../context/MeetingContext';

const VideoGrid = () => {
  const { participants, localStream, currentUser } = useMeeting();
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(err => 
        console.error('Error playing local video:', err)
      );
    }

    return () => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    };
  }, [localStream]);

  return (
    <GridContainer>
      {/* Local video */}
      <VideoContainer>
        <Video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted // Important: mute local video to prevent feedback
          style={{ transform: 'scaleX(-1)' }} // Mirror local video
        />
        <ParticipantInfo>
          <div>You</div>
        </ParticipantInfo>
      </VideoContainer>

      {/* Remote participants */}
      {participants
        .filter(p => p.id !== currentUser?.uid)
        .map(participant => (
          <VideoContainer key={participant.id}>
            <Video
              autoPlay
              playsInline
              ref={el => {
                if (el && participant.peer) {
                  el.srcObject = participant.peer.streams[0];
                }
              }}
            />
            <ParticipantInfo>
              <div>{participant.name} {participant.isHost && <FaCrown />}</div>
              <div>
                {!participant.audioOn && <FaMicrophoneSlash />}
                {!participant.videoOn && <FaVideoSlash />}
              </div>
            </ParticipantInfo>
          </VideoContainer>
        ))}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

const VideoContainer = styled.div`
  position: relative;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16/9;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ParticipantInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default VideoGrid;