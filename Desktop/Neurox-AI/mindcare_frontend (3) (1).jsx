import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MindCareApp() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow rounded-2xl px-6 py-4 mb-6">
        <h1 className="text-xl font-bold text-blue-700">Neurox</h1>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex gap-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="mood">Mood Check</TabsTrigger>
            <TabsTrigger value="chat">Chat Support</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* Content */}
      {tab === "dashboard" && <Dashboard />}
      {tab === "mood" && <MoodCheck />}
      {tab === "chat" && <ChatSupport />}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Neurox</h2>
          <p className="text-gray-600">
            Your personal mental health companion. We’re here to support you with
            mood tracking, personalized insights, and 24/7 chat support.
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500">Current Mood</p>
            <p className="text-yellow-500 text-lg">🙂</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500">Weekly Progress</p>
            <p className="text-green-600 font-bold text-lg">+12%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500">Check-ins</p>
            <p className="text-blue-600 font-bold text-lg">7</p>
          </CardContent>
        </Card>
      </div>

      {/* Wellness Tips */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Daily Wellness Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-blue-100 p-3 rounded-xl">Take 5 deep breaths when feeling overwhelmed</div>
            <div className="bg-blue-100 p-3 rounded-xl">Write down 3 things you’re thankful for</div>
            <div className="bg-blue-100 p-3 rounded-xl">Take a 10-minute walk in nature</div>
            <div className="bg-blue-100 p-3 rounded-xl">Practice mindfulness for 5 minutes</div>
          </div>
        </CardContent>
      </Card>

      {/* Crisis Resources */}
      <Card className="bg-red-50 border border-red-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-red-600 mb-2">Crisis Resources</h3>
          <p className="text-sm mb-3">
            If you’re experiencing a mental health crisis, please reach out immediately:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border">Crisis Text Line: Text HOME to 741741</div>
            <div className="bg-white p-3 rounded-xl border">National Suicide Prevention Lifeline: 988</div>
            <div className="bg-white p-3 rounded-xl border">SAMHSA Helpline: 1-800-662-4357</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MoodCheck() {
  const [streaming, setStreaming] = useState(false);
  const [mood, setMood] = useState(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);

        // Simulate mood analysis after 3 seconds
        setTimeout(() => {
          const moods = ["Happy 😊", "Neutral 😐", "Sad 😢", "Stressed 😟", "Relaxed 😌"];
          const randomMood = moods[Math.floor(Math.random() * moods.length)];
          setMood(randomMood);
        }, 3000);
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-semibold">Mood Detection</h2>
          <p className="text-gray-600 mb-4">
            Use our AI-powered mood detection to understand your current emotional state.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 h-64 flex items-center justify-center rounded-xl">
              {!streaming ? (
                <Button onClick={startCamera}>Start Camera</Button>
              ) : (
                <video ref={videoRef} autoPlay playsInline className="rounded-xl w-full h-full object-cover" />
              )}
            </div>
            <div className="bg-gray-100 h-64 flex items-center justify-center rounded-xl">
              {mood ? <p className="text-lg font-semibold">Detected Mood: {mood}</p> : <p>Analysis Results will appear here...</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="bg-yellow-50 p-4 rounded-xl text-sm">
        <strong>Privacy & Security:</strong> Your video feed is processed locally and never stored.
      </div>
    </div>
  );
}

function ChatSupport() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">Neurox Support Chat</h2>
          <div className="bg-gray-100 p-3 rounded-xl mb-3">
            <p className="text-sm">Hello! I’m your Neurox assistant. How are you feeling today?</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              "I’m feeling anxious",
              "I’m having trouble sleeping",
              "I feel overwhelmed",
              "I’m feeling lonely",
              "I need motivation",
              "I’m stressed about work",
            ].map((text) => (
              <Button key={text} variant="outline" size="sm">{text}</Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Type your message here..." />
            <Button>Send</Button>
          </div>
        </CardContent>
      </Card>
      <div className="bg-yellow-50 p-4 rounded-xl text-sm">
        <strong>Important Notice:</strong> I’m not a replacement for professional therapy. In case of emergency, call 100 or reach out to crisis lines.
      </div>
    </div>
  );
}
