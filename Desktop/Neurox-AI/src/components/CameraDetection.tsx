import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface CameraDetectionProps {
  onMoodDetected: (moodData: any) => void;
}

const CameraDetection: React.FC<CameraDetectionProps> = ({ onMoodDetected }) => {
  const [isActive, setIsActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simulated emotion detection (in a real app, this would use ML models like TensorFlow.js)
  const simulateEmotionDetection = () => {
    const emotions = ['happy', 'neutral', 'calm', 'focused', 'thoughtful'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = 0.7 + Math.random() * 0.3; // Random confidence between 0.7-1.0
    
    return {
      dominant_emotion: randomEmotion,
      confidence: confidence,
      timestamp: new Date().toISOString(),
      emotions: {
        happy: Math.random(),
        sad: Math.random() * 0.3,
        neutral: Math.random(),
        calm: Math.random(),
        focused: Math.random(),
      }
    };
  };

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsActive(true);
      setHasPermission(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
  };

  const analyzeEmotion = async () => {
    if (!isActive) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis = simulateEmotionDetection();
    setLastAnalysis(analysis);
    onMoodDetected(analysis);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-blue-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Camera className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Mood Detection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use our AI-powered mood detection to understand your current emotional state. This helps us provide 
            personalized support and track your wellness journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera Feed */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Camera Feed</h3>
            <div className="flex space-x-2">
              {!isActive ? (
                <button
                  onClick={startCamera}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <span>Start Camera</span>
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <CameraOff className="h-4 w-4" />
                  <span>Stop Camera</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
            {isActive ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Camera not active</p>
                  {hasPermission === false && (
                    <p className="text-sm mt-2 text-red-600">Camera permission denied</p>
                  )}
                </div>
              </div>
            )}
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
                  <Loader className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-gray-900">Analyzing mood...</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {isActive && (
            <div className="mt-6">
              <button
                onClick={analyzeEmotion}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Current Mood'}
              </button>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
          </div>

          {lastAnalysis ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2 capitalize">
                  {lastAnalysis.dominant_emotion}
                </div>
                <p className="text-gray-600">
                  Confidence: {Math.round(lastAnalysis.confidence * 100)}%
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Analyzed at {new Date(lastAnalysis.timestamp).toLocaleTimeString()}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Detected Emotions</h4>
                <div className="space-y-2">
                  {Object.entries(lastAnalysis.emotions).map(([emotion, value]) => (
                    <div key={emotion} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">{emotion}</span>
                      <div className="flex items-center space-x-2 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(value as number) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10">
                          {Math.round((value as number) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Personalized Recommendation</h4>
                <p className="text-blue-800 text-sm">
                  {lastAnalysis.dominant_emotion === 'happy' && "You seem to be in a positive mood! Consider sharing this energy with others or engaging in creative activities."}
                  {lastAnalysis.dominant_emotion === 'neutral' && "You appear calm and balanced. This is a great time for reflection or learning something new."}
                  {lastAnalysis.dominant_emotion === 'calm' && "Your peaceful state is wonderful. Consider practicing mindfulness or enjoying some quiet time."}
                  {lastAnalysis.dominant_emotion === 'focused' && "You seem concentrated and alert. This is an excellent time for important tasks or decision-making."}
                  {lastAnalysis.dominant_emotion === 'thoughtful' && "You appear contemplative. Consider journaling or having a meaningful conversation with someone you trust."}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start your camera and analyze your mood to see results here</p>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">Privacy & Security</h4>
            <p className="text-yellow-800 text-sm">
              Your video feed is processed locally on your device and is never stored or transmitted to our servers. 
              All mood analysis happens in real-time and only the results are saved to help track your wellness journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraDetection;