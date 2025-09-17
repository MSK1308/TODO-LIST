import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import Home from "./components/Home"; // your converted HTML+CSS+JS page
import CameraDetection from "./components/CameraDetection";
import ChatBot from "./components/ChatBot";
import Dashboard from "./components/Dashboard";
import { Heart, MessageCircle, Camera } from "lucide-react";

function App() {
  const [moodData, setMoodData] = useState(null);

  return (
    <Router>
      {/* Header will show on all pages */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Neurox</h1>
              <p className="text-sm text-gray-500">Your Mental Health Companion</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
            <Link to="/camera" className="text-gray-600 hover:text-blue-600">Mood Check</Link>
            <Link to="/chat" className="text-gray-600 hover:text-blue-600">Chat</Link>
          </nav>
        </div>
      </header>

      {/* Main Routes */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
          {/* Home page (default) */}
          <Route exact path="/" component={Home} />

          {/* Other pages */}
          <Route path="/dashboard" render={() => <Dashboard moodData={moodData} />} />
          <Route path="/camera" render={() => <CameraDetection onMoodDetected={setMoodData} />} />
          <Route path="/chat" component={ChatBot} />
        
      </main>
    </Router>
  );
}

export default App;
