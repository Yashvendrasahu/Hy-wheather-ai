// src/components/map/InteractiveRadarCanvas.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useWeather } from '../../context/WeatherContext.jsx';
import { REGIONAL_RADAR_POINTS } from '../../data/weatherData.js';
import { MapPin, Navigation, ZoomIn, ZoomOut, Maximize2, Wind, Eye } from 'lucide-react';

export default function InteractiveRadarCanvas({ isCompact = false, height = 460 }) {
  const canvasRef = useRef(null);
  const {
    mapLayer,
    selectedMapPoint,
    setSelectedMapPoint,
    radarPlaying,
    radarTimeStep,
    formatTemp
  } = useWeather();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Doppler sweep animation angle & particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let sweepAngle = 0;
    let stepOffset = (radarTimeStep - 2) * 25; // drift based on time scrubber

    // Wind particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      speed: 0.8 + Math.random() * 1.5,
      length: 8 + Math.random() * 12,
      opacity: 0.2 + Math.random() * 0.5
    }));

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2 + panOffset.x;
      const centerY = height / 2 + panOffset.y;

      ctx.clearRect(0, 0, width, height);

      // 1. Geographic Background (Map styling: soft beige-gray landmass with subtle road/district lines)
      ctx.fillStyle = '#F4F6F8';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle terrain grid lines
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      const gridSize = 60 * zoomLevel;
      for (let x = (centerX % gridSize); x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = (centerY % gridSize); y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw highway/transit curves
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5 * zoomLevel;
      ctx.setLineDash([4, 4]);
      
      // Highway: Dhar -> Pithampur -> Indore -> Dewas -> Bhopal
      ctx.beginPath();
      ctx.moveTo(centerX - 180 * zoomLevel, centerY + 80 * zoomLevel);
      ctx.quadraticCurveTo(centerX - 60 * zoomLevel, centerY + 60 * zoomLevel, centerX, centerY);
      ctx.quadraticCurveTo(centerX + 80 * zoomLevel, centerY - 40 * zoomLevel, centerX + 160 * zoomLevel, centerY - 60 * zoomLevel);
      ctx.stroke();

      // Highway: Indore -> Ujjain
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX - 30 * zoomLevel, centerY - 130 * zoomLevel);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Concentric Radar Distance Rings
      const ringRadii = [60, 120, 180, 240];
      ctx.lineWidth = 1;
      ringRadii.forEach((r, idx) => {
        ctx.strokeStyle = idx === 1 ? 'rgba(217, 119, 6, 0.45)' : 'rgba(148, 163, 184, 0.35)';
        if (idx === 1) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([2, 4]);
        }
        ctx.beginPath();
        ctx.arc(centerX, centerY, r * zoomLevel, 0, Math.PI * 2);
        ctx.stroke();

        // Distance label
        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`${(idx + 1) * 25} km`, centerX + 8, centerY - r * zoomLevel + 12);
      });
      ctx.setLineDash([]);

      // 3. Render Weather Layers according to mapLayer
      if (mapLayer === 'rain') {
        // Render convective Doppler precipitation storm cells
        // Cell 1: Heavy convective storm over Dhar - Pithampur tracking ENE toward Indore
        const cellX = centerX - (120 - stepOffset) * zoomLevel;
        const cellY = centerY + (50 - stepOffset * 0.3) * zoomLevel;
        const cellRadius = (90 + Math.sin(Date.now() / 800) * 4) * zoomLevel;

        const rainGrad = ctx.createRadialGradient(cellX, cellY, 10 * zoomLevel, cellX, cellY, cellRadius);
        rainGrad.addColorStop(0, 'rgba(225, 29, 72, 0.85)'); // Heavy Red core
        rainGrad.addColorStop(0.3, 'rgba(249, 115, 22, 0.75)'); // Orange
        rainGrad.addColorStop(0.55, 'rgba(234, 179, 8, 0.6)'); // Yellow
        rainGrad.addColorStop(0.8, 'rgba(34, 197, 94, 0.4)'); // Green
        rainGrad.addColorStop(1, 'rgba(56, 189, 248, 0)'); // Cyan fade

        ctx.fillStyle = rainGrad;
        ctx.beginPath();
        ctx.arc(cellX, cellY, cellRadius, 0, Math.PI * 2);
        ctx.fill();

        // Secondary cell near Dewas / Ujjain fringe
        const cell2X = centerX + (60 + stepOffset * 0.8) * zoomLevel;
        const cell2Y = centerY - (40 + stepOffset * 0.2) * zoomLevel;
        const rainGrad2 = ctx.createRadialGradient(cell2X, cell2Y, 5, cell2X, cell2Y, 65 * zoomLevel);
        rainGrad2.addColorStop(0, 'rgba(234, 179, 8, 0.7)');
        rainGrad2.addColorStop(0.5, 'rgba(34, 197, 94, 0.45)');
        rainGrad2.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = rainGrad2;
        ctx.beginPath();
        ctx.arc(cell2X, cell2Y, 65 * zoomLevel, 0, Math.PI * 2);
        ctx.fill();

      } else if (mapLayer === 'temp') {
        // Temperature Thermal Gradient Layer
        const tempGrad = ctx.createLinearGradient(centerX - 250, centerY + 250, centerX + 250, centerY - 250);
        tempGrad.addColorStop(0, 'rgba(244, 63, 94, 0.35)'); // Hot ~36°C
        tempGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.3)'); // 31°C
        tempGrad.addColorStop(0.7, 'rgba(234, 179, 8, 0.25)'); // 28°C
        tempGrad.addColorStop(1, 'rgba(14, 165, 233, 0.3)'); // 24°C

        ctx.fillStyle = tempGrad;
        ctx.fillRect(0, 0, width, height);

      } else if (mapLayer === 'wind') {
        // Wind particles vector animation
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.7)';
        ctx.lineWidth = 1.5;
        particles.forEach(p => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          // Angle WNW to ESE
          const endX = p.x + Math.cos(0.35) * p.length;
          const endY = p.y + Math.sin(0.35) * p.length;
          ctx.lineTo(endX, endY);
          ctx.stroke();

          if (radarPlaying) {
            p.x += Math.cos(0.35) * p.speed * 1.5;
            p.y += Math.sin(0.35) * p.speed * 1.5;
            if (p.x > width + 20) p.x = -20;
            if (p.y > height + 20) p.y = -20;
          }
        });

      } else if (mapLayer === 'clouds') {
        // Satellite Infrared Cloud Mask
        const cloudGrad = ctx.createRadialGradient(centerX - 40, centerY + 20, 30, centerX - 40, centerY + 20, 260 * zoomLevel);
        cloudGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        cloudGrad.addColorStop(0.5, 'rgba(241, 245, 249, 0.65)');
        cloudGrad.addColorStop(0.85, 'rgba(203, 213, 225, 0.3)');
        cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = cloudGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 4. Rotating Doppler Radar Sweep Beam
      if (radarPlaying) {
        sweepAngle += 0.025;
      }
      const sweepGrad = ctx.createConicGradient(sweepAngle, centerX, centerY);
      sweepGrad.addColorStop(0, 'rgba(2, 132, 199, 0.28)');
      sweepGrad.addColorStop(0.12, 'rgba(2, 132, 199, 0.05)');
      sweepGrad.addColorStop(0.2, 'transparent');
      sweepGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 240 * zoomLevel, 0, Math.PI * 2);
      ctx.fill();

      // Sweep frontier line
      const sweepLineX = centerX + Math.cos(sweepAngle) * 240 * zoomLevel;
      const sweepLineY = centerY + Math.sin(sweepAngle) * 240 * zoomLevel;
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sweepLineX, sweepLineY);
      ctx.stroke();

      // Center Station Marker (Indore radar origin)
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Warning Zone Label on map
      ctx.fillStyle = '#78350F';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('⚡ Thunderstorm Advisory Corridor', centerX + 40 * zoomLevel, centerY - 95 * zoomLevel);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mapLayer, zoomLevel, panOffset, radarPlaying, radarTimeStep]);

  // Handle map interaction
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 shadow-sm select-none">
      <canvas
        ref={canvasRef}
        width={860}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Interactive Regional Location Pins overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {REGIONAL_RADAR_POINTS.map((pt) => {
          const isSelected = selectedMapPoint?.id === pt.id;
          return (
            <div
              key={pt.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMapPoint(pt);
              }}
              onMouseEnter={() => setHoveredPoint(pt.id)}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{
                left: `${pt.xPercent}%`,
                top: `${pt.yPercent}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute pointer-events-auto cursor-pointer group"
            >
              {/* Radar pulse ring for selected pin */}
              {isSelected && (
                <span className="absolute -inset-2.5 rounded-full bg-sky-500/25 animate-ping" />
              )}

              {/* Pin Pill */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md transition-all duration-200 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-700 ring-2 ring-sky-400 scale-105'
                    : pt.isCurrent
                    ? 'bg-sky-600 text-white border-sky-400'
                    : 'bg-white/95 text-slate-800 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {pt.isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                )}
                <span>{pt.name}</span>
                <span className={`font-mono tabular-nums ${isSelected ? 'text-sky-300' : 'text-slate-600'}`}>
                  {formatTemp(pt.temp)}
                </span>
                {pt.rainProb > 40 && (
                  <span className="text-[10px] text-amber-500 font-bold">
                    • {pt.rainProb}%
                  </span>
                )}
              </div>

              {/* Hover tooltip for quick preview */}
              {hoveredPoint === pt.id && !isSelected && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 bg-slate-900 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {pt.status} • {pt.windVector}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Canvas Controls (Zoom / Recenter) */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-1.5 z-10 bg-white/90 backdrop-blur-sm p-1 rounded-xl shadow-md border border-slate-200">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.2))}
          aria-label="Zoom In"
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
          aria-label="Zoom Out"
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          aria-label="Reset View to GPS"
          className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
          title="Recenter Map"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
