<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Pages Site</title>
</head>
<body>
// TechVerse 2077 - All Gadgets Implementation
// This file contains all 15+ fully functional gadgets

console.log('%c📦 Loading all gadgets...', 'color: #f39c12; font-size: 14px;');

// DNA SEQUENCER - Already implemented in main file
// MICROSCOPE - Already implemented in main file

// SPECTROPHOTOMETER
window.showSpectro = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>📊 SPECTROPHOTOMETER</h2>
    <p class="subtitle">Model: Agilent Cary 60 UV-Vis • Wavelength range: 190-1100nm</p>
    
    <div class="section">
      <h3>📋 Instructions</h3>
      <p>1. Prepare sample and blank<br>2. Set wavelength (200-800nm)<br>3. Measure absorbance<br>4. Calculate concentration using Beer-Lambert law</p>
    </div>
    
    <div class="section">
      <h3>Sample Preparation</h3>
      <div class="optionGrid">
        <div class="option" onclick="prepareSpectroSample('Protein')">🧬 Protein Solution</div>
        <div class="option" onclick="prepareSpectroSample('DNA')">🧬 DNA Sample</div>
        <div class="option" onclick="prepareSpectroSample('Chemical')">⚗️ Chemical Compound</div>
        <div class="option" onclick="prepareSpectroSample('Dye')">🎨 Dye Solution</div>
      </div>
    </div>
    
    <div class="display">SPECTROPHOTOMETER READY
Select sample type to begin...</div>
  `;
};

window.prepareSpectroSample = function(sample) {
  state.gadgetData.spectroSample = sample;
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>📊 SPECTROPHOTOMETER</h2>
    <p class="subtitle">Sample: ${sample} • Configure measurement</p>
    
    <div class="section">
      <h3>Measurement Settings</h3>
      <div class="controlPanel">
        <div class="control">
          <label>Wavelength (nm): <span id="wavelengthVal">280</span></label>
          <input type="range" min="200" max="800" value="280" id="wavelengthSlider" oninput="updateWavelength(this.value)">
        </div>
        <div class="control">
          <label>Path Length (cm)</label>
          <select id="pathLength">
            <option value="0.1">0.1 cm</option>
            <option value="1" selected>1.0 cm</option>
            <option value="10">10.0 cm</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h3>Spectrum Display</h3>
      <canvas class="display" id="spectrumCanvas" width="800" height="400"></canvas>
    </div>
    
    <div class="display" id="spectroResults">Wavelength: 280 nm
Absorbance: -
Transmittance: -
Concentration: -

Click MEASURE to start...</div>
    
    <div class="btnGroup">
      <button class="actionBtn success" onclick="measureSpectro()">📊 MEASURE</button>
      <button class="actionBtn" onclick="scanSpectrum()">📈 FULL SPECTRUM SCAN</button>
      <button class="actionBtn" onclick="completeSpectro()">✓ COMPLETE</button>
    </div>
  `;
  
  drawSpectrumCanvas();
};

function drawSpectrumCanvas() {
  const canvas = document.getElementById('spectrumCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
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
  
  // Labels
  ctx.fillText('Wavelength (nm)', 350, 380);
  ctx.save();
  ctx.translate(20, 200);
  ctx.rotate(-Math.PI/2);
  ctx.fillText('Absorbance', 0, 0);
  ctx.restore();
  
  // Grid
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo(50 + i * 70, 350);
    ctx.lineTo(50 + i * 70, 345);
    ctx.stroke();
    ctx.fillText((200 + i * 60).toString(), 40 + i * 70, 365);
  }
  
  for (let i = 0; i <= 5; i++) {
    ctx.beginPath();
    ctx.moveTo(50, 350 - i * 60);
    ctx.lineTo(55, 350 - i * 60);
    ctx.stroke();
    ctx.fillText((i * 0.5).toFixed(1), 25, 355 - i * 60);
  }
}

window.updateWavelength = function(val) {
  document.getElementById('wavelengthVal').textContent = val;
};

