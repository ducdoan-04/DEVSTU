import fs from 'fs';

const samplePath = 'public/samples/portrait_1.jpg';
const imgBuf = fs.readFileSync(samplePath);
const imageBase64 = 'data:image/jpeg;base64,' + imgBuf.toString('base64');

const params = {
  // Portrait
  facialSkinSmooth: 80,
  freckleAcne: 70,
  darkCircles: 60,
  eyeBags: 50,
  teethWhiten: 60,
  faceWidth: 30,
  jawlineSlim: 40,
  eyeSize: 35,
  noseWidth: 20,
  smileEnhance: 25,
  
  // Color & HSL
  exposure: 10,
  contrast: 15,
  temperature: 5,
  hslRedHue: 10,
  hslRedSat: -75,
  hslRedLum: 15,
  hslOrangeSat: 20,
  
  // Highres
  isHighresMatte: false
};

console.log('Sending photo to Rust SIMD engine on port 3005...');
const t0 = Date.now();
const res = await fetch('http://127.0.0.1:3005/api/process_photo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageBase64,
    params,
    highQuality: false
  })
});

const json = await res.json();
console.log('Rust SIMD Response:');
console.log({
  ok: json.ok,
  elapsedMs: json.elapsedMs,
  roundTripMs: Date.now() - t0,
  width: json.width,
  height: json.height,
  detectedFace: json.detectedFace ? 'Face detected at (' + json.detectedFace.centerX.toFixed(2) + ', ' + json.detectedFace.centerY.toFixed(2) + ')' : null,
  dataUrlLen: json.dataUrl?.length
});

if (json.dataUrl) {
  const outBuf = Buffer.from(json.dataUrl.replace(/^data:image\/[a-zA-Z]+;base64,/, ''), 'base64');
  fs.writeFileSync('C:/Users/user/.gemini/antigravity/brain/ade8dcc1-6679-4d2d-8fad-e7954ecade51/verify_rust_engine_output.jpg', outBuf);
  console.log('Saved output image to verify_rust_engine_output.jpg');
}
