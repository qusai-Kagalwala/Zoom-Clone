import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import VideoGrid from './VideoGrid';
import Controls from './Controls';
import Chat from './Chat';
import Participants from './Participants';
import CaptionsPanel from './CaptionsPanel';
import { FaTimes, FaUsers, FaCommentAlt, FaClosedCaptioning } from 'react-icons/fa';

const MeetingContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1a1a1a;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #2a2a2a;
`;

const MeetingInfo = styled.div`
  display: flex;
  align-items: center;
`;

const MeetingName = styled.h2`
  font-size: 18px;
  margin: 0;
`;

const MeetingId = styled.div`
  font-size: 14px;
  color: #aaa;
  margin-left: 15px;
`;

const LeaveButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: #c82333;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: ${props => props.isOpen ? '300px' : '0'};
  background-color: #2a2a2a;
  transition: width 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #3a3a3a;
`;

const SidebarTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const TabButtons = styled.div`
  display: flex;
  background-color: #2a2a2a;
  border-top: 1px solid #3a3a3a;
`;

const TabButton = styled.button`
  flex: 1;
  background-color: ${props => props.active ? '#3a3a3a' : 'transparent'};
  color: white;
  border: none;
  padding: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  svg {
    font-size: 18px;
    margin-bottom: 5px;
  }
  
  span {
    font-size: 12px;
  }
  
  &:hover {
    background-color: #3a3a3a;
  }
`;

const RoomContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #121212;
`;

const SidebarNew = styled.div`
  width: ${props => props.show ? '300px' : '0'};
  background: #1a1a1a;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const MeetingRoom = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  
  const { currentUser } = useAuth();
  const { 
    currentMeeting,
    joinMeeting,
    leaveMeeting,
    participants,
    chatMessages,
    captions
  } = useMeeting();
  
  const [activeTab, setActiveTab] = useState('participants');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  
  // Join the meeting if not already joined
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!currentMeeting && meetingId) {
      joinMeeting(meetingId);
    }
  }, [currentUser, currentMeeting, meetingId, joinMeeting, navigate]);
  
  const handleLeave = () => {
    leaveMeeting();
  };
  
  const toggleSidebar = (tab) => {
    if (activeTab === tab && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveTab(tab);
      setIsSidebarOpen(true);
    }
  };
  
  // Get sidebar content based on active tab
  const getSidebarContent = () => {
    switch (activeTab) {
      case 'participants':
        return <Participants />;
      case 'chat':
        return <Chat />;
      case 'captions':
        return <CaptionsPanel />;
      default:
        return null;
    }
  };
  
  // Get sidebar title based on active tab
  const getSidebarTitle = () => {
    switch (activeTab) {
      case 'participants':
        return (
          <SidebarTitle>
            <FaUsers /> Participants ({participants.length})
          </SidebarTitle>
        );
      case 'chat':
        return (
          <SidebarTitle>
            <FaCommentAlt /> Chat
          </SidebarTitle>
        );
      case 'captions':
        return (
          <SidebarTitle>
            <FaClosedCaptioning /> Live Captions
          </SidebarTitle>
        );
      default:
        return null;
    }
  };
  
  return (
    <MeetingContainer>
      <Header>
        <MeetingInfo>
          <MeetingName>Meeting</MeetingName>
          <MeetingId>{meetingId}</MeetingId>
        </MeetingInfo>
        <LeaveButton onClick={handleLeave}>
          <FaTimes /> Leave
        </LeaveButton>
      </Header>
      
      <ContentContainer>
        <MainContent>
          <VideoGrid />
          <Controls 
            onToggleParticipants={() => toggleSidebar('participants')}
            onToggleChat={() => toggleSidebar('chat')}
            onToggleCaptions={() => toggleSidebar('captions')}
          />
        </MainContent>
        
        <Sidebar isOpen={isSidebarOpen}>
          <SidebarHeader>
            {getSidebarTitle()}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <FaTimes />
            </button>
          </SidebarHeader>
          
          <SidebarContent>
            {getSidebarContent()}
          </SidebarContent>
        </Sidebar>
      </ContentContainer>
      
      <TabButtons>
        <TabButton 
          active={activeTab === 'participants' && isSidebarOpen}
          onClick={() => toggleSidebar('participants')}
        >
          <FaUsers />
          <span>Participants</span>
        </TabButton>
        <TabButton 
          active={activeTab === 'chat' && isSidebarOpen}
          onClick={() => toggleSidebar('chat')}
        >
          <FaCommentAlt />
          <span>Chat</span>
        </TabButton>
        <TabButton 
          active={activeTab === 'captions' && isSidebarOpen}
          onClick={() => toggleSidebar('captions')}
        >
          <FaClosedCaptioning />
          <span>Captions</span>
        </TabButton>
      </TabButtons>
    </MeetingContainer>
  );
};

export default MeetingRoom;