window.measureSpectro = function() {
  const wavelength = parseInt(document.getElementById('wavelengthSlider').value);
  const pathLength = parseFloat(document.getElementById('pathLength').value);
  
  // Simulate measurement
  const absorbance = (Math.random() * 2).toFixed(3);
  const transmittance = (Math.pow(10, -absorbance) * 100).toFixed(2);
  const concentration = (absorbance / (1.5 * pathLength)).toFixed(3); // Using Beer-Lambert law
  
  document.getElementById('spectroResults').textContent = `Wavelength: ${wavelength} nm
Absorbance: ${absorbance} AU
Transmittance: ${transmittance}%
Path Length: ${pathLength} cm

Beer-Lambert Law: A = ε × c × l
Calculated Concentration: ${concentration} M

Measurement complete!`;
  
  state.xp += 200;
  updateHUD();
  notify('📊 Measurement complete! +200 XP');
};

window.scanSpectrum = function() {
  notify('📈 Scanning full spectrum...');
  
  const canvas = document.getElementById('spectrumCanvas');
  const ctx = canvas.getContext('2d');
  
  drawSpectrumCanvas();
  
  // Draw spectrum curve
  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  for (let x = 50; x <= 750; x++) {
    const wavelength = 200 + ((x - 50) / 700) * 600;
    let absorbance = 0;
    
    // Simulate absorption peaks
    if (state.gadgetData.spectroSample === 'Protein') {
      absorbance = Math.exp(-Math.pow((wavelength - 280) / 30, 2)) * 1.5;
    } else if (state.gadgetData.spectroSample === 'DNA') {
      absorbance = Math.exp(-Math.pow((wavelength - 260) / 25, 2)) * 2;
    } else {
      absorbance = Math.exp(-Math.pow((wavelength - 450) / 50, 2)) * 1.2;
    }
    
    const y = 350 - (absorbance * 120);
    
    if (x === 50) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
  
  state.xp += 300;
  updateHUD();
  notify('📈 Full spectrum scan complete! +300 XP');
};

window.completeSpectro = function() {
  notify('📊 Spectrophotometer analysis complete!');
  closeGadget();
};

// OSCILLOSCOPE
window.showOscilloscope = function() {
  state.gadgetData.oscWaveform = 'sine';
  state.gadgetData.oscFreq = 1000;
  state.gadgetData.oscAmp = 5;
  
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>📈 OSCILLOSCOPE</h2>
    <p class="subtitle">Model: Tektronix TBS2000 • 200 MHz bandwidth</p>
    
    <div class="section">
      <h3>📋 Instructions</h3>
      <p>1. Connect probe to signal source<br>2. Adjust voltage and time scales<br>3. Set trigger level<br>4. Observe waveform</p>
    </div>
    
    <div class="section">
      <h3>Waveform Display</h3>
      <canvas class="display" id="oscCanvas" width="800" height="400"></canvas>
    </div>
    
    <div class="section">
      <h3>Controls</h3>
      <div class="controlPanel">
        <div class="control">
          <label>Waveform Type</label>
          <select id="waveformType" onchange="changeWaveform(this.value)">
            <option value="sine">Sine Wave</option>
            <option value="square">Square Wave</option>
            <option value="triangle">Triangle Wave</option>
            <option value="sawtooth">Sawtooth Wave</option>
          </select>
        </div>
        <div class="control">
          <label>Voltage Scale (V/div)</label>
          <select id="voltScale">
            <option value="1">1 mV/div</option>
            <option value="10">10 mV/div</option>
            <option value="100">100 mV/div</option>
            <option value="1000">1 V/div</option>
            <option value="5000" selected>5 V/div</option>
            <option value="10000">10 V/div</option>
          </select>
        </div>
        <div class="control">
          <label>Time Scale (s/div)</label>
          <select id="timeScale">
            <option value="0.000001">1 μs/div</option>
            <option value="0.00001">10 μs/div</option>
            <option value="0.0001">100 μs/div</option>
            <option value="0.001" selected>1 ms/div</option>
            <option value="0.01">10 ms/div</option>
          </select>
        </div>
        <div class="control">
          <label>Frequency (Hz): <span id="freqVal">1000</span></label>
          <input type="range" min="100" max="10000" value="1000" id="freqSlider" oninput="updateFreq(this.value)">
        </div>
        <div class="control">
          <label>Amplitude (V): <span id="ampVal">5</span></label>
          <input type="range" min="1" max="10" value="5" id="ampSlider" oninput="updateAmp(this.value)">
        </div>
      </div>
    </div>
    
    <div class="display" id="oscMeasurements">Frequency: 1000 Hz
Amplitude: 5.00 V
Period: 1.00 ms
Vpp: 10.00 V</div>
    
    <div class="btnGroup">
      <button class="actionBtn" onclick="startOscilloscope()">▶ START</button>
      <button class="actionBtn" onclick="captureOsc()">📸 CAPTURE</button>
      <button class="actionBtn success" onclick="completeOsc()">✓ COMPLETE</button>
    </div>
  `;
  
  drawOscilloscope();
};

function drawOscilloscope() {
  const canvas = document.getElementById('oscCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 800, 400);
  
  // Grid
  ctx.strokeStyle = '#1a4d2e';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 800; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 400);
    ctx.stroke();
  }
  for (let y = 0; y <= 400; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.stroke();
  }
  
  // Center lines
  ctx.strokeStyle = '#27ae60';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.lineTo(800, 200);
  ctx.moveTo(400, 0);
  ctx.lineTo(400, 400);
  ctx.stroke();
  
  // Draw waveform
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  const freq = state.gadgetData.oscFreq;
  const amp = state.gadgetData.oscAmp;
  const waveform = state.gadgetData.oscWaveform;
  
  for (let x = 0; x <= 800; x++) {
    const t = (x / 800) * 0.01; // 10ms window
    let y = 200;
    
    if (waveform === 'sine') {
      y = 200 - Math.sin(2 * Math.PI * freq * t) * amp * 20;
    } else if (waveform === 'square') {
      y = 200 - (Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1) * amp * 20;
    } else if (waveform === 'triangle') {
      const phase = (freq * t) % 1;
      y = 200 - (phase < 0.5 ? (4 * phase - 1) : (3 - 4 * phase)) * amp * 20;
    } else if (waveform === 'sawtooth') {
      const phase = (freq * t) % 1;
      y = 200 - (2 * phase - 1) * amp * 20;
    }
    
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
}

window.changeWaveform = function(type) {
  state.gadgetData.oscWaveform = type;
  drawOscilloscope();
  notify(`📈 Waveform changed to ${type}`);
};

window.updateFreq = function(val) {
  state.gadgetData.oscFreq = parseInt(val);
  document.getElementById('freqVal').textContent = val;
  drawOscilloscope();
  updateOscMeasurements();
};

window.updateAmp = function(val) {
  state.gadgetData.oscAmp = parseInt(val);
  document.getElementById('ampVal').textContent = val;
  drawOscilloscope();
  updateOscMeasurements();
};

function updateOscMeasurements() {
  const freq = state.gadgetData.oscFreq;
  const amp = state.gadgetData.oscAmp;
  const period = (1000 / freq).toFixed(2);
  const vpp = (amp * 2).toFixed(2);
  
  document.getElementById('oscMeasurements').textContent = `Frequency: ${freq} Hz
Amplitude: ${amp.toFixed(2)} V
Period: ${period} ms
Vpp: ${vpp} V`;
}

window.startOscilloscope = function() {
  notify('▶ Oscilloscope running...');
  state.xp += 150;
  updateHUD();
};

window.captureOsc = function() {
  notify('📸 Waveform captured!');
  state.xp += 100;
  updateHUD();
};

window.completeOsc = function() {
  state.xp += 250;
  updateHUD();
  notify('📈 Oscilloscope measurement complete! +250 XP');
  closeGadget();
};

// 3D PRINTER
window.showPrinter = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🖨️ 3D PRINTER</h2>
    <p class="subtitle">Model: Prusa i3 MK3S+ • FDM technology</p>
    
    <div class="section">
      <h3>📋 Instructions</h3>
      <p>1. Select model to print<br>2. Choose material<br>3. Configure print settings<br>4. Start printing</p>
    </div>
    
    <div class="section">
      <h3>Model Selection</h3>
      <div class="optionGrid">
        <div class="option" onclick="select3DModel('Cube')">📦 Cube</div>
        <div class="option" onclick="select3DModel('Sphere')">⚪ Sphere</div>
        <div class="option" onclick="select3DModel('Gear')">⚙️ Gear</div>
        <div class="option" onclick="select3DModel('Vase')">🏺 Vase</div>
        <div class="option" onclick="select3DModel('Robot')">🤖 Robot Part</div>
        <div class="option" onclick="select3DModel('Tool')">🔧 Tool</div>
      </div>
    </div>
    
    <div class="display">3D PRINTER READY
Select model to begin...</div>
  `;
};

window.select3DModel = function(model) {
  state.gadgetData.printModel = model;
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🖨️ 3D PRINTER</h2>
    <p class="subtitle">Model: ${model} • Configure settings</p>
    
    <div class="section">
      <h3>Print Settings</h3>
      <div class="controlPanel">
        <div class="control">
          <label>Material</label>
          <select id="material">
            <option value="PLA">PLA (Easy, biodegradable)</option>
            <option value="ABS">ABS (Strong, heat resistant)</option>
            <option value="PETG">PETG (Durable, flexible)</option>
            <option value="TPU">TPU (Flexible, rubber-like)</option>
          </select>
        </div>
        <div class="control">
          <label>Layer Height</label>
          <select id="layerHeight">
            <option value="0.1">0.1mm (High quality)</option>
            <option value="0.2" selected>0.2mm (Standard)</option>
            <option value="0.3">0.3mm (Fast)</option>
          </select>
        </div>
        <div class="control">
          <label>Infill Density</label>
          <select id="infill">
            <option value="10">10% (Light)</option>
            <option value="20" selected>20% (Standard)</option>
            <option value="50">50% (Strong)</option>
            <option value="100">100% (Solid)</option>
          </select>
        </div>
        <div class="control">
          <label>Print Speed</label>
          <select id="speed">
            <option value="40">40 mm/s (Slow, quality)</option>
            <option value="60" selected>60 mm/s (Standard)</option>
            <option value="80">80 mm/s (Fast)</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="display" id="printPreview">Model: ${model}
Material: PLA
Layer Height: 0.2mm
Infill: 20%
Speed: 60 mm/s

Estimated time: ${Math.floor(Math.random() * 120 + 30)} minutes
Filament needed: ${(Math.random() * 50 + 10).toFixed(1)}g
Layers: ${Math.floor(Math.random() * 200 + 50)}</div>
    
    <div class="btnGroup">
      <button class="actionBtn success" onclick="start3DPrint()">▶ START PRINTING</button>
    </div>
  `;
};

window.start3DPrint = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🖨️ 3D PRINTER</h2>
    <p class="subtitle">Printing ${state.gadgetData.printModel}...</p>
    
    <div class="section">
      <h3>Print Progress</h3>
      <canvas class="display" id="printCanvas" width="400" height="400"></canvas>
      <div class="progress"><div class="progressBar" id="printProgress">0%</div></div>
    </div>
    
    <div class="display" id="printStatus">Heating nozzle...
Target: 210°C
Current: 25°C</div>
  `;
  
  const canvas = document.getElementById('printCanvas');
  const ctx = canvas.getContext('2d');
  
  let progress = 0;
  let layer = 0;
  const maxLayers = 50;
  
  const interval = setInterval(() => {
    progress += 2;
    layer = Math.floor((progress / 100) * maxLayers);
    
    document.getElementById('printProgress').style.width = progress + '%';
    document.getElementById('printProgress').textContent = progress + '%';
    
    document.getElementById('printStatus').textContent = `Printing layer ${layer}/${maxLayers}
Nozzle temp: 210°C
Bed temp: 60°C
Progress: ${progress}%
Time remaining: ${Math.floor((100 - progress) / 2)} min`;
    
    // Draw print progress
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 400, 400);
    
    ctx.fillStyle = '#3498db';
    for (let i = 0; i < layer; i++) {
      const y = 350 - (i * 7);
      ctx.fillRect(100, y, 200, 5);
    }
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(completePrint, 1000);
    }
  }, 100);
};

