import './style.css';
import { Forma } from 'forma-embedded-view-sdk/auto';
import {
  createUnitSphere,
  createCube,
  createPlane,
  makeVertexColors,
  makeMultiVertexColors,
} from './geometry-simple';

// Store mesh IDs for cleanup
const meshIds: string[] = [];

// Store terrain elevation (fetched once)
let terrainElevation: number | null = null;

// Get terrain elevation at origin
async function getTerrainElevation(): Promise<number> {
  if (terrainElevation !== null) {
    return terrainElevation;
  }
  
  try {
    terrainElevation = await Forma.terrain.getElevationAt({ x: 0, y: 0 });
    log(`Terrain elevation at origin: ${terrainElevation.toFixed(2)}m`);
    return terrainElevation;
  } catch (error) {
    log('⚠️ Could not get terrain elevation, using default 0m', error);
    return 0;
  }
}

// Logger helper
function log(message: string, data?: any) {
  const logEl = document.getElementById('log');
  if (!logEl) return;

  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[${timestamp}] ${message}`;
  
  console.log(logMessage, data || '');
  
  if (data) {
    logEl.textContent += `${logMessage}\n${JSON.stringify(data, null, 2)}\n\n`;
  } else {
    logEl.textContent += `${logMessage}\n`;
  }
  
  logEl.scrollTop = logEl.scrollHeight;
}

// Initialize Forma SDK
async function initializeForma() {
  try {
    log('Initializing Forma SDK...');
    // The Forma SDK auto-initializes when imported from /auto
    log('✓ Forma SDK initialized successfully');
    return true;
  } catch (error) {
    log('✗ Failed to initialize Forma SDK', error);
    return false;
  }
}

// Add red sphere (matching forum example)
async function addRedSphere() {
  try {
    log('Creating red sphere (RGB 255,0,0)...');
    
    const elevation = await getTerrainElevation();
    const height = elevation + 10; // 10m above terrain
    
    const { positions } = createUnitSphere(5, 32);
    const vertexCount = positions.length / 3;
    
    log(`Generated sphere: ${vertexCount} vertices`);
    
    const colors = makeVertexColors(vertexCount, 255, 0, 0, 1);
    log('Color sample (first vertex):', {
      r: colors[0],
      g: colors[1],
      b: colors[2],
      a: colors[3],
    });
    
    const geometryData = {
      position: positions,
      color: colors,
    };
    
    // Position above terrain
    // Column-major order: [col1, col2, col3, col4(translation)]
    const transform: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] = [
      1, 0, 0, 0,  // Column 1 (X-axis)
      0, 1, 0, 0,  // Column 2 (Y-axis)
      0, 0, 1, 0,  // Column 3 (Z-axis)
      0, 0, height, 1  // Column 4 (translation: x=0, y=0, z=height)
    ];
    
    const result = await Forma.render.addMesh({
      geometryData,
      transform,
    });
    
    meshIds.push(result.id);
    log(`✓ Red sphere added at elevation ${height.toFixed(2)}m (ID: ${result.id})`);
  } catch (error) {
    log('✗ Failed to add red sphere', error);
  }
}

// Add green cube
async function addGreenCube() {
  try {
    log('Creating green cube (RGB 0,255,0)...');
    
    const elevation = await getTerrainElevation();
    const height = elevation + 10;
    
    const { positions } = createCube(5);
    const vertexCount = positions.length / 3;
    
    log(`Generated cube: ${vertexCount} vertices`);
    
    const colors = makeVertexColors(vertexCount, 0, 255, 0, 1);
    log('Color sample (first vertex):', {
      r: colors[0],
      g: colors[1],
      b: colors[2],
      a: colors[3],
    });
    
    const geometryData = {
      position: positions,
      color: colors,
    };
    
    // Position: 10m right, above terrain
    const transform: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      10, 0, height, 1
    ];
    
    const result = await Forma.render.addMesh({
      geometryData,
      transform,
    });
    
    meshIds.push(result.id);
    log(`✓ Green cube added at elevation ${height.toFixed(2)}m (ID: ${result.id})`);
  } catch (error) {
    log('✗ Failed to add green cube', error);
  }
}

// Add blue plane
async function addBluePlane() {
  try {
    log('Creating blue plane (RGB 0,0,255)...');
    
    const elevation = await getTerrainElevation();
    const height = elevation + 10;
    
    const { positions } = createPlane(5, 5);
    const vertexCount = positions.length / 3;
    
    log(`Generated plane: ${vertexCount} vertices`);
    
    const colors = makeVertexColors(vertexCount, 0, 0, 255, 1);
    log('Color sample (first vertex):', {
      r: colors[0],
      g: colors[1],
      b: colors[2],
      a: colors[3],
    });
    
    const geometryData = {
      position: positions,
      color: colors,
    };
    
    // Position: 20m right, above terrain
    const transform: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      20, 0, height, 1
    ];
    
    const result = await Forma.render.addMesh({
      geometryData,
      transform,
    });
    
    meshIds.push(result.id);
    log(`✓ Blue plane added at elevation ${height.toFixed(2)}m (ID: ${result.id})`);
  } catch (error) {
    log('✗ Failed to add blue plane', error);
  }
}

// Add multi-color mesh
async function addMultiColorMesh() {
  try {
    log('Creating multi-color sphere (gradient colors)...');
    
    const elevation = await getTerrainElevation();
    const height = elevation + 10;
    
    const { positions } = createUnitSphere(5, 32);
    const vertexCount = positions.length / 3;
    
    log(`Generated sphere: ${vertexCount} vertices`);
    
    const colors = makeMultiVertexColors(vertexCount, 1);
    log('Color samples (first 3 vertices):', {
      vertex0: { r: colors[0], g: colors[1], b: colors[2], a: colors[3] },
      vertex1: { r: colors[4], g: colors[5], b: colors[6], a: colors[7] },
      vertex2: { r: colors[8], g: colors[9], b: colors[10], a: colors[11] },
    });
    
    const geometryData = {
      position: positions,
      color: colors,
    };
    
    // Position: 10m forward, above terrain
    const transform: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 10, height, 1
    ];
    
    const result = await Forma.render.addMesh({
      geometryData,
      transform,
    });
    
    meshIds.push(result.id);
    log(`✓ Multi-color sphere added at elevation ${height.toFixed(2)}m (ID: ${result.id})`);
  } catch (error) {
    log('✗ Failed to add multi-color mesh', error);
  }
}

// Cleanup all meshes
async function cleanup() {
  try {
    log(`Cleaning up ${meshIds.length} meshes...`);
    
    await Forma.render.cleanup();
    meshIds.length = 0;
    
    log('✓ All meshes removed');
  } catch (error) {
    log('✗ Failed to cleanup', error);
  }
}

// Setup UI event handlers
function setupUI() {
  document.getElementById('add-red-sphere')?.addEventListener('click', addRedSphere);
  document.getElementById('add-green-cube')?.addEventListener('click', addGreenCube);
  document.getElementById('add-blue-plane')?.addEventListener('click', addBluePlane);
  document.getElementById('add-multicolor')?.addEventListener('click', addMultiColorMesh);
  document.getElementById('cleanup')?.addEventListener('click', cleanup);
  
  log('UI initialized - ready to test mesh colors');
}

// Application entry point
async function main() {
  log('=== Geometry Colors Test Extension ===');
  log('Testing vertex color rendering in Forma meshes');
  log('');
  
  setupUI();
  
  const initialized = await initializeForma();
  if (!initialized) {
    log('⚠️ Extension may not function properly without Forma SDK');
  }
}

main();
