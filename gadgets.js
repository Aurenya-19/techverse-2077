<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Pages Site</title>
</head>
<body>
// TechVerse 2077 - Extended Gadgets Library
// PCR Machine, Centrifuge, pH Meter, and 7 more advanced lab equipment

console.log('%c📦 Loading Extended Gadgets...', 'color: #f39c12; font-size: 14px;');

// PCR MACHINE - COMPLETE THERMAL CYCLING
window.showPcr = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🧪 PCR MACHINE</h2>
    <p class="subtitle">Model: Bio-Rad T100 • Thermal Cycler for DNA amplification</p>
    
    <div class="section">
      <h3>📋 Instructions</h3>
      <p>PCR (Polymerase Chain Reaction) amplifies DNA through repeated thermal cycling:<br>
      1. Denaturation (94-96°C) - Separate DNA strands<br>
      2. Annealing (50-65°C) - Primers bind<br>
      3. Extension (72°C) - DNA synthesis</p>
    </div>
    
    <div class="section">
      <h3>PCR Configuration</h3>
      <div class="controlPanel">
        <div class="control">
          <label>Denaturation Temp (°C)</label>
          <input type="number" id="denatTemp" value="95" min="94" max="98">
        </div>
        <div class="control">
          <label>Denaturation Time (sec)</label>
          <input type="number" id="denatTime" value="30" min="15" max="60">
        </div>
        <div class="control">
          <label>Annealing Temp (°C)</label>
          <input type="number" id="annealTemp" value="55" min="50" max="65">
        </div>
        <div class="control">
          <label>Annealing Time (sec)</label>
          <input type="number" id="annealTime" value="30" min="15" max="60">
        </div>
        <div class="control">
          <label>Extension Temp (°C)</label>
          <input type="number" id="extTemp" value="72" min="68" max="75">
        </div>
        <div class="control">
          <label>Extension Time (sec)</label>
          <input type="number" id="extTime" value="60" min="30" max="120">
        </div>
        <div class="control">
          <label>Number of Cycles</label>
          <select id="cycles">
            <option value="20">20 cycles</option>
            <option value="25">25 cycles</option>
            <option value="30" selected>30 cycles</option>
            <option value="35">35 cycles</option>
            <option value="40">40 cycles</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="btnGroup">
      <button class="actionBtn success" onclick="startPCR()">▶ START PCR</button>
    </div>
  `;
};

window.startPCR = function() {
  const cycles = parseInt(document.getElementById('cycles').value);
  const denatTemp = parseInt(document.getElementById('denatTemp').value);
  const annealTemp = parseInt(document.getElementById('annealTemp').value);
  const extTemp = parseInt(document.getElementById('extTemp').value);
  
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🧪 PCR MACHINE</h2>
    <p class="subtitle">Running PCR - ${cycles} cycles</p>
    
    <div class="section">
      <h3>Thermal Cycling</h3>
      <canvas class="display" id="pcrCanvas" width="800" height="400"></canvas>
    </div>
    
    <div class="display" id="pcrStatus">Initializing...
Heating block to ${denatTemp}°C...</div>
    
    <div class="progress"><div class="progressBar" id="pcrProgress">0%</div></div>
  `;
  
  const canvas = document.getElementById('pcrCanvas');
  const ctx = canvas.getContext('2d');
  
  let currentCycle = 0;
  let progress = 0;
  let stage = 'denaturation';
  let currentTemp = 25;
  let targetTemp = denatTemp;
  
  const interval = setInterval(() => {
    progress += 1;
    const cycleProgress = (progress / 100) * cycles;
    currentCycle = Math.floor(cycleProgress);
    
    // Determine stage
    const stageInCycle = (cycleProgress - currentCycle) * 3;
    if (stageInCycle < 1) {
      stage = 'denaturation';
      targetTemp = denatTemp;
    } else if (stageInCycle < 2) {
      stage = 'annealing';
      targetTemp = annealTemp;
    } else {
      stage = 'extension';
      targetTemp = extTemp;
    }
    
    currentTemp += (targetTemp - currentTemp) * 0.1;
    
    document.getElementById('pcrProgress').style.width = progress + '%';
    document.getElementById('pcrProgress').textContent = progress + '%';
    
    document.getElementById('pcrStatus').textContent = `Cycle: ${currentCycle + 1}/${cycles}
Stage: ${stage.toUpperCase()}
Current Temp: ${currentTemp.toFixed(1)}°C
Target Temp: ${targetTemp}°C
Progress: ${progress}%`;
    
    // Draw graph
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 800, 400);
    
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#0f0';
    
    // Axes
    ctx.beginPath();
    ctx.moveTo(50, 350);
    ctx.lineTo(750, 350);
    ctx.moveTo(50, 350);
    ctx.lineTo(50, 50);
    ctx.stroke();
    
    ctx.fillText('Time', 400, 380);
    ctx.save();
    ctx.translate(20, 200);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('Temperature (°C)', 0, 0);
    ctx.restore();
    
    // Draw temperature curve
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = 0; x <= progress * 7; x++) {
      const cyclePos = (x / 700) * cycles;
      const cycleNum = Math.floor(cyclePos);
      const posInCycle = (cyclePos - cycleNum) * 3;
      
      let temp;
      if (posInCycle < 1) {
        temp = denatTemp;
      } else if (posInCycle < 2) {
        temp = annealTemp;
      } else {
        temp = extTemp;
      }
      
      const y = 350 - ((temp - 20) / 80) * 300;
      
      if (x === 0) {
        ctx.moveTo(50 + x, y);
      } else {
        ctx.lineTo(50 + x, y);
      }
    }
    
    ctx.stroke();
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(completePCR, 1000);
    }
  }, 50);
};