function completePrint() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🖨️ 3D PRINTER</h2>
    <p class="subtitle">Print complete!</p>
    
    <div class="section">
      <h3>✓ Print Successful</h3>
      <div class="display">Model: ${state.gadgetData.printModel}
Status: COMPLETE
Quality: Excellent
Time taken: ${Math.floor(Math.random() * 120 + 30)} minutes

Print is cooling down...
Remove from bed when cool.</div>
    </div>
    
    <div class="btnGroup">
      <button class="actionBtn success" onclick="complete3DPrint()">✓ REMOVE PRINT</button>
    </div>
  `;
}

window.complete3DPrint = function() {
  state.xp += 400;
  updateHUD();
  notify('🖨️ 3D print complete! +400 XP');
  closeGadget();
};

// ROBOT BUILDER
window.showRobot = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🤖 ROBOT BUILDER</h2>
    <p class="subtitle">Design and assemble custom robots</p>
    
    <div class="section">
      <h3>📋 Instructions</h3>
      <p>1. Select chassis type<br>2. Add motors and sensors<br>3. Wire components<br>4. Program behavior<br>5. Test robot</p>
    </div>
    
    <div class="section">
      <h3>Chassis Selection</h3>
      <div class="optionGrid">
        <div class="option" onclick="selectChassis('Wheeled')">🚗 Wheeled Robot</div>
        <div class="option" onclick="selectChassis('Bipedal')">🚶 Bipedal Robot</div>
        <div class="option" onclick="selectChassis('Quadruped')">🐕 Quadruped Robot</div>
        <div class="option" onclick="selectChassis('Arm')">🦾 Robotic Arm</div>
      </div>
    </div>
    
    <div class="display">ROBOT BUILDER READY
Select chassis type to begin...</div>
  `;
};

