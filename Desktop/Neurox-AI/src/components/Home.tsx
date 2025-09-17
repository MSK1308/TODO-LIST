import React from "react";
import "./Home.css";
import Spline from "@splinetool/react-spline";

const Home: React.FC = () => {
  return (
    <>
     <main className="background" style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}>
      <Spline scene="https://prod.spline.design/sHFzlBrLIfI1gm8Q/scene.splinecode" />
    </main>
      {/* Header */}
      <div className="header">
        <div>
          <h1>You're not alone. Neurox AI is here.</h1>
          <p>
            An AI-powered mental health companion, providing a calm and supportive digital space for you.
          </p>
        </div>
      </div>
    </>
  );


};




export default Home;