function completePCR() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🧪 PCR MACHINE</h2>
    <p class="subtitle">PCR Complete!</p>
    
    <div class="section">
      <h3>✓ Amplification Successful</h3>
      <div class="display">PCR Run Summary:
Total Cycles: ${document.getElementById('cycles').value}
Status: COMPLETE
Amplification: ${Math.floor(Math.pow(2, parseInt(document.getElementById('cycles').value)))} fold

DNA concentration increased from:
Initial: 0.5 ng/μL
Final: ${(0.5 * Math.pow(2, parseInt(document.getElementById('cycles').value) / 10)).toFixed(2)} ng/μL

Ready for gel electrophoresis or sequencing.</div>
    </div>
    
    <div class="btnGroup">
      <button class="actionBtn success" onclick="completePCRGadget()">✓ COMPLETE</button>
    </div>
  `;
}

window.completePCRGadget = function() {
  let xp = 400;
  if (state.bonus === 'bio') xp *= 1.5;
  if (state.currentFloor === 1) xp *= 1.2;
  xp = Math.floor(xp);
  
  state.xp += xp;
  updateHUD();
  notify(`🧪 PCR complete! +${xp} XP`);
  closeGadget();
};

// CENTRIFUGE - RPM CONTROL & SEPARATION
window.showCentrifuge = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🌀 CENTRIFUGE</h2>
    <p class="subtitle">Model: Eppendorf 5424R • Refrigerated microcentrifuge</p>
    
    <div class="section">
      <h3>📋 Instructions</h3>
      <p>Centrifuge separates samples by density using centrifugal force.<br>
      1. Load sample tubes<br>
      2. Balance rotor<br>
      3. Set speed (RPM)<br>
      4. Set time<br>
      5. Start centrifugation</p>
    </div>
    
    <div class="section">
      <h3>Configuration</h3>
      <div class="controlPanel">
        <div class="control">
          <label>Speed (RPM): <span id="rpmVal">5000</span></label>
          <input type="range" min="1000" max="15000" value="5000" step="500" id="rpmSlider" oninput="updateRPM(this.value)">
        </div>
        <div class="control">
          <label>Time (minutes)</label>
          <select id="centTime">
            <option value="1">1 minute</option>
            <option value="5" selected>5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
          </select>
        </div>
        <div class="control">
          <label>Temperature (°C)</label>
          <select id="centTemp">
            <option value="4">4°C (Refrigerated)</option>
            <option value="20" selected>20°C (Room temp)</option>
          </select>
        </div>
        <div class="control">
          <label>Number of Tubes</label>
          <select id="tubeCount">
            <option value="2">2 tubes</option>
            <option value="4">4 tubes</option>
            <option value="6" selected>6 tubes</option>
            <option value="8">8 tubes</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="display" id="centStatus">CENTRIFUGE READY
Load tubes and configure settings...</div>
    
    <div class="btnGroup">
      <button class="actionBtn" onclick="checkBalance()">⚖️ CHECK BALANCE</button>
      <button class="actionBtn success" onclick="startCentrifuge()">▶ START</button>
    </div>
  `;
};

window.updateRPM = function(val) {
  document.getElementById('rpmVal').textContent = val;
  const rcf = Math.floor((val * val * 1.12) / 1000000);
  document.getElementById('centStatus').textContent = `Speed: ${val} RPM
Relative Centrifugal Force: ${rcf} × g
Configure settings and check balance before starting.`;
};

