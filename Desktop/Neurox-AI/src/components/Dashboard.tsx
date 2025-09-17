import React from 'react';
import { TrendingUp, Heart, Smile, Calendar, BookOpen, Phone } from 'lucide-react';

interface DashboardProps {
  moodData: any;
}

const Dashboard: React.FC<DashboardProps> = ({ moodData }) => {
  const mentalHealthTips = [
    "Take 5 deep breaths when feeling overwhelmed",
    "Practice gratitude by writing down 3 things you're thankful for",
    "Take a 10-minute walk in nature or fresh air",
    "Connect with a friend or loved one today",
    "Practice mindfulness for just 5 minutes",
  ];

  const emergencyResources = [
    { name: "Crisis Text Line", contact: "Text HOME to 741741", description: "24/7 crisis support via text" },
    { name: "National Suicide Prevention Lifeline", contact: "988", description: "24/7 phone support" },
    { name: "SAMHSA Helpline", contact: "1-800-662-4357", description: "Mental health and substance abuse" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-blue-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Neurox</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your personal mental health companion. We're here to support you on your wellness journey with mood tracking, 
            personalized insights, and 24/7 chat support.
          </p>
        </div>
      </div>

      {/* Mood Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Mood</h3>
            <Smile className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="text-center">
            {moodData ? (
              <>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {moodData.dominant_emotion}
                </div>
                <p className="text-sm text-gray-500">
                  Confidence: {Math.round(moodData.confidence * 100)}%
                </p>
              </>
            ) : (
              <p className="text-gray-500">Use Mood Check to track your current state</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">+12%</div>
            <p className="text-sm text-gray-500">Improvement in mood stability</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Check-ins</h3>
            <Calendar className="h-6 w-6 text-purple-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">7</div>
            <p className="text-sm text-gray-500">This week</p>
          </div>
        </div>
      </div>

      {/* Daily Tips */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-blue-100">
        <div className="flex items-center space-x-3 mb-6">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Daily Wellness Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentalHealthTips.map((tip, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-gray-700 font-medium">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Resources */}
      <div className="bg-red-50 rounded-2xl shadow-sm p-8 border border-red-100">
        <div className="flex items-center space-x-3 mb-6">
          <Phone className="h-6 w-6 text-red-600" />
          <h3 className="text-xl font-semibold text-red-900">Crisis Resources</h3>
        </div>
        <p className="text-red-700 mb-6">If you're experiencing a mental health crisis, please reach out immediately:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyResources.map((resource, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-gray-900 mb-1">{resource.name}</h4>
              <p className="text-red-600 font-bold mb-2">{resource.contact}</p>
              <p className="text-sm text-gray-600">{resource.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;