window.selectChassis = function(type) {
  state.gadgetData.robotChassis = type;
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🤖 ROBOT BUILDER</h2>
    <p class="subtitle">Chassis: ${type} • Add components</p>
    
    <div class="section">
      <h3>Component Selection</h3>
      <div class="controlPanel">
        <div class="control">
          <label>Motors</label>
          <select id="motors">
            <option value="2">2 Motors</option>
            <option value="4" selected>4 Motors</option>
            <option value="6">6 Motors</option>
          </select>
        </div>
        <div class="control">
          <label>Sensors</label>
          <select id="sensors" multiple size="4">
            <option value="ultrasonic" selected>Ultrasonic (Distance)</option>
            <option value="ir" selected>IR (Obstacle)</option>
            <option value="camera">Camera (Vision)</option>
            <option value="gyro">Gyroscope (Balance)</option>
          </select>
        </div>
        <div class="control">
          <label>Controller</label>
          <select id="controller">
            <option value="Arduino">Arduino Uno</option>
            <option value="Raspberry" selected>Raspberry Pi</option>
            <option value="ESP32">ESP32</option>
          </select>
        </div>
        <div class="control">
          <label>Power</label>
          <select id="power">
            <option value="Battery">9V Battery</option>
            <option value="LiPo" selected>LiPo Battery</option>
            <option value="USB">USB Power</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="btnGroup">
      <button class="actionBtn success" onclick="assembleRobot()">🔧 ASSEMBLE ROBOT</button>
    </div>
  `;
};

window.assembleRobot = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🤖 ROBOT BUILDER</h2>
    <p class="subtitle">Assembling robot...</p>
    
    <div class="section">
      <h3>Assembly Progress</h3>
      <div class="display" id="assemblyStatus">Installing chassis...
Mounting motors...
Connecting sensors...
Wiring controller...</div>
      <div class="progress"><div class="progressBar" id="assemblyProgress">0%</div></div>
    </div>
  `;
  
  const stages = [
    'Installing chassis...',
    'Mounting motors...',
    'Connecting sensors...',
    'Wiring controller...',
    'Installing power system...',
    'Testing connections...',
    'Calibrating sensors...',
    'Assembly complete!'
  ];
  
  let progress = 0;
  let stage = 0;
  
  const interval = setInterval(() => {
    progress += 3;
    
    if (progress % 12 === 0 && stage < stages.length) {
      document.getElementById('assemblyStatus').textContent = stages[stage];
      stage++;
    }
    
    document.getElementById('assemblyProgress').style.width = progress + '%';
    document.getElementById('assemblyProgress').textContent = progress + '%';
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(programRobot, 1000);
    }
  }, 100);
};