window.checkBalance = function() {
  const tubes = parseInt(document.getElementById('tubeCount').value);
  const balanced = tubes % 2 === 0;
  
  if (balanced) {
    notify('✓ Rotor balanced correctly!');
    document.getElementById('centStatus').textContent = `✓ BALANCE CHECK PASSED
${tubes} tubes loaded symmetrically
Safe to start centrifugation`;
  } else {
    notify('⚠️ Warning: Unbalanced rotor!');
    document.getElementById('centStatus').textContent = `⚠️ BALANCE CHECK FAILED
${tubes} tubes - asymmetric loading
Add balancing tube before starting`;
  }
};

window.startCentrifuge = function() {
  const rpm = parseInt(document.getElementById('rpmSlider').value);
  const time = parseInt(document.getElementById('centTime').value);
  
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🌀 CENTRIFUGE</h2>
    <p class="subtitle">Centrifugation in progress - ${rpm} RPM</p>
    
    <div class="section">
      <h3>Centrifuge Animation</h3>
      <canvas class="display" id="centCanvas" width="600" height="600"></canvas>
    </div>
    
    <div class="display" id="centRunStatus">Accelerating to ${rpm} RPM...</div>
    
    <div class="progress"><div class="progressBar" id="centProgress">0%</div></div>
  `;
  
  const canvas = document.getElementById('centCanvas');
  const ctx = canvas.getContext('2d');
  
  let progress = 0;
  let rotation = 0;
  let currentRPM = 0;
  
  const interval = setInterval(() => {
    progress += 2;
    
    if (progress < 20) {
      currentRPM += rpm / 10;
    } else if (progress > 80) {
      currentRPM -= rpm / 10;
    } else {
      currentRPM = rpm;
    }
    
    rotation += currentRPM / 100;
    
    document.getElementById('centProgress').style.width = progress + '%';
    document.getElementById('centProgress').textContent = progress + '%';
    
    document.getElementById('centRunStatus').textContent = `Current Speed: ${Math.floor(currentRPM)} RPM
Time Elapsed: ${Math.floor((progress / 100) * time)} / ${time} min
Status: ${progress < 20 ? 'ACCELERATING' : progress > 80 ? 'DECELERATING' : 'RUNNING'}`;
    
    // Draw spinning rotor
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 600, 600);
    
    ctx.save();
    ctx.translate(300, 300);
    ctx.rotate(rotation);
    
    // Rotor
    ctx.fillStyle = '#7f8c8d';
    ctx.beginPath();
    ctx.arc(0, 0, 200, 0, Math.PI * 2);
    ctx.fill();
    
    // Tubes
    const tubes = parseInt(document.getElementById('tubeCount').value);
    ctx.fillStyle = '#3498db';
    for (let i = 0; i < tubes; i++) {
      const angle = (i / tubes) * Math.PI * 2;
      const x = Math.cos(angle) * 150;
      const y = Math.sin(angle) * 150;
      ctx.fillRect(x - 10, y - 20, 20, 40);
    }
    
    ctx.restore();
    
    // Center
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(300, 300, 30, 0, Math.PI * 2);
    ctx.fill();
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(completeCentrifuge, 1000);
    }
  }, 100);
};

function completeCentrifuge() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🌀 CENTRIFUGE</h2>
    <p class="subtitle">Centrifugation Complete!</p>
    
    <div class="section">
      <h3>✓ Separation Successful</h3>
      <div class="display">Centrifugation Summary:
Speed: ${document.getElementById('rpmSlider').value} RPM
Time: ${document.getElementById('centTime').value} minutes
Temperature: ${document.getElementById('centTemp').value}°C

Sample separated into layers:
- Supernatant (top)
- Intermediate layer
- Pellet (bottom)

Rotor stopped. Safe to open lid.</div>
    </div>
    
    <div class="btnGroup">
      <button class="actionBtn success" onclick="completeCentGadget()">✓ REMOVE SAMPLES</button>
    </div>
  `;
}

window.completeCentGadget = function() {
  let xp = 350;
  if (state.bonus === 'bio') xp *= 1.5;
  if (state.currentFloor === 2) xp *= 1.5;
  xp = Math.floor(xp);
  
  state.xp += xp;
  updateHUD();
  notify(`🌀 Centrifugation complete! +${xp} XP`);
  closeGadget();
};

// pH METER - CALIBRATION & MEASUREMENT
window.showPh = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>📏 pH METER</h2>
    <p class="subtitle">Model: Mettler Toledo SevenCompact • Digital pH meter</p>
    
    <div class="section">
      <h3>📋 Instructions</h3>
      <p>pH meter measures acidity/alkalinity on a scale of 0-14.<br>
      1. Calibrate with standard buffers (pH 4, 7, 10)<br>
      2. Rinse electrode<br>
      3. Measure sample<br>
      4. Record data</p>
    </div>
    
    <div class="section">
      <h3>Calibration</h3>
      <div class="optionGrid">
        <div class="option" onclick="calibratepH(4)">📊 pH 4.0<br><small>Acidic buffer</small></div>
        <div class="option" onclick="calibratepH(7)">📊 pH 7.0<br><small>Neutral buffer</small></div>
        <div class="option" onclick="calibratepH(10)">📊 pH 10.0<br><small>Basic buffer</small></div>
      </div>
    </div>
    
    <div class="display" id="phDisplay">pH METER v2.5
