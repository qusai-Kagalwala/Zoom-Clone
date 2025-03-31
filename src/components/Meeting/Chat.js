import React, { useState, useRef, useEffect } from 'react';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
`;

const MessageGroup = styled.div`
  margin-bottom: 15px;
`;

const MessageSender = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: ${props => props.isSelf ? '#007bff' : '#aaa'};
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
`;

const Timestamp = styled.span`
  font-size: 12px;
  color: #777;
  font-weight: normal;
`;

const MessageBubble = styled.div`
  background-color: ${props => props.isSelf ? '#007bff' : '#3a3a3a'};
  color: white;
  border-radius: 12px;
  padding: 8px 12px;
  max-width: 80%;
  margin-left: ${props => props.isSelf ? 'auto' : '0'};
  word-break: break-word;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-top: 1px solid #3a3a3a;
`;

const ChatInput = styled.input`
  flex: 1;
  background-color: #3a3a3a;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 10px 15px;
  font-size: 14px;
  outline: none;
  
  &::placeholder {
    color: #aaa;
  }
`;

const SendButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  margin-left: 10px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    color: #555;
    cursor: not-allowed;
  }
`;

const SystemMessage = styled.div`
  text-align: center;
  padding: 5px 10px;
  margin: 10px 0;
  color: #aaa;
  font-size: 12px;
`;

const Chat = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const { currentUser } = useAuth();
  const { chatMessages, sendMessage } = useMeeting();
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
    }
  };
  
  // Format timestamp
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Group messages by sender
  const groupMessages = () => {
    const groups = [];
    let currentGroup = null;
    
    chatMessages.forEach((msg) => {
      // Skip system messages for now (could be handled separately)
      if (msg.type === 'system') {
        groups.push({
          type: 'system',
          message: msg
        });
        currentGroup = null;
        return;
      }
      
      // Start a new group if sender changes
      if (!currentGroup || currentGroup.senderId !== msg.senderId) {
        currentGroup = {
          senderId: msg.senderId,
          senderName: msg.senderName,
          messages: [msg],
          isSelf: msg.senderId === currentUser?.uid
        };
        groups.push(currentGroup);
      } else {
        // Add to existing group
        currentGroup.messages.push(msg);
      }
    });
    
    return groups;
  };
  
  return (
    <ChatContainer>
      <MessagesContainer>
        {groupMessages().map((group, index) => {
          if (group.type === 'system') {
            return (
              <SystemMessage key={`system-${index}`}>
                {group.message.content}
              </SystemMessage>
            );
          }
          
          return (
            <MessageGroup key={`group-${index}`}>
              <MessageSender isSelf={group.isSelf}>
                {group.senderName}
                <Timestamp>
                  {formatTime(group.messages[0].timestamp)}
                </Timestamp>
              </MessageSender>
              
              {group.messages.map((msg, msgIndex) => (
                <MessageBubble 
                  key={`msg-${msgIndex}`}
                  isSelf={group.isSelf}
                >
                  {msg.content}
                </MessageBubble>
              ))}
            </MessageGroup>
          );
        })}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer onSubmit={handleSubmit}>
        <ChatInput
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <SendButton 
          type="submit"
          disabled={!message.trim()}
        >
          <FaPaperPlane />
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;