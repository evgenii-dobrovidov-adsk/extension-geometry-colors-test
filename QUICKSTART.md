# Quick Start Guide

## For the User: Testing the Extension

### 1. Load in Forma
- Dev server is running at: **http://localhost:5173**
- Manifest URL: **http://localhost:5173/manifest.json**

### 2. In Autodesk Forma:
1. Open your Forma project
2. Load the extension using the manifest URL above
3. The extension UI should appear with 5 buttons

### 3. Test Each Color Configuration:
Click the buttons in order:
1. **Add Red Sphere** - Should be bright red (RGB 255,0,0)
2. **Add Green Cube** - Should be bright green (RGB 0,255,0)  
3. **Add Blue Plane** - Should be bright blue (RGB 0,0,255)
4. **Add Multi-Color Mesh** - Should show color gradient
5. **Cleanup All** - Removes all meshes

### 4. Check the Logs:
The log panel shows:
- What's being created
- Vertex counts
- Color values being sent
- Mesh IDs
- Any errors

### 5. Document Your Findings:
**Question**: Do the meshes appear in the correct colors or greyish?
- If greyish: Issue reproduced ✓
- If colorful: Issue may be environment-specific

---

## Project Files Summary

```
extension-geometry-colors-test/
├── manifest.json          ← Forma extension config
├── index.html            ← Extension UI
├── README.md             ← Full documentation
├── src/
│   ├── main.ts          ← Extension logic (4 test meshes)
│   ├── geometry.ts      ← Mesh generators (sphere, cube, plane)
│   └── style.css        ← UI styling
└── package.json
```

---

## What This POC Does

✅ Reproduces the exact forum post scenario (red sphere, RGB 255,0,0)
✅ Tests multiple geometries (sphere, cube, plane)
✅ Tests multiple colors (red, green, blue, gradient)
✅ Logs all color data for debugging
✅ Uses same `makeVertexColors()` function from forum
✅ Positions meshes at different locations for easy viewing

---

## If Colors Don't Work

The testing notes document potential causes:
1. Color format (uint8 vs normalized floats)
2. Lighting/material settings in Forma
3. Color space issues
4. API changes

See `TESTING_NOTES.md` for investigation checklist.

---

## Stopping the Dev Server

```bash
# Find the process
lsof -ti:5173

# Kill it
kill <PID>
```

Or use Ctrl+C in the terminal where `npm run dev` is running.