Calibration required
Insert electrode in pH 7.0 buffer first...</div>
  `;
  
  state.gadgetData.phCalibrated = [];
};

window.calibratepH = function(ph) {
  if (!state.gadgetData.phCalibrated) state.gadgetData.phCalibrated = [];
  
  if (!state.gadgetData.phCalibrated.includes(ph)) {
    state.gadgetData.phCalibrated.push(ph);
    notify(`✓ Calibrated at pH ${ph}.0`);
  }
  
  const display = document.getElementById('phDisplay');
  display.textContent = `Calibration Progress:
${state.gadgetData.phCalibrated.includes(4) ? '✓' : '○'} pH 4.0 (Acidic)
${state.gadgetData.phCalibrated.includes(7) ? '✓' : '○'} pH 7.0 (Neutral)
${state.gadgetData.phCalibrated.includes(10) ? '✓' : '○'} pH 10.0 (Basic)

${state.gadgetData.phCalibrated.length >= 2 ? 'Calibration sufficient! Ready to measure.' : 'Calibrate at least 2 points.'}`;
  
  if (state.gadgetData.phCalibrated.length >= 2) {
    const container = document.getElementById('gadgetContainer');
    container.innerHTML += `
      <div class="btnGroup" style="margin-top: 20px;">
        <button class="actionBtn success" onclick="measurepH()">📊 MEASURE SAMPLE</button>
      </div>
    `;
  }
};

window.measurepH = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>📏 pH METER</h2>
    <p class="subtitle">Measuring sample pH...</p>
    
    <div class="section">
      <h3>Measurement</h3>
      <canvas class="display" id="phCanvas" width="600" height="400"></canvas>
    </div>
    
    <div class="display" id="phResult">Stabilizing reading...</div>
    
    <div class="btnGroup">
      <button class="actionBtn" onclick="logpHData()">📝 LOG DATA</button>
      <button class="actionBtn success" onclick="completepH()">✓ COMPLETE</button>
    </div>
  `;
  
  const canvas = document.getElementById('phCanvas');
  const ctx = canvas.getContext('2d');
  
  const targetpH = (Math.random() * 10 + 2).toFixed(2);
  let currentpH = 7;
  let readings = [];
  
  const interval = setInterval(() => {
    currentpH += (targetpH - currentpH) * 0.1 + (Math.random() - 0.5) * 0.1;
    readings.push(currentpH);
    
    if (readings.length > 50) readings.shift();
    
    // Draw graph
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 600, 400);
    
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#0f0';
    
    // Axes
    ctx.beginPath();
    ctx.moveTo(50, 350);
    ctx.lineTo(550, 350);
    ctx.moveTo(50, 350);
    ctx.lineTo(50, 50);
    ctx.stroke();
    
    ctx.fillText('Time', 300, 380);
    ctx.fillText('pH', 20, 200);
    
    // pH scale
    for (let i = 0; i <= 14; i += 2) {
      const y = 350 - (i / 14) * 300;
      ctx.fillText(i.toString(), 25, y + 5);
    }
    
    // Draw readings
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    readings.forEach((ph, i) => {
      const x = 50 + (i / 50) * 500;
      const y = 350 - (ph / 14) * 300;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Current value
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`pH: ${currentpH.toFixed(2)}`, 450, 100);
    
    document.getElementById('phResult').textContent = `Current pH: ${currentpH.toFixed(2)}
Temperature: 25.0°C
Status: ${Math.abs(currentpH - targetpH) < 0.1 ? 'STABLE' : 'STABILIZING'}
Sample: ${currentpH < 7 ? 'ACIDIC' : currentpH > 7 ? 'BASIC' : 'NEUTRAL'}`;
    
    if (readings.length >= 30 && Math.abs(currentpH - targetpH) < 0.05) {
      clearInterval(interval);
    }
  }, 100);
};

window.logpHData = function() {
  notify('📝 pH data logged to memory!');
  state.xp += 50;
  updateHUD();
};

window.completepH = function() {
  let xp = 250;
  if (state.bonus === 'bio') xp *= 1.5;
  xp = Math.floor(xp);
  
  state.xp += xp;
  updateHUD();
  notify(`📏 pH measurement complete! +${xp} XP`);
  closeGadget();
};

console.log('%c✓ PCR Machine, Centrifuge, pH Meter loaded!', 'color: #27ae60; font-size: 14px; font-weight: bold;');
</body>
</html>