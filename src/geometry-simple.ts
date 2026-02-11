/**
 * Simple geometry test - triangle soup (no indices)
 */

export interface MeshGeometry {
  positions: Float32Array;
  indices?: Uint32Array;
}

/**
 * Creates vertex colors array
 */
export function makeVertexColors(
  vertexCount: number,
  r: number,
  g: number,
  b: number,
  alpha: number = 1
): Uint8Array {
  const a = Math.max(0, Math.min(1, alpha));
  const colors = new Uint8Array(vertexCount * 4);

  for (let i = 0; i < vertexCount; i++) {
    colors[i * 4 + 0] = r;
    colors[i * 4 + 1] = g;
    colors[i * 4 + 2] = b;
    colors[i * 4 + 3] = Math.floor(a * 255);
  }
  
  return colors;
}

/**
 * Creates a simple cube without indices (triangle soup)
 */
export function createCube(size: number = 1): MeshGeometry {
  const s = size / 2;
  
  // Each face as separate triangles (no shared vertices)
  const positions = new Float32Array([
    // Front face (2 triangles = 6 vertices)
    -s, -s, s,  s, -s, s,  s, s, s,
    -s, -s, s,  s, s, s,  -s, s, s,
    
    // Back face
    s, -s, -s,  -s, -s, -s,  -s, s, -s,
    s, -s, -s,  -s, s, -s,  s, s, -s,
    
    // Top face
    -s, s, s,  s, s, s,  s, s, -s,
    -s, s, s,  s, s, -s,  -s, s, -s,
    
    // Bottom face
    -s, -s, -s,  s, -s, -s,  s, -s, s,
    -s, -s, -s,  s, -s, s,  -s, -s, s,
    
    // Right face
    s, -s, s,  s, -s, -s,  s, s, -s,
    s, -s, s,  s, s, -s,  s, s, s,
    
    // Left face
    -s, -s, -s,  -s, -s, s,  -s, s, s,
    -s, -s, -s,  -s, s, s,  -s, s, -s,
  ]);

  return { positions };
}

/**
 * Creates a simple plane without indices
 */
export function createPlane(width: number = 1, height: number = 1): MeshGeometry {
  const w = width / 2;
  const h = height / 2;

  const positions = new Float32Array([
    // Triangle 1
    -w, -h, 0,
    w, -h, 0,
    w, h, 0,
    // Triangle 2
    -w, -h, 0,
    w, h, 0,
    -w, h, 0,
  ]);

  return { positions };
}

/**
 * Creates a sphere without indices (triangle soup)
 */
export function createUnitSphere(radius: number = 1, segments: number = 20): MeshGeometry {
  const positions: number[] = [];

  // Generate triangles directly
  for (let lat = 0; lat < segments; lat++) {
    for (let lon = 0; lon < segments; lon++) {
      // Calculate vertex positions for quad
      const v1 = getSphereVertex(lat, lon, segments, radius);
      const v2 = getSphereVertex(lat, lon + 1, segments, radius);
      const v3 = getSphereVertex(lat + 1, lon, segments, radius);
      const v4 = getSphereVertex(lat + 1, lon + 1, segments, radius);

      // Triangle 1
      positions.push(...v1, ...v2, ...v3);
      // Triangle 2
      positions.push(...v3, ...v2, ...v4);
    }
  }

  return {
    positions: new Float32Array(positions),
  };
}

function getSphereVertex(lat: number, lon: number, segments: number, radius: number): number[] {
  const theta = (lat * Math.PI) / segments;
  const phi = (lon * 2 * Math.PI) / segments;
  
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);

  const x = cosPhi * sinTheta;
  const y = cosTheta;
  const z = sinPhi * sinTheta;

  return [radius * x, radius * y, radius * z];
}

/**
 * Creates vertex colors with varying colors per vertex (for multi-color test)
 */
export function makeMultiVertexColors(vertexCount: number, alpha: number = 1): Uint8Array {
  const a = Math.max(0, Math.min(1, alpha));
  const colors = new Uint8Array(vertexCount * 4);

  for (let i = 0; i < vertexCount; i++) {
    const t = i / vertexCount;
    const angle = t * Math.PI * 2;
    
    colors[i * 4 + 0] = Math.floor((Math.sin(angle) * 0.5 + 0.5) * 255);
    colors[i * 4 + 1] = Math.floor((Math.sin(angle + Math.PI * 2 / 3) * 0.5 + 0.5) * 255);
    colors[i * 4 + 2] = Math.floor((Math.sin(angle + Math.PI * 4 / 3) * 0.5 + 0.5) * 255);
    colors[i * 4 + 3] = Math.floor(a * 255);
  }

  return colors;
}
