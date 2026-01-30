<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Pages Site</title>
</head>
<body>
// TechVerse 2077 - Advanced Scientific Equipment
// Electron Microscope, Mass Spectrometer, Flow Cytometer, Chromatography, ELISA Reader

console.log('%c📦 Loading Advanced Scientific Equipment...', 'color: #9b59b6; font-size: 14px;');

// ELECTRON MICROSCOPE - ULTRA HIGH MAGNIFICATION
window.showElectron = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🔭 ELECTRON MICROSCOPE</h2>
    <p class="subtitle">Model: JEOL JEM-2100F • Transmission Electron Microscope</p>
    
    <div class="section">
      <h3>📋 Instructions</h3>
      <p>Electron microscope uses electron beams for ultra-high magnification (up to 1,000,000x).<br>
      1. Prepare sample (coating required)<br>
      2. Load into vacuum chamber<br>
      3. Set beam parameters<br>
      4. Adjust magnification<br>
      5. Capture high-resolution images</p>
    </div>
    
    <div class="section">
      <h3>Sample Preparation</h3>
      <div class="optionGrid">
        <div class="option" onclick="prepareEMSample('Virus')">🦠 Virus Particles</div>
        <div class="option" onclick="prepareEMSample('Protein')">🧬 Protein Crystals</div>
        <div class="option" onclick="prepareEMSample('Nanoparticle')">⚛️ Nanoparticles</div>
        <div class="option" onclick="prepareEMSample('Cell')">🧫 Cell Organelles</div>
      </div>
    </div>
    
    <div class="display">ELECTRON MICROSCOPE READY
Select sample type to begin...</div>
  `;
};

window.prepareEMSample = function(sample) {
  state.gadgetData.emSample = sample;
  
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🔭 ELECTRON MICROSCOPE</h2>
    <p class="subtitle">Sample: ${sample} • Preparing for imaging</p>
    
    <div class="section">
      <h3>Sample Preparation Progress</h3>
      <div class="display" id="emPrepDisplay">Sample: ${sample}
[1/3] Gold coating... IN PROGRESS
[2/3] Vacuum chamber loading... PENDING
[3/3] Beam alignment... PENDING</div>
      <div class="progress"><div class="progressBar" id="emPrepProgress">0%</div></div>
    </div>
  `;
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    document.getElementById('emPrepProgress').style.width = progress + '%';
    document.getElementById('emPrepProgress').textContent = progress + '%';
    
    if (progress === 33) {
      document.getElementById('emPrepDisplay').textContent = `Sample: ${sample}
[1/3] Gold coating... COMPLETE ✓
[2/3] Vacuum chamber loading... IN PROGRESS
[3/3] Beam alignment... PENDING`;
    } else if (progress === 66) {
      document.getElementById('emPrepDisplay').textContent = `Sample: ${sample}
[1/3] Gold coating... COMPLETE ✓
[2/3] Vacuum chamber loading... COMPLETE ✓
[3/3] Beam alignment... IN PROGRESS`;
    }
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(showEMControls, 1000);
    }
  }, 200);
};

function showEMControls() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>🔭 ELECTRON MICROSCOPE</h2>
    <p class="subtitle">Sample ready • Configure imaging parameters</p>
    
    <div class="section">
      <h3>Electron Microscope View</h3>
      <canvas class="display" id="emCanvas" width="600" height="600"></canvas>
    </div>
    
    <div class="section">
      <h3>Beam Controls</h3>
      <div class="controlPanel">
        <div class="control">
          <label>Magnification</label>
          <select id="emMag" onchange="updateEMMag(this.value)">
            <option value="10000">10,000x</option>
            <option value="50000">50,000x</option>
            <option value="100000" selected>100,000x</option>
            <option value="500000">500,000x</option>
            <option value="1000000">1,000,000x</option>
          </select>
        </div>
        <div class="control">
          <label>Beam Voltage (kV): <span id="voltageVal">200</span></label>
          <input type="range" min="80" max="300" value="200" id="voltageSlider" oninput="updateEMVoltage(this.value)">
        </div>
        <div class="control">
          <label>Beam Current (μA): <span id="currentVal">10</span></label>
          <input type="range" min="1" max="20" value="10" id="currentSlider" oninput="updateEMCurrent(this.value)">
        </div>
        <div class="control">
          <label>Vacuum Level</label>
          <select id="vacuum">
            <option value="high" selected>High Vacuum (10⁻⁶ Pa)</option>
            <option value="ultra">Ultra High (10⁻⁹ Pa)</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="display" id="emStatus">Magnification: 100,000x
Beam Voltage: 200 kV
Vacuum: High
Status: READY</div>
    
    <div class="btnGroup">
      <button class="actionBtn" onclick="captureEMImage()">📸 CAPTURE IMAGE</button>
      <button class="actionBtn" onclick="reconstruct3D()">🎲 3D RECONSTRUCTION</button>
      <button class="actionBtn success" onclick="completeEM()">✓ COMPLETE</button>
    </div>
  `;
  
  drawEMView();
};

function drawEMView() {
  const canvas = document.getElementById('emCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 600, 600);
  
  const mag = parseInt(document.getElementById('emMag').value);
  const sample = state.gadgetData.emSample;
  
  ctx.save();
  ctx.translate(300, 300);
  
  if (sample === 'Virus') {
    // Draw virus particles
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const size = 30 + (mag / 100000) * 10;
      
      // Icosahedral structure
      ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        const angle = (j / 6) * Math.PI * 2;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  } else if (sample === 'Protein') {
    // Draw protein crystals
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 250;
      const y = (Math.random() - 0.5) * 250;
      const size = 10 + (mag / 200000) * 5;
      ctx.strokeRect(x, y, size, size);
    }
  } else if (sample === 'Nanoparticle') {
    // Draw nanoparticles
    ctx.fillStyle = '#f39c12';
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 280;
      const y = (Math.random() - 0.5) * 280;
      const size = 3 + (mag / 500000) * 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  ctx.restore();
  
  // Scale bar
  ctx.fillStyle = '#fff';
  ctx.fillRect(450, 550, 100, 5);
  ctx.font = '12px Arial';
  ctx.fillText(`${Math.floor(1000 / (mag / 10000))} nm`, 470, 545);
  
  // Info overlay
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(10, 10, 200, 80);
  ctx.fillStyle = '#0f0';
  ctx.font = '14px monospace';
  ctx.fillText(`MAG: ${(mag / 1000).toFixed(0)}K X`, 20, 30);
  ctx.fillText(`VOLTAGE: ${document.getElementById('voltageSlider').value} kV`, 20, 50);
  ctx.fillText(`VACUUM: OK`, 20, 70);
}

window.updateEMMag = function(val) {
  drawEMView();
  notify(`🔭 Magnification: ${(val / 1000).toFixed(0)}K X`);
};

window.updateEMVoltage = function(val) {
  document.getElementById('voltageVal').textContent = val;
  drawEMView();
};

window.updateEMCurrent = function(val) {
  document.getElementById('currentVal').textContent = val;
};

window.captureEMImage = function() {
  notify('📸 High-resolution image captured!');
  state.xp += 100;
  updateHUD();
};

window.reconstruct3D = function() {
  notify('🎲 3D reconstruction in progress...');
  setTimeout(() => {
    notify('✓ 3D model generated!');
    state.xp += 200;
    updateHUD();
  }, 2000);
};

window.completeEM = function() {
  let xp = 600;
  if (state.currentFloor === 3) xp *= 2;
  xp = Math.floor(xp);
  
  state.xp += xp;
  updateHUD();
  notify(`🔭 Electron microscopy complete! +${xp} XP`);
  closeGadget();
};

// MASS SPECTROMETER
window.showMass = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>⚗️ MASS SPECTROMETER</h2>
    <p class="subtitle">Model: Thermo Q Exactive • High-resolution mass spectrometry</p>
    
    <div class="section">
      <h3>📋 Instructions</h3>
      <p>Mass spectrometry identifies compounds by measuring mass-to-charge ratio (m/z).<br>
      1. Ionize sample<br>
      2. Separate ions by m/z<br>
      3. Detect and analyze spectrum<br>
      4. Identify compounds</p>
    </div>
    
    <div class="section">
      <h3>Ionization Method</h3>
      <div class="optionGrid">
        <div class="option" onclick="selectIonization('ESI')">⚡ ESI<br><small>Electrospray</small></div>
        <div class="option" onclick="selectIonization('MALDI')">🎯 MALDI<br><small>Matrix-assisted</small></div>
        <div class="option" onclick="selectIonization('APCI')">🌊 APCI<br><small>Atmospheric pressure</small></div>
      </div>
    </div>
    
    <div class="display">MASS SPECTROMETER READY
Select ionization method...</div>
  `;
};

window.selectIonization = function(method) {
  state.gadgetData.ionization = method;
  
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>⚗️ MASS SPECTROMETER</h2>
    <p class="subtitle">Ionization: ${method} • Running analysis</p>
    
    <div class="section">
      <h3>Mass Spectrum</h3>
      <canvas class="display" id="massCanvas" width="800" height="400"></canvas>
    </div>
    
    <div class="display" id="massResults">Analyzing sample...
Ionization in progress...</div>
    
    <div class="btnGroup">
      <button class="actionBtn" onclick="identifyCompounds()">🔍 IDENTIFY COMPOUNDS</button>
      <button class="actionBtn success" onclick="completeMass()">✓ COMPLETE</button>
    </div>
  `;
  
  drawMassSpectrum();
};

function drawMassSpectrum() {
  const canvas = document.getElementById('massCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 800, 400);
  
  // Axes
  ctx.strokeStyle = '#27ae60';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 350);
  ctx.lineTo(750, 350);
  ctx.moveTo(50, 350);
  ctx.lineTo(50, 50);
  ctx.stroke();
  
  ctx.fillStyle = '#0f0';
  ctx.font = '14px Arial';
  ctx.fillText('m/z', 400, 380);
  ctx.save();
  ctx.translate(20, 200);
  ctx.rotate(-Math.PI/2);
  ctx.fillText('Relative Intensity (%)', 0, 0);
  ctx.restore();
  
  // Generate peaks
  const peaks = [
    { mz: 100, intensity: 30 },
    { mz: 150, intensity: 50 },
    { mz: 200, intensity: 100 },
    { mz: 250, intensity: 40 },
    { mz: 300, intensity: 70 },
    { mz: 350, intensity: 20 }
  ];
  
  ctx.fillStyle = '#3498db';
  peaks.forEach(peak => {
    const x = 50 + (peak.mz / 400) * 700;
    const height = (peak.intensity / 100) * 300;
    ctx.fillRect(x - 2, 350 - height, 4, height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(peak.mz.toString(), x - 10, 350 - height - 5);
    ctx.fillStyle = '#3498db';
  });
  
  document.getElementById('massResults').textContent = `Mass Spectrum Analysis:
Base Peak: m/z 200 (100%)
Molecular Ion: m/z 350
Fragments detected: ${peaks.length}

Major peaks:
m/z 200 - Base peak
m/z 300 - Fragment ion
m/z 350 - Molecular ion`;
}

window.identifyCompounds = function() {
  const compounds = [
    'Caffeine (C8H10N4O2)',
    'Glucose (C6H12O6)',
    'Aspirin (C9H8O4)'
  ];
  
  const identified = compounds[Math.floor(Math.random() * compounds.length)];
  
  notify(`🔍 Compound identified: ${identified}`);
  state.xp += 150;
  updateHUD();
  
  document.getElementById('massResults').textContent += `\n\n✓ COMPOUND IDENTIFIED:
${identified}
Confidence: ${(85 + Math.random() * 15).toFixed(1)}%`;
};

window.completeMass = function() {
  let xp = 500;
  if (state.currentFloor === 2) xp *= 1.5;
  xp = Math.floor(xp);
  
  state.xp += xp;
  updateHUD();
  notify(`⚗️ Mass spectrometry complete! +${xp} XP`);
  closeGadget();
};

// FLOW CYTOMETER
window.showFlow = function() {
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>💧 FLOW CYTOMETER</h2>
    <p class="subtitle">Model: BD FACSAria III • Cell sorting and analysis</p>
    
    <div class="section">
      <h3>📋 Instructions</h3>
      <p>Flow cytometry analyzes and sorts cells based on fluorescence and light scattering.<br>
      1. Prepare cell suspension<br>
      2. Set laser parameters<br>
      3. Define gating strategy<br>
      4. Analyze populations<br>
      5. Sort cells (optional)</p>
    </div>
    
    <div class="section">
      <h3>Sample Type</h3>
      <div class="optionGrid">
        <div class="option" onclick="loadFlowSample('Blood')">💉 Blood Cells</div>
        <div class="option" onclick="loadFlowSample('Immune')">🛡️ Immune Cells</div>
        <div class="option" onclick="loadFlowSample('Cancer')">🧫 Cancer Cells</div>
        <div class="option" onclick="loadFlowSample('Stem')">🌱 Stem Cells</div>
      </div>
    </div>
    
    <div class="display">FLOW CYTOMETER READY
Load sample to begin analysis...</div>
  `;
};

window.loadFlowSample = function(sample) {
  state.gadgetData.flowSample = sample;
  
  const container = document.getElementById('gadgetContainer');
  container.innerHTML = `
    <h2>💧 FLOW CYTOMETER</h2>
    <p class="subtitle">Sample: ${sample} • Running analysis</p>
    
    <div class="section">
      <h3>Flow Cytometry Plot</h3>
      <canvas class="display" id="flowCanvas" width="600" height="600"></canvas>
    </div>
    
    <div class="display" id="flowResults">Analyzing ${sample}...
Events acquired: 0 / 10,000</div>
    
    <div class="progress"><div class="progressBar" id="flowProgress">0%</div></div>
    
    <div class="btnGroup">
      <button class="actionBtn" onclick="sortCells()">🔀 SORT CELLS</button>
      <button class="actionBtn success" onclick="completeFlow()">✓ COMPLETE</button>
    </div>
  `;
  
  let events = 0;
  const interval = setInterval(() => {
    events += 500;
    const progress = (events / 10000) * 100;
    
    document.getElementById('flowProgress').style.width = progress + '%';
    document.getElementById('flowProgress').textContent = Math.floor(progress) + '%';
    
    drawFlowPlot(events);
    
    if (events >= 10000) {
      clearInterval(interval);
      showFlowResults();
    }
  }, 100);
};

function drawFlowPlot(events) {
  const canvas = document.getElementById('flowCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 600, 600);
  
  // Axes
  ctx.strokeStyle = '#27ae60';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 550);
  ctx.lineTo(550, 550);
  ctx.moveTo(50, 550);
  ctx.lineTo(50, 50);
  ctx.stroke();
  
  ctx.fillStyle = '#0f0';
  ctx.font = '14px Arial';
  ctx.fillText('FSC-A (Cell Size)', 300, 580);
  ctx.save();
  ctx.translate(20, 300);
  ctx.rotate(-Math.PI/2);
  ctx.fillText('SSC-A (Granularity)', 0, 0);
  ctx.restore();
  
  // Plot cells
  for (let i = 0; i < events / 50; i++) {
    const x = 50 + Math.random() * 500;
    const y = 50 + Math.random() * 500;
    
    ctx.fillStyle = `rgba(52, 152, 219, 0.3)`;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Gating
  ctx.strokeStyle = '#e74c3c';
  ctx.lineWidth = 3;
  ctx.strokeRect(200, 200, 200, 200);
  
  document.getElementById('flowResults').textContent = `Analyzing ${state.gadgetData.flowSample}...
Events acquired: ${events.toLocaleString()} / 10,000
Gated population: ${Math.floor((events / 10000) * 6500).toLocaleString()} cells (65%)`;
}

function showFlowResults() {
  document.getElementById('flowResults').textContent = `Analysis Complete!

Total events: 10,000
Gated population: 6,500 cells (65%)

Population breakdown:
- Population 1: 4,200 cells (42%)
- Population 2: 2,300 cells (23%)
- Debris: 3,500 cells (35%)

Median fluorescence intensity:
FL1: 1,234
FL2: 5,678`;
}

window.sortCells = function() {
  notify('🔀 Cell sorting in progress...');
  setTimeout(() => {
    notify('✓ 6,500 cells sorted successfully!');
    state.xp += 200;
    updateHUD();
  }, 2000);
};

window.completeFlow = function() {
  let xp = 550;
  if (state.currentFloor === 3) xp *= 2;
  xp = Math.floor(xp);
  
  state.xp += xp;
  updateHUD();
  notify(`💧 Flow cytometry complete! +${xp} XP`);
  closeGadget();
};

console.log('%c✓ Electron Microscope, Mass Spectrometer, Flow Cytometer loaded!', 'color: #9b59b6; font-size: 14px; font-weight: bold;');
</body>
</html>