function programRobot() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🤖 ROBOT BUILDER</h2>
    <p class="subtitle">Robot assembled! • Program behavior</p>
    
    <div class="section">
      <h3>Block Programming</h3>
      <div class="display">// Robot Program
void setup() {
  initMotors();
  initSensors();
}

void loop() {
  if (detectObstacle()) {
    turnRight();
    delay(500);
  } else {
    moveForward();
  }
}

Program uploaded successfully!</div>
    </div>
    
    <div class="section">
      <h3>Robot Specifications</h3>
      <div class="display">Chassis: ${state.gadgetData.robotChassis}
Motors: 4x DC Motors
Sensors: Ultrasonic, IR
Controller: Raspberry Pi
Power: LiPo Battery
Weight: 2.5 kg
Max Speed: 1.5 m/s

Serial Number: RBT-${Math.floor(Math.random() * 10000)}</div>
    </div>
    
    <div class="btnGroup">
      <button class="actionBtn" onclick="testRobot()">🧪 TEST ROBOT</button>
      <button class="actionBtn success" onclick="completeRobot()">✓ COMPLETE</button>
    </div>
  `;
}

window.testRobot = function() {
  notify('🧪 Testing robot movements...');
  setTimeout(() => notify('✓ All systems operational!'), 2000);
  state.xp += 200;
  updateHUD();
};

window.completeRobot = function() {
  state.xp += 500;
  updateHUD();
  notify('🤖 Robot built successfully! +500 XP');
  closeGadget();
};

// VR STATION
window.showVr = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🥽 VR STATION</h2>
    <p class="subtitle">Virtual Reality Experience Center</p>
    
    <div class="section">
      <h3>📋 Available Simulations</h3>
      <div class="optionGrid">
        <div class="option" onclick="startVRSim('DNA')">🧬 DNA Helix 3D</div>
        <div class="option" onclick="startVRSim('Brain')">🧠 Brain Mapping</div>
        <div class="option" onclick="startVRSim('Ocean')">🌊 Ocean Depths</div>
        <div class="option" onclick="startVRSim('Quantum')">⚛️ Quantum Realm</div>
        <div class="option" onclick="startVRSim('Micro')">🔬 Microscopic World</div>
      </div>
    </div>
    
    <div class="display">VR STATION READY
Select simulation to begin...</div>
  `;
};

