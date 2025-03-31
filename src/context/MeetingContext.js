import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const MeetingContext = createContext();

export const useMeeting = () => {
  return useContext(MeetingContext);
};

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export const MeetingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  
  const localStreamRef = useRef(null);
  const peersRef = useRef({});
  
  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Handle incoming socket events
  useEffect(() => {
    if (!socket) return;
    
    socket.on('user-joined', handleUserJoined);
    socket.on('user-joined-with-signal', handleUserJoinedWithSignal);
    socket.on('receiving-returned-signal', handleReceivingReturnedSignal);
    socket.on('room-users', handleRoomUsers);
    socket.on('user-toggle-audio', handleUserToggleAudio);
    socket.on('user-toggle-video', handleUserToggleVideo);
    socket.on('user-left', handleUserLeft);
    socket.on('receive-message', handleReceiveMessage);
    socket.on('receive-caption', handleReceiveCaption);
    socket.on('new-host', handleNewHost);
    socket.on('host-muted-you', handleHostMutedYou);
    socket.on('kicked-from-meeting', handleKickedFromMeeting);
    
    return () => {
      socket.off('user-joined');
      socket.off('user-joined-with-signal');
      socket.off('receiving-returned-signal');
      socket.off('room-users');
      socket.off('user-toggle-audio');
      socket.off('user-toggle-video');
      socket.off('user-left');
      socket.off('receive-message');
      socket.off('receive-caption');
      socket.off('new-host');
      socket.off('host-muted-you');
      socket.off('kicked-from-meeting');
    };
  }, [socket]);
  
  // Create a new meeting
  const createMeeting = () => {
    const meetingId = uuidv4();
    joinMeeting(meetingId, true);
    return meetingId;
  };
  
  // Join an existing meeting
  const joinMeeting = async (meetingId, asHost = false) => {
    if (!currentUser) return navigate('/login');

    try {
      // Initialize media stream with retry logic
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: true
        });
      } catch (error) {
        console.warn('Failed to get video+audio:', error);
        try {
          // Fallback to audio only
          stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
          });
        } catch (audioError) {
          console.error('Failed to get audio:', audioError);
          throw new Error('Could not access any media devices');
        }
      }

      // Store the stream references
      localStreamRef.current = stream;
      setLocalStream(stream); // Add this line

      // Update initial media states
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      
      setIsCameraOn(!!videoTrack?.enabled);
      setIsMicOn(!!audioTrack?.enabled);
      
      // Join the meeting
      setCurrentMeeting(meetingId);
      setIsHost(asHost);

      // Notify server
      socket.emit('join-room', {
        roomId: meetingId,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Guest'
      });

      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      console.error('Join meeting error:', error);
      alert('Failed to access media devices. Please check your camera and microphone permissions.');
    }
  };
  
  // Leave the current meeting
  const leaveMeeting = () => {
    if (currentMeeting) {
      // Stop all peer connections
      Object.values(peersRef.current).forEach(peer => {
        if (peer.peer) {
          peer.peer.destroy();
        }
      });
      
      // Stop local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        localStreamRef.current = null;
        setLocalStream(null); // Add this line
      }
      
      // Leave the room via socket
      socket.emit('leave-meeting', {
        roomId: currentMeeting,
        userId: currentUser.uid
      });
      
      // Reset state
      setCurrentMeeting(null);
      setParticipants([]);
      setIsHost(false);
      setChatMessages([]);
      setCaptions([]);
      peersRef.current = {};
      
      navigate('/');
    }
  };
  
  // Toggle microphone
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        
        // Notify others
        socket.emit('toggle-audio', audioTrack.enabled);
      }
    }
  };
  
  // Toggle camera
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
        
        // Notify others
        socket.emit('toggle-video', videoTrack.enabled);
      }
    }
  };
  
  // Send a chat message
  const sendMessage = (message) => {
    if (currentMeeting && socket) {
      const messageData = {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Guest',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, messageData]);
      socket.emit('send-message', messageData);
    }
  };
  
  // Send a caption
  const sendCaption = (caption) => {
    if (currentMeeting && socket) {
      socket.emit('send-caption', caption);
    }
  };
  
  // Host controls: Mute a participant
  const muteParticipant = (userId) => {
    if (isHost && currentMeeting && socket) {
      socket.emit('mute-user', { targetUserId: userId });
    }
  };
  
  // Host controls: Remove a participant
  const removeParticipant = (userId) => {
    if (isHost && currentMeeting && socket) {
      socket.emit('remove-user', { targetUserId: userId });
    }
  };
  
  // Handler for when a new user joins the meeting
  const handleUserJoined = ({ userId, userName, isHost: newUserIsHost }) => {
    const peer = createPeer(userId, socket.id, localStreamRef.current);
    
    peersRef.current[userId] = {
      peer,
      userId,
      userName
    };
    
    setParticipants(prev => [
      ...prev, 
      { 
        id: userId, 
        name: userName, 
        isHost: newUserIsHost,
        audioOn: true,
        videoOn: true,
        peer
      }
    ]);
  };
  
  // Handler for receiving a signal from a new user
  const handleUserJoinedWithSignal = ({ signal, from }) => {
    const peer = addPeer(signal, from, localStreamRef.current);
    
    peersRef.current[from] = {
      peer,
      userId: from
    };
  };
  
  // Handler for receiving a returned signal
  const handleReceivingReturnedSignal = ({ signal, from }) => {
    const item = peersRef.current[from];
    if (item) {
      item.peer.signal(signal);
    }
  };
  
  // Handler for receiving the list of users in the room
  const handleRoomUsers = (users) => {
    const participantsArray = users.map(user => ({
      id: user.id,
      name: user.name,
      isHost: user.isHost,
      audioOn: user.audio,
      videoOn: user.video
    }));
    
    setParticipants(participantsArray);
    
    // Check if current user is the host
    const currentUserData = users.find(user => user.id === currentUser?.uid);
    if (currentUserData) {
      setIsHost(currentUserData.isHost);
    }
  };
  
  // Handler for audio toggle events
  const handleUserToggleAudio = ({ userId, isOn }) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === userId 
          ? { ...p, audioOn: isOn } 
          : p
      )
    );
  };
  
  // Handler for video toggle events
  const handleUserToggleVideo = ({ userId, isOn }) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === userId 
          ? { ...p, videoOn: isOn } 
          : p
      )
    );
  };
  
  // Handler for when a user leaves
  const handleUserLeft = ({ userId }) => {
    // Close the peer connection
    if (peersRef.current[userId]) {
      peersRef.current[userId].peer.destroy();
      delete peersRef.current[userId];
    }
    
    // Remove from participants list
    setParticipants(prev => prev.filter(p => p.id !== userId));
  };
  
  // Handler for receiving chat messages
  const handleReceiveMessage = (message) => {
    setChatMessages(prev => [...prev, message]);
  };
  
  // Handler for receiving captions
  const handleReceiveCaption = ({ userId, userName, caption }) => {
    const newCaption = {
      userId,
      userName,
      content: caption,
      timestamp: new Date().toISOString()
    };
    
    setCaptions(prev => [...prev, newCaption]);
    
    // Only keep the last 10 captions
    if (captions.length > 10) {
      setCaptions(prev => prev.slice(prev.length - 10));
    }
  };
  
  // Handler for when a new host is assigned
  const handleNewHost = ({ userId }) => {
    setParticipants(prev => 
      prev.map(p => ({
        ...p,
        isHost: p.id === userId
      }))
    );
    
    setIsHost(userId === currentUser?.uid);
  };
  
  // Handler for when the host mutes you
  const handleHostMutedYou = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = false;
        setIsMicOn(false);
      }
    }
  };
  
  // Handler for when you're kicked from the meeting
  const handleKickedFromMeeting = () => {
    leaveMeeting();
  };
  
  // Helper function to create a new peer connection
  const createPeer = (userToSignal, callerId, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', signal => {
      socket.emit('sending-signal', { signal, to: userToSignal });
    });

    return peer;
  };
  
  // Helper function to add a peer connection
  const addPeer = (incomingSignal, callerId, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on('signal', signal => {
      socket.emit('returning-signal', { signal, to: callerId });
    });

    peer.signal(incomingSignal);

    return peer;
  };
  
  const value = {
    currentMeeting,
    participants,
    isHost,
    isMicOn,
    isCameraOn,
    chatMessages,
    captions,
    localStream, // Change this line
    createMeeting,
    joinMeeting,
    leaveMeeting,
    toggleMic,
    toggleCamera,
    sendMessage,
    sendCaption,
    muteParticipant,
    removeParticipant
  };

  return (
    <MeetingContext.Provider value={value}>
      {children}
    </MeetingContext.Provider>
  );
};