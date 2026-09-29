// src/services/synopticService.js
import axios from 'axios';
import { generateSyntheticPhysicsInference } from './moesWeatherApi.js';

const BACKEND_URL = 'https://moes-weather-backend.onrender.com/predict';

/**
 * Dispatch payload and fetch live AI-NWP multi-parameter calibrated predictions.
 * Provides seamless physical formula fallback if the live service is cold starting.
 */
export const fetchSynopticForecast = async (stationPayload) => {
  try {
    const response = await axios.post(BACKEND_URL, stationPayload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 25000 // Accommodate Render cold start
    });
    return response.data;
  } catch (error) {
    console.warn('Live MoES Neural Engine timeout or fallback, executing calibrated physical synthesis:', error?.message || error);
    return generateSyntheticPhysicsInference(stationPayload);
  }
};

export default fetchSynopticForecast;
