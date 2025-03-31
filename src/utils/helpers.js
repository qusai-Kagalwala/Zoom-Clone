// Generate random color based on string (for avatars)
export const stringToColor = (string) => {
  if (!string) return '#007bff';
  
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

// Format meeting duration
export const formatDuration = (seconds) => {
  if (!seconds) return '00:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
};

// Generate meeting link
export const generateMeetingLink = (meetingId) => {
  return `${window.location.origin}/meeting/${meetingId}`;
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

// Get user initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format timestamp to readable time
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format date
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

// Check if device has camera and microphone
export const checkMediaDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    
    const hasCamera = devices.some(device => device.kind === 'videoinput');
    const hasMicrophone = devices.some(device => device.kind === 'audioinput');
    
    return { hasCamera, hasMicrophone };
  } catch (error) {
    console.error('Error checking media devices:', error);
    return { hasCamera: false, hasMicrophone: false, error };
  }
};

// Check browser WebRTC support
export const checkWebRTCSupport = () => {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    window.RTCPeerConnection
  );
};

// Calculate optimal grid layout based on participant count
export const calculateGridLayout = (count) => {
  if (count <= 1) return { cols: 1, rows: 1 };
  if (count <= 2) return { cols: 2, rows: 1 };
  if (count <= 4) return { cols: 2, rows: 2 };
  if (count <= 6) return { cols: 3, rows: 2 };
  if (count <= 9) return { cols: 3, rows: 3 };
  if (count <= 12) return { cols: 4, rows: 3 };
  if (count <= 16) return { cols: 4, rows: 4 };
  
  // For more participants, keep adding rows
  const cols = 4;
  const rows = Math.ceil(count / cols);
  return { cols, rows };
};

// Handle media errors with user-friendly messages
export const getMediaErrorMessage = (error) => {
  if (!error) return 'Unknown error';
  
  if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
    return 'Permission to use camera or microphone was denied. Please allow access in your browser settings.';
  }
  
  if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
    return 'No camera or microphone found. Please connect a device and try again.';
  }
  
  if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
    return 'Could not access your camera or microphone. It might be in use by another application.';
  }
  
  if (error.name === 'OverconstrainedError') {
    return 'The requested media settings are not available on your device.';
  }
  
  if (error.name === 'TypeError') {
    return 'No media tracks of the requested type are available.';
  }
  
  return `Error accessing media devices: ${error.message}`;
};

export const initializeMediaStream = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideo = devices.some(device => device.kind === 'videoinput');
    const hasAudio = devices.some(device => device.kind === 'audioinput');

    if (!hasVideo && !hasAudio) {
      throw new Error('No camera or microphone found');
    }

    const constraints = {
      audio: hasAudio,
      video: hasVideo ? {
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } : false
    };

    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error('Media initialization error:', error);
    throw new Error('Failed to access camera/microphone. Please check your permissions.');
  }
};

export const requestMediaPermissions = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    return true;
  } catch (error) {
    console.error('Media permissions error:', error);
    alert('Please allow camera and microphone access in your browser settings');
    return false;
  }
};