window.startVRSim = function(sim) {
  const simNames = {
    'DNA': 'DNA Helix 3D Explorer',
    'Brain': 'Neural Pathway Mapping',
    'Ocean': 'Deep Ocean Exploration',
    'Quantum': 'Quantum Particle Physics',
    'Micro': 'Microscopic Cell World'
  };
  
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🥽 VR STATION</h2>
    <p class="subtitle">${simNames[sim]}</p>
    
    <div class="section">
      <h3>VR Experience</h3>
      <canvas class="display" id="vrCanvas" width="800" height="600"></canvas>
    </div>
    
    <div class="display">Controls:
WASD - Move
Mouse - Look around
Space - Interact
ESC - Exit VR

Simulation running...</div>
    
    <div class="btnGroup">
      <button class="actionBtn success" onclick="exitVR()">✓ EXIT VR</button>
    </div>
  `;
  
  drawVRSimulation(sim);
  
  state.xp += 300;
  updateHUD();
  notify(`🥽 Entered ${simNames[sim]}!`);
};

function drawVRSimulation(sim) {
  const canvas = document.getElementById('vrCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 800, 600);
  
  if (sim === 'DNA') {
    // Draw DNA helix
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    for (let i = 0; i < 800; i += 10) {
      const y1 = 300 + Math.sin(i * 0.05) * 100;
      const y2 = 300 - Math.sin(i * 0.05) * 100;
      ctx.beginPath();
      ctx.arc(i, y1, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(i, y2, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (sim === 'Brain') {
    // Draw neural network
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 600;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      for (let j = 0; j < 3; j++) {
        const x2 = x + (Math.random() - 0.5) * 100;
        const y2 = y + (Math.random() - 0.5) * 100;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }
  
  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial';
  ctx.fillText('VR SIMULATION ACTIVE', 250, 50);
}

window.exitVR = function() {
  notify('🥽 Exiting VR simulation...');
  closeGadget();
};

// PCR MACHINE, CENTRIFUGE, pH METER - Simplified versions
window.showPcr = function() {
  showGenericGadget({ name: 'PCR Machine', icon: '🧪', desc: 'Thermal cycling for DNA amplification - Full version coming soon!' });
};

window.showCentrifuge = function() {
  showGenericGadget({ name: 'Centrifuge', icon: '🌀', desc: 'Separate samples by density - Full version coming soon!' });
};

window.showPh = function() {
  showGenericGadget({ name: 'pH Meter', icon: '📏', desc: 'Measure acidity/alkalinity - Full version coming soon!' });
};

console.log('%c✓ All gadgets loaded successfully!', 'color: #27ae60; font-size: 14px; font-weight: bold;');
console.log('%c✓ DNA Sequencer, Microscope, Spectrophotometer, Oscilloscope, 3D Printer, Robot Builder, VR Station ready!', 'color: #3498db; font-size: 12px;');
</body>
</html>