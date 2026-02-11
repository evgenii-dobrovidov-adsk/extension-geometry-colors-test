# Geometry Colors Test - Forma Extension POC

## Overview

This is a proof-of-concept Autodesk Forma extension that reproduces the vertex color rendering issue reported in the [Forma Developer Forum](https://forums.autodesk.com/t5/forma-developer-forum/cannot-render-color-in-a-added-mesh/m-p/14007332).

**Problem**: When adding meshes to Forma using the `forma.render.addMesh()` API with vertex colors, the meshes appear greyish regardless of the RGB values provided.

## Project Structure

```
extension-geometry-colors-test/
├── manifest.json          # Extension manifest for Forma
├── index.html            # Extension UI
├── src/
│   ├── main.ts          # Main extension logic
│   ├── geometry.ts      # Mesh generation utilities
│   └── style.css        # UI styles
├── package.json
└── tsconfig.json
```

## Features

This extension creates four test meshes with different color configurations:

1. **Red Sphere** (RGB 255,0,0) - Matches the exact example from the forum post
2. **Green Cube** (RGB 0,255,0) - Tests colors on a different geometry type
3. **Blue Plane** (RGB 0,0,255) - Tests colors on a simple flat surface
4. **Multi-Color Sphere** - Tests varying vertex colors (gradient effect)

All meshes use the same `makeVertexColors()` implementation as reported in the forum.

## Setup Instructions

### Prerequisites

- Node.js 16 or higher
- npm or pnpm
- Access to Autodesk Forma

### Installation

1. Clone or download this repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The extension will be available at `http://localhost:5173`

### Loading in Forma

1. Open Autodesk Forma in your browser
2. Navigate to a project/proposal
3. Add this extension using the manifest URL:
   - Development: Point to `http://localhost:5173/manifest.json`
   - Or use Forma's extension loading interface

## Usage

Once loaded in Forma:

1. Click **"Add Red Sphere"** to create a sphere with RGB(255,0,0) colors
2. Click **"Add Green Cube"** to create a cube with RGB(0,255,0) colors
3. Click **"Add Blue Plane"** to create a plane with RGB(0,0,255) colors
4. Click **"Add Multi-Color Mesh"** to create a sphere with gradient colors
5. Click **"Cleanup All"** to remove all added meshes

The log panel shows:
- Vertex counts and indices for each mesh
- Color values for sample vertices (first vertex or first 3 for multi-color)
- Mesh IDs returned by Forma
- Any errors encountered

## Technical Details

### Color Format

The extension uses `Uint8Array` for vertex colors with RGBA format:
- Each vertex has 4 bytes: `[R, G, B, A]`
- Values range from 0-255
- Alpha is set to 255 (fully opaque)

```typescript
function makeVertexColors(vertexCount: number, r: number, g: number, b: number, alpha: number = 1): Uint8Array {
  const colors = new Uint8Array(vertexCount * 4);
  for (let i = 0; i < vertexCount; i++) {
    colors[i * 4 + 0] = r;     // Red
    colors[i * 4 + 1] = g;     // Green
    colors[i * 4 + 2] = b;     // Blue
    colors[i * 4 + 3] = Math.floor(alpha * 255); // Alpha
  }
  return colors;
}
```

### Transform Matrix

Forma uses 4x4 transformation matrices (column-major order):
```typescript
const transform: [number, ...] = [
  1, 0, 0, 0,  // Column 1
  0, 1, 0, 0,  // Column 2
  0, 0, 1, 0,  // Column 3
  x, y, z, 1   // Column 4 (translation)
];
```

### Geometry Data Structure

```typescript
{
  position: Float32Array,  // [x1, y1, z1, x2, y2, z2, ...]
  index: number[],         // Triangle indices
  color: Uint8Array        // [r1, g1, b1, a1, r2, g2, b2, a2, ...]
}
```

## Expected vs Actual Behavior

### Expected
- Red sphere should appear bright red (RGB 255,0,0)
- Green cube should appear bright green (RGB 0,255,0)
- Blue plane should appear bright blue (RGB 0,0,255)
- Multi-color sphere should show color gradient

### Actual (Reported Issue)
- All meshes appear greyish/washed out
- Vertex colors don't seem to be applied correctly
- The issue persists regardless of RGB values

## Investigation Notes

This POC aims to:
1. Reproduce the exact scenario from the forum post
2. Test multiple color configurations to identify patterns
3. Provide detailed logging of color values sent to the API
4. Test different mesh types (sphere, cube, plane)
5. Document the actual rendering behavior

## Building for Production

```bash
npm run build
```

This creates a `dist/` folder with the compiled extension. Update the manifest URL to point to your production server.

## References

- [Forum Post: Cannot render color in added mesh](https://forums.autodesk.com/t5/forma-developer-forum/cannot-render-color-in-a-added-mesh/m-p/14007332)
- [Forma Embedded View SDK Docs](https://app.autodeskforma.com/forma-embedded-view-sdk/docs/)
- [Forma API Tutorial](https://aps.autodesk.com/en/docs/forma/v1/embedded-views/tutorial/)
- [RenderApi Interface](https://app.autodeskforma.com/forma-embedded-view-sdk/docs/interfaces/render.RenderApi.html)

## License

This is a proof-of-concept demonstration project for debugging purposes.

## Support

For questions about this extension or the color rendering issue:
- [Forma Developer Forum](https://forums.autodesk.com/t5/forma-developer-forum/bd-p/forma-developer-forum-en)
- [Original Issue Thread](https://forums.autodesk.com/t5/forma-developer-forum/cannot-render-color-in-a-added-mesh/m-p/14007332)
