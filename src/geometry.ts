/**
 * Geometry helper functions for creating mesh data
 * Based on the forum post implementation
 */

export interface MeshGeometry {
  positions: Float32Array;
  indices?: Uint32Array;
}

/**
 * Creates vertex colors array matching the forum implementation
 * @param vertexCount Number of vertices
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @param alpha Alpha value (0-1)
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
    colors[i * 4 + 0] = r; // R
    colors[i * 4 + 1] = g; // G
    colors[i * 4 + 2] = b; // B
    colors[i * 4 + 3] = Math.floor(a * 255); // Alpha
  }
  
  return colors;
}

/**
 * Creates a unit sphere mesh (as used in the forum post)
 * @param radius Sphere radius
 * @param segments Number of segments (higher = smoother)
 */
export function createUnitSphere(radius: number = 1, segments: number = 20): MeshGeometry {
  const positions: number[] = [];
  const indices: number[] = [];

  // Generate vertices
  for (let lat = 0; lat <= segments; lat++) {
    const theta = (lat * Math.PI) / segments;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= segments; lon++) {
      const phi = (lon * 2 * Math.PI) / segments;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;

      positions.push(radius * x, radius * y, radius * z);
    }
  }

  // Generate indices with correct winding order (counter-clockwise)
  for (let lat = 0; lat < segments; lat++) {
    for (let lon = 0; lon < segments; lon++) {
      const first = lat * (segments + 1) + lon;
      const second = first + segments + 1;

      // Triangle 1 (counter-clockwise from outside)
      indices.push(first, first + 1, second);
      // Triangle 2 (counter-clockwise from outside)
      indices.push(second, first + 1, second + 1);
    }
  }

  return {
    positions: new Float32Array(positions),
    indices: new Uint32Array(indices),
  };
}

/**
 * Creates a cube mesh
 * @param size Cube side length
 */
export function createCube(size: number = 1): MeshGeometry {
  const s = size / 2;

  const positions = new Float32Array([
    // Front face
    -s, -s, s,  s, -s, s,  s, s, s,  -s, s, s,
    // Back face
    -s, -s, -s,  -s, s, -s,  s, s, -s,  s, -s, -s,
    // Top face
    -s, s, -s,  -s, s, s,  s, s, s,  s, s, -s,
    // Bottom face
    -s, -s, -s,  s, -s, -s,  s, -s, s,  -s, -s, s,
    // Right face
    s, -s, -s,  s, s, -s,  s, s, s,  s, -s, s,
    // Left face
    -s, -s, -s,  -s, -s, s,  -s, s, s,  -s, s, -s,
  ]);

  const indices = new Uint32Array([
    0, 1, 2,  0, 2, 3,    // Front
    4, 5, 6,  4, 6, 7,    // Back
    8, 9, 10,  8, 10, 11, // Top
    12, 13, 14,  12, 14, 15, // Bottom
    16, 17, 18,  16, 18, 19, // Right
    20, 21, 22,  20, 22, 23, // Left
  ]);

  return { positions, indices };
}

/**
 * Creates a plane mesh
 * @param width Plane width
 * @param height Plane height
 */
export function createPlane(width: number = 1, height: number = 1): MeshGeometry {
  const w = width / 2;
  const h = height / 2;

  const positions = new Float32Array([
    -w, -h, 0,
    w, -h, 0,
    w, h, 0,
    -w, h, 0,
  ]);

  const indices = new Uint32Array([
    0, 1, 2,
    0, 2, 3,
  ]);

  return { positions, indices };
}

/**
 * Creates vertex colors with varying colors per vertex (for multi-color test)
 */
export function makeMultiVertexColors(vertexCount: number, alpha: number = 1): Uint8Array {
  const a = Math.max(0, Math.min(1, alpha));
  const colors = new Uint8Array(vertexCount * 4);

  for (let i = 0; i < vertexCount; i++) {
    // Create a color gradient: red -> green -> blue -> red
    const t = i / vertexCount;
    const angle = t * Math.PI * 2;
    
    colors[i * 4 + 0] = Math.floor((Math.sin(angle) * 0.5 + 0.5) * 255); // R
    colors[i * 4 + 1] = Math.floor((Math.sin(angle + Math.PI * 2 / 3) * 0.5 + 0.5) * 255); // G
    colors[i * 4 + 2] = Math.floor((Math.sin(angle + Math.PI * 4 / 3) * 0.5 + 0.5) * 255); // B
    colors[i * 4 + 3] = Math.floor(a * 255); // Alpha
  }

  return colors;
}
