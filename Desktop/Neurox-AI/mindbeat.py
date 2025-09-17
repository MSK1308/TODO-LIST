import os
import sys
import time
import traceback
from typing import Tuple, Optional

import cv2
import numpy as np
import requests
import sounddevice as sd

from deepface import DeepFace
import tensorflow as tf
from chatBot import chat_with_ai
import threading

# --------------------
# CONFIG
# --------------------
# 10 km
# Fallback coordinates (e.g., Delhi, India) in case location lookup fails
FALLBACK_LAT = 28.6139  
FALLBACK_LON = 77.2090


SAMPLE_RATE = 44100  # Hz
DEFAULT_DURATION = 60  # seconds for binaural session

EMOTION_TO_BEAT = {
    "happy": (10.0, 440.0),
    "sad": (6.0, 220.0),
    "angry": (8.0, 440.0),
    "surprise": (7.0, 440.0),
    "fear": (4.0, 220.0),
    "disgust": (6.0, 330.0),
    "neutral": (10.0, 440.0),
}

# --------------------
# Helpers
# --------------------
def find_nearby_doctors_osm(lat, lon, radius=1000):
    """
    Find nearby doctors/therapists using OpenStreetMap Overpass API.
    """
    import requests

    query = f"""
    [out:json];
    (
      node["amenity"="hospital"](around:{radius},{lat},{lon});
      node["amenity"="clinic"](around:{radius},{lat},{lon});
      node["healthcare"="doctor"](around:{radius},{lat},{lon});
      node["healthcare"="therapist"](around:{radius},{lat},{lon});
    );
    out center;
    """

    url = "https://overpass-api.de/api/interpreter"
    try:
        resp = requests.post(url, data={"data": query}, timeout=20)
        data = resp.json()

        results = []
        for element in data.get("elements", []):
            name = element.get("tags", {}).get("name", "Unknown")
            results.append({
                "name": name,
                "lat": element["lat"],
                "lon": element["lon"],
                "maps_link": f"https://www.google.com/maps?q={element['lat']},{element['lon']}"
            })
        return results
    except Exception as e:
        print("Error fetching OSM data:", e)
        return []


    
def get_user_location():
    """
    Get approximate user location using free IP geolocation service.
    Returns dict with city, lat, lon
    """
    try:
        resp = requests.get("https://ipinfo.io/json", timeout=5)
        data = resp.json()
        loc = data.get("loc", "0,0").split(",")
        return {
            "city": data.get("city", "Unknown"),
            "lat": loc[0],
            "lon": loc[1]
        }
    except Exception as e:
        print("⚠️ Could not fetch location:", e)
        return {"city": "Unknown", "lat": "0", "lon": "0"}


# --------------------
# Audio
# --------------------
def generate_binaural(duration_seconds: int, beat_hz: float, carrier_freq: float, sample_rate=SAMPLE_RATE):
    """Generate stereo binaural beat signal"""
    t = np.linspace(0, duration_seconds, int(sample_rate * duration_seconds), endpoint=False)
    fade_len = min(int(0.02 * sample_rate), t.size // 10)
    envelope = np.ones_like(t)
    envelope[:fade_len] = np.linspace(0, 1, fade_len)
    envelope[-fade_len:] = np.linspace(1, 0, fade_len)

    left = np.sin(2.0 * np.pi * carrier_freq * t) * envelope
    right = np.sin(2.0 * np.pi * (carrier_freq + beat_hz) * t) * envelope

    stereo = np.vstack((left, right)).T.astype(np.float32)
    stereo /= np.max(np.abs(stereo)) + 1e-9
    return stereo

def play_audio_stereo(samples: np.ndarray, sample_rate=SAMPLE_RATE):
    """Play stereo numpy array using sounddevice"""
    sd.play(samples, samplerate=sample_rate, blocking=False)

# --------------------
# Emotion detection
# --------------------
def detect_emotion_frame(face_img_bgr):
    """Detect emotion with DeepFace"""
    try:
        rgb = cv2.cvtColor(face_img_bgr, cv2.COLOR_BGR2RGB)
        analysis = DeepFace.analyze(rgb, actions=["emotion"], enforce_detection=False)
        if isinstance(analysis, list) and len(analysis) > 0:
            analysis = analysis[0]
        emotion = analysis.get("dominant_emotion")
        conf = None
        if "emotion" in analysis:
            conf = analysis["emotion"].get(emotion)
        return emotion, conf
    except Exception:
        return None, None

# --------------------
# Main
# --------------------
def main():
    print("Starting MindBeat demo...")

    geo = get_user_location()
    if geo:
        lat, lon = geo["lat"], geo["lon"]
        print(f"Detected location: {lat}, {lon}")
    else:
        lat, lon = FALLBACK_LAT, FALLBACK_LON
        print("Using fallback location.")

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Cannot open webcam.")
        return

    current_emotion, current_conf = "neutral", 0.0
    last_update = 0.0

    print("Controls: g=play binaural, d=find doctors, q=quit")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        now = time.time()
        if now - last_update > 1.2:
            h, w = frame.shape[:2]
            crop = frame[max(0, h//6):min(h, h*5//6), max(0, w//6):min(w, w*5//6)]
            emotion, conf = detect_emotion_frame(crop)
            if emotion:
                if emotion.lower() in EMOTION_TO_BEAT:
                    current_emotion = emotion.lower()
                else:
                    current_emotion = "neutral"
                current_conf = conf or 0.0

                last_update = now

            

        cv2.putText(frame, f"Emotion: {current_emotion} ({current_conf:.1f})",
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        cv2.imshow("MindBeat", frame)

        key = cv2.waitKey(1) & 0xFF
        if key in [ord('q'), 27]:
            break
        elif key == ord('g'):
            beat, carrier = EMOTION_TO_BEAT.get(current_emotion, EMOTION_TO_BEAT["neutral"])
            print(f"Playing binaural: {current_emotion}, {beat}Hz beat, {carrier}Hz carrier")
            samples = generate_binaural(DEFAULT_DURATION, beat, carrier)
            play_audio_stereo(samples)
        elif key == ord('d'):
           try:
              user_loc = get_user_location()
              lat, lon = user_loc["lat"], user_loc["lon"]

              providers = find_nearby_doctors_osm(lat, lon)

              if not providers:
               print("⚠️ No therapists found.")
              else:
               print(f"📍 Location detected: {user_loc['city']} ({lat}, {lon})")
              for i, p in enumerate(providers, 1):
                print(f"{i}. {p['name']} (Lat: {p['lat']}, Lon: {p['lon']})")
                print(f"   🔗 Open in Maps: {p['maps_link']}")
           except Exception as e:
            print("Error:", e)


    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
