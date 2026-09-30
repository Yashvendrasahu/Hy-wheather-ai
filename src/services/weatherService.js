// src/services/weatherService.js
import axios from 'axios';
import { generateSyntheticPhysicsInference } from './moesWeatherApi.js';

const BACKEND_URL = 'https://moes-weather-backend.onrender.com/predict';

/**
 * Calls live deployed FastAPI Machine Learning backend on Render.
 * Fallback to physics-based local inference if Render free-tier is in cold start.
 */
export const getWeatherData = async (payload) => {
  try {
    const res = await axios.post(BACKEND_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 25000 // allows for Render free-tier cold starts
    });
    return res.data;
  } catch (err) {
    console.error('API Error, falling back to local simulation:', err?.message || err);
    // Provide high-fidelity physical formula simulation so the user is never blocked
    return generateSyntheticPhysicsInference(payload);
  }
};

export default getWeatherData;
