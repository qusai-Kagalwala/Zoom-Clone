import React, { useState } from 'react';
import { useMeeting } from '../../context/MeetingContext';
import { FaTimes, FaVideo } from 'react-icons/fa';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    color: #007bff;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #343a40;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  
  input {
    margin-right: 10px;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0069d9;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const CreateMeeting = ({ onClose, onMeetingCreated }) => {
  const [meetingName, setMeetingName] = useState('');
  const [requireApproval, setRequireApproval] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { createMeeting } = useMeeting();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create a new meeting
      const meetingId = createMeeting();
      
      // Notify parent component
      onMeetingCreated(meetingId);
    } catch (error) {
      console.error('Error creating meeting:', error);
      setLoading(false);
    }
  };
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <FaVideo /> New Meeting
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="meetingName">Meeting Name (Optional)</Label>
            <Input
              id="meetingName"
              type="text"
              placeholder="My Meeting"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Checkbox>
              <input
                id="requireApproval"
                type="checkbox"
                checked={requireApproval}
                onChange={() => setRequireApproval(!requireApproval)}
              />
              <Label htmlFor="requireApproval" style={{ margin: 0 }}>
                Require host approval to join
              </Label>
            </Checkbox>
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Start Meeting'}
          </Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateMeeting;