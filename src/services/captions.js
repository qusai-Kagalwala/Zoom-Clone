import * as speechCommands from '@tensorflow-models/speech-commands';

// Initialize speech recognition
export const initSpeechRecognition = async (customVocabulary = []) => {
  try {
    // Create default vocabulary for meetings
    const defaultVocabulary = [
      'hello', 'hi', 'good morning', 'good afternoon', 'goodbye',
      'thank you', 'thanks', 'yes', 'no', 'okay', 'sure',
      'agree', 'disagree', 'next', 'previous', 'continue',
      'stop', 'start', 'mute', 'unmute', 'camera', 'video',
      'screen', 'share', 'meeting', 'participant', 'host',
      'please', 'sorry', 'excuse me', 'question', 'answer'
    ];
    
    // Combine default and custom vocabulary
    const vocabulary = [...defaultVocabulary, ...customVocabulary];
    
    // Create recognizer
    const recognizerConfig = {
      vocabulary,
      probabilityThreshold: 0.75
    };
    
    const recognizer = speechCommands.create('BROWSER_FFT', undefined, recognizerConfig);
    await recognizer.ensureModelLoaded();
    
    return recognizer;
  } catch (error) {
    console.error('Error initializing speech recognition:', error);
    throw error;
  }
};

// Start listening for speech
export const startListening = (recognizer, onResult, options = {}) => {
  if (!recognizer) {
    throw new Error('Speech recognizer not initialized');
  }
  
  // Default options
  const defaultOptions = {
    includeSpectrogram: true,
    probabilityThreshold: 0.75,
    invokeCallbackOnNoiseAndUnknown: false,
    overlapFactor: 0.5
  };
  
  // Merge default options with user options
  const listenerOptions = { ...defaultOptions, ...options };
  
  // Start listening
  recognizer.listen(onResult, listenerOptions);
  
  return {
    stop: () => recognizer.stopListening()
  };
};

// Process speech recognition results
export const processSpeechResult = (result, recognizer) => {
  if (!result || !recognizer) return null;
  
  // Get the most probable word
  const scores = Array.from(result.scores);
  const maxScoreIndex = scores.indexOf(Math.max(...scores));
  const word = recognizer.wordLabels()[maxScoreIndex];
  const confidence = result.scores[maxScoreIndex];
  
  return {
    word,
    confidence
  };
};

// Format caption with punctuation (simplified)
export const formatCaption = (caption, previousCaption = '') => {
  // This is a very simplified caption formatting function
  // In a real application, you would want to use more sophisticated NLP
  if (!caption) return '';
  
  // Capitalize first letter
  let formattedCaption = caption.charAt(0).toUpperCase() + caption.slice(1);
  
  // Add punctuation if it doesn't already have it
  if (!/[.?!]$/.test(formattedCaption)) {
    formattedCaption += '.';
  }
  
  return formattedCaption;
};

// Stop speech recognition
export const stopListening = (recognizer) => {
  if (recognizer) {
    recognizer.stopListening();
  }
};