import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }
    if (username !== 'TP01' || password !== 'TP01') {
      setError('Incorrect credentials');
      return;
    }
    setError(null);
    sessionStorage.setItem('tp01_auth', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background video with fallback */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadStart={() => console.log('Video loading started')}
        onCanPlay={() => console.log('Video can play')}
        onLoadedData={() => console.log('Video data loaded')}
        onError={(e) => {
          console.log('Video error:', e);
          console.log('Video src:', e.currentTarget.src);
          console.log('Video networkState:', e.currentTarget.networkState);
          console.log('Video readyState:', e.currentTarget.readyState);
          // Hide video and show animated background
          e.currentTarget.style.display = 'none';
          const fallback = document.getElementById('fallback-bg');
          if (fallback) fallback.style.display = 'block';
        }}
      >
        <source src="https://invastop.vercel.app/forest.mp4" type="video/mp4" />
        <source src="/forest.mp4" type="video/mp4" />
        <source src="/forest.mov" type="video/quicktime" />
        Your browser does not support the video tag.
      </video>
      {/* Animated fallback background */}
      <div id="fallback-bg" className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700" style={{ display: 'none' }}>
        {/* Animated tree silhouettes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-10 w-8 h-32 bg-green-900 transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-0 left-32 w-6 h-24 bg-green-900 transform -rotate-6 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-64 w-10 h-40 bg-green-900 transform rotate-3 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 right-20 w-7 h-28 bg-green-900 transform -rotate-12 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-0 right-48 w-9 h-36 bg-green-900 transform rotate-8 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-0 right-80 w-5 h-20 bg-green-900 transform -rotate-3 animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        </div>
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-300 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-200 rounded-full animate-bounce opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-green-300 rounded-full animate-bounce opacity-30" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Page logo top-left */}
      <img
        src="/Invastop-Logo.png"
        alt="InvaStop"
        className="absolute top-6 left-6 z-10 h-64 w-64 object-contain drop-shadow-xl"
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="relative w-full max-w-md bg-white/20 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 border border-white/30">
        <div className="mb-6 mt-4 text-center">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white drop-shadow-md mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-lg border border-white/50 bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white drop-shadow-md mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-white/50 bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-200 bg-red-900/30 px-3 py-2 rounded-lg border border-red-500/30 backdrop-blur-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continue
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default LoginPage;


