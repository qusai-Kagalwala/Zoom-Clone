import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMeeting } from '../../context/MeetingContext';
import { FaVideo, FaPlus, FaSignOutAlt, FaClipboard, FaCheck } from 'react-icons/fa';
import styled from 'styled-components';
import CreateMeeting from './CreateMeeting';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Header = styled.header`
  background-color: #007bff;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  margin-right: 15px;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const CardTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 20px;
`;

const MeetingActions = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.primary ? '#007bff' : 'white'};
  color: ${props => props.primary ? 'white' : '#2c3e50'};
  border: ${props => props.primary ? 'none' : '1px solid #ddd'};
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
  min-width: 200px;
  
  svg {
    margin-right: 10px;
  }
  
  &:hover {
    background-color: ${props => props.primary ? '#0069d9' : '#f8f9fa'};
  }
`;

const JoinMeetingForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

const Input = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const CopiedMessage = styled.span`
  color: #28a745;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
`;

const Dashboard = () => {
  const [meetingId, setMeetingId] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [createdMeetingId, setCreatedMeetingId] = useState('');
  
  const { currentUser, logout } = useAuth();
  const { joinMeeting } = useMeeting();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (meetingId.trim()) {
      try {
        joinMeeting(meetingId.trim(), false);
      } catch (error) {
        console.error('Join meeting error:', error);
        alert('Failed to join meeting. Please check the meeting ID and try again.');
      }
    } else {
      alert('Please enter a meeting ID');
    }
  };
  
  const handleCopyMeetingId = () => {
    navigator.clipboard.writeText(createdMeetingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  
  const onMeetingCreated = (id) => {
    setCreatedMeetingId(id);
    setShowCreateModal(false);
  };
  
  return (
    <DashboardContainer>
      <Header>
        <Logo>
          <FaVideo /> MeetClone
        </Logo>
        <UserInfo>
          <UserName>Hello, {currentUser?.displayName || 'User'}</UserName>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </LogoutButton>
        </UserInfo>
      </Header>
      
      <Content>
        <Card>
          <CardTitle>Quick Actions</CardTitle>
          <MeetingActions>
            <ActionButton 
              primary 
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus /> New Meeting
            </ActionButton>
            <ActionButton onClick={() => navigate('/join')}>
              <FaVideo /> Join Meeting
            </ActionButton>
          </MeetingActions>
          
          {createdMeetingId && (
            <div style={{ marginTop: '20px' }}>
              <p>Your meeting is ready! Share this meeting ID:</p>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <code style={{ padding: '10px', background: '#f8f9fa', borderRadius: '5px', marginRight: '10px', flex: 1 }}>
                  {createdMeetingId}
                </code>
                {copied ? (
                  <CopiedMessage>
                    <FaCheck /> Copied!
                  </CopiedMessage>
                ) : (
                  <CopyButton onClick={handleCopyMeetingId}>
                    <FaClipboard /> Copy
                  </CopyButton>
                )}
              </div>
            </div>
          )}
        </Card>
        
        <Card>
          <CardTitle>Join a Meeting</CardTitle>
          <JoinMeetingForm onSubmit={handleJoinMeeting}>
            <Input
              type="text"
              placeholder="Enter meeting ID"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              required
            />
            <ActionButton type="submit" primary>
              Join Now
            </ActionButton>
          </JoinMeetingForm>
        </Card>
      </Content>
      
      {showCreateModal && (
        <CreateMeeting 
          onClose={() => setShowCreateModal(false)} 
          onMeetingCreated={onMeetingCreated}
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard;