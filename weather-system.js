<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Pages Site</title>
</head>
<body>
// TechVerse 2077 - Day/Night Cycle & Weather System
console.log('%c🌤️ Loading Day/Night Cycle & Weather System...', 'color: #f39c12; font-size: 14px;');

// Add to global state
if (typeof state !== 'undefined') {
  state.timeOfDay = 0; // 0-24 hours
  state.weather = 'clear'; // clear, rain, fog, storm
  state.weatherParticles = [];
}

// Weather and time controls
function initWeatherSystem() {
  if (!scene) return;
  
  // Add weather toggle button
  const weatherBtn = document.createElement('button');
  weatherBtn.id = 'weatherBtn';
  weatherBtn.className = 'navBtn';
  weatherBtn.textContent = '🌤️ WEATHER';
  weatherBtn.style.cssText = 'position: fixed; top: 100px; right: 15px; z-index: 1000; display: none;';
  weatherBtn.onclick = cycleWeather;
  document.body.appendChild(weatherBtn);
  
  // Add time display
  const timeDisplay = document.createElement('div');
  timeDisplay.id = 'timeDisplay';
  timeDisplay.style.cssText = 'position: fixed; top: 150px; right: 15px; background: rgba(0,0,0,0.9); padding: 15px 25px; border-radius: 12px; border: 3px solid #f39c12; z-index: 1000; display: none; color: #f39c12; font-size: 1.2em; font-weight: bold;';
  document.body.appendChild(timeDisplay);
  
  console.log('✓ Weather system initialized');
}

function cycleWeather() {
  const weathers = ['clear', 'rain', 'fog', 'storm'];
  const currentIndex = weathers.indexOf(state.weather);
  state.weather = weathers[(currentIndex + 1) % weathers.length];
  
  const weatherNames = {
    'clear': '☀️ Clear',
    'rain': '🌧️ Rain',
    'fog': '🌫️ Fog',
    'storm': '⛈️ Storm'
  };
  
  notify(`Weather: ${weatherNames[state.weather]}`);
  updateWeather();
}

function updateDayNightCycle() {
  if (!scene) return;
  
  // Increment time (1 real second = 1 game minute)
  state.timeOfDay += 0.01;
  if (state.timeOfDay >= 24) state.timeOfDay = 0;
  
  const hour = Math.floor(state.timeOfDay);
  const minute = Math.floor((state.timeOfDay - hour) * 60);
  
  // Update time display
  const timeDisplay = document.getElementById('timeDisplay');
  if (timeDisplay && timeDisplay.style.display !== 'none') {
    timeDisplay.textContent = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
  
  // Calculate sky color based on time
  let skyColor, fogColor, sunIntensity;
  
  if (state.timeOfDay >= 6 && state.timeOfDay < 8) {
    // Dawn (6-8)
    const t = (state.timeOfDay - 6) / 2;
    skyColor = lerpColor(0x1a1a2e, 0x87CEEB, t);
    fogColor = lerpColor(0x1a1a2e, 0x87CEEB, t);
    sunIntensity = 0.3 + (t * 0.5);
  } else if (state.timeOfDay >= 8 && state.timeOfDay < 18) {
    // Day (8-18)
    skyColor = 0x87CEEB;
    fogColor = 0x87CEEB;
    sunIntensity = 0.8;
  } else if (state.timeOfDay >= 18 && state.timeOfDay < 20) {
    // Dusk (18-20)
    const t = (state.timeOfDay - 18) / 2;
    skyColor = lerpColor(0x87CEEB, 0xff6b35, t);
    fogColor = lerpColor(0x87CEEB, 0xff6b35, t);
    sunIntensity = 0.8 - (t * 0.5);
  } else if (state.timeOfDay >= 20 || state.timeOfDay < 6) {
    // Night (20-6)
    skyColor = 0x1a1a2e;
    fogColor = 0x1a1a2e;
    sunIntensity = 0.2;
  }
  
  // Apply to scene
  if (scene.background) {
    scene.background.setHex(skyColor);
  }
  
  if (scene.fog) {
    scene.fog.color.setHex(fogColor);
  }
  
  // Update sun/moon
  const sunLight = scene.children.find(child => child.isDirectionalLight);
  if (sunLight) {
    sunLight.intensity = sunIntensity;
    
    // Move sun across sky
    const angle = (state.timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
    sunLight.position.x = Math.cos(angle) * 200;
    sunLight.position.y = Math.sin(angle) * 200 + 100;
    sunLight.position.z = 100;
  }
}

function lerpColor(color1, color2, t) {
  const r1 = (color1 >> 16) & 0xff;
  const g1 = (color1 >> 8) & 0xff;
  const b1 = color1 & 0xff;
  
  const r2 = (color2 >> 16) & 0xff;
  const g2 = (color2 >> 8) & 0xff;
  const b2 = color2 & 0xff;
  
  const r = Math.floor(r1 + (r2 - r1) * t);
  const g = Math.floor(g1 + (g2 - g1) * t);
  const b = Math.floor(b1 + (b2 - b1) * t);
  
  return (r << 16) | (g << 8) | b;
}

function updateWeather() {
  if (!scene) return;
  
  // Clear existing particles
  state.weatherParticles.forEach(p => scene.remove(p));
  state.weatherParticles = [];
  
  if (state.weather === 'rain') {
    createRain();
  } else if (state.weather === 'fog') {
    if (scene.fog) {
      scene.fog.near = 20;
      scene.fog.far = 200;
    }
  } else if (state.weather === 'storm') {
    createRain();
    createLightning();
  } else {
    // Clear weather
    if (scene.fog) {
      scene.fog.near = 100;
      scene.fog.far = 800;
    }
  }
}

function createRain() {
  if (typeof THREE === 'undefined') return;
  
  const rainCount = 1000;
  const rainGeometry = new THREE.BufferGeometry();
  const rainPositions = new Float32Array(rainCount * 3);
  
  for (let i = 0; i < rainCount; i++) {
    rainPositions[i * 3] = (Math.random() - 0.5) * 400;
    rainPositions[i * 3 + 1] = Math.random() * 200;
    rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
  }
  
  rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  
  const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.5,
    transparent: true,
    opacity: 0.6
  });
  
  const rain = new THREE.Points(rainGeometry, rainMaterial);
  rain.userData.isRain = true;
  scene.add(rain);
  state.weatherParticles.push(rain);
}

function createLightning() {
  // Lightning flash effect
  setInterval(() => {
    if (state.weather === 'storm' && Math.random() < 0.05) {
      const sunLight = scene.children.find(child => child.isDirectionalLight);
      if (sunLight) {
        const originalIntensity = sunLight.intensity;
        sunLight.intensity = 2;
        setTimeout(() => {
          sunLight.intensity = originalIntensity;
        }, 100);
      }
    }
  }, 1000);
}

function animateWeather() {
  if (!scene) return;
  
  // Animate rain
  state.weatherParticles.forEach(particle => {
    if (particle.userData.isRain) {
      const positions = particle.geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 2; // Fall speed
        
        if (positions[i + 1] < 0) {
          positions[i + 1] = 200;
        }
      }
      
      particle.geometry.attributes.position.needsUpdate = true;
    }
  });
}

// Integrate with main animation loop
const originalAnimate = window.animate;
if (typeof originalAnimate === 'function') {
  window.animate = function() {
    originalAnimate();
    updateDayNightCycle();
    animateWeather();
  };
}

// Show weather controls when in city
const originalInit3D = window.init3D;
if (typeof originalInit3D === 'function') {
  window.init3D = function() {
    originalInit3D();
    initWeatherSystem();
    
    // Show weather button
    const weatherBtn = document.getElementById('weatherBtn');
    if (weatherBtn) weatherBtn.style.display = 'block';
    
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) timeDisplay.style.display = 'block';
    
    // Start with day time
    state.timeOfDay = 12;
    state.weather = 'clear';
  };
}

// Add keyboard shortcut for weather
document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyT' && !state.insideLab) {
    cycleWeather();
  }
});

console.log('%c✓ Day/Night Cycle & Weather System loaded!', 'color: #f39c12; font-size: 14px; font-weight: bold;');
console.log('%c  Press T to change weather', 'color: #95a5a6; font-size: 12px;');
console.log('%c  Time cycles automatically', 'color: #95a5a6; font-size: 12px;');
</body>
</html>