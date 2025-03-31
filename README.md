# Zoom Clone App

A comprehensive video conferencing application built with React, WebRTC, and Firebase that offers real-time video, audio, chat, and screen sharing features.

## Features

- 🔐 User authentication
- 🎥 Video and audio conferencing
- 💬 In-meeting text chat
- 📊 Screen sharing
- 👥 Participant management
- 🎤 Microphone mute/unmute
- 📹 Camera on/off toggle
- 👑 Host privileges (mute/remove participants)
- 📝 Live captions
- 🔗 Shareable meeting links

## Tech Stack

- **Frontend**: React, React Router, Styled Components
- **Backend**: Node.js, Express, Socket.io
- **Real-time Communication**: WebRTC (Simple Peer)
- **Authentication & Database**: Firebase (Auth & Firestore)
- **Speech Recognition**: TensorFlow.js (Speech Commands)

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```
   PORT=5000
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the project root directory:
   ```
   cd zoom-clone
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_SERVER_URL=http://localhost:5000
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage

1. Register for an account or login
2. Create a new meeting or join an existing one using a meeting ID
3. Share the meeting ID with others to invite them
4. Use the control panel to toggle your audio/video, share your screen, or access the chat
5. Hosts can mute or remove participants
6. Enable live captions for speech-to-text transcription

## Deployment

### Backend Deployment

1. Deploy the server to a platform like Heroku, Vercel, or AWS
2. Update the `REACT_APP_SERVER_URL` in your frontend `.env` file with the deployed server URL

### Frontend Deployment

1. Build the production version:
   ```
   npm run build
   ```

2. Deploy the `build` folder to a static hosting service like Firebase Hosting, Netlify, or Vercel

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [WebRTC.org](https://webrtc.org/) for the real-time communication technology
- [Simple Peer](https://github.com/feross/simple-peer) for simplifying WebRTC implementation
- [Socket.io](https://socket.io/) for signaling and real-time events
- [Firebase](https://firebase.google.com/) for authentication and database services
- [TensorFlow.js](https://www.tensorflow.org/js) for speech recognition capabilities