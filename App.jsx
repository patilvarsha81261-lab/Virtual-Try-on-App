import React, { useState } from 'react';
import WebcamView from './components/WebcamView.jsx';
import PhotoTryOn from './components/PhotoTryOn.jsx';
import GarmentPicker from './components/GarmentPicker.jsx';

export default function App() {
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [mode, setMode] = useState('live'); // 'live' | 'photo'

  return (
    <div className="app">
      <header className="app-header">
        <h1>Virtual Try-On</h1>
        <p>
          {mode === 'live'
            ? 'Real-time overlay: pick a garment, step in front of your camera.'
            : 'AI photorealistic render: take/upload a photo, pick a garment, generate the result.'}
        </p>
        <div className="mode-toggle">
          <button className={mode === 'live' ? 'active' : ''} onClick={() => setMode('live')}>
            Live overlay
          </button>
          <button className={mode === 'photo' ? 'active' : ''} onClick={() => setMode('photo')}>
            AI photo try-on
          </button>
        </div>
      </header>
      <main className="app-main">
        {mode === 'live' ? (
          <WebcamView selectedGarment={selectedGarment} />
        ) : (
          <PhotoTryOn selectedGarment={selectedGarment} />
        )}
        <GarmentPicker selectedGarment={selectedGarment} onSelect={setSelectedGarment} />
      </main>
    </div>
  );
}
