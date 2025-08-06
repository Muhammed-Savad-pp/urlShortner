import { useState, useEffect } from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGlitching, setIsGlitching] = useState(false);

  const navigate = useNavigate()  

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 20,
        y: (e.clientY - window.innerHeight / 2) / 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Glitch effect trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGoHome = () => {
    navigate('/')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0e0d0d] to-gray-800 flex items-center justify-center relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div 
          className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-grid-pattern"></div>
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        
        {/* 404 Number with Glitch Effect */}
        <div className="mb-8 relative">
          <h1 
            className={`text-8xl md:text-[6rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 select-none ${
              isGlitching ? 'animate-pulse filter blur-sm' : ''
            }`}
            style={{
              textShadow: isGlitching ? '2px 2px 0px #ef4444, -2px -2px 0px #3b82f6' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            404
          </h1>
          
          {/* Glitch overlay */}
          {isGlitching && (
            <h1 className="absolute inset-0 text-5xl md:text-[6rem] font-black text-red-500 opacity-50 animate-ping">
              404
            </h1>
          )}
        </div>

        {/* Main Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <AlertTriangle className="text-yellow-500 animate-bounce" size={36} />
            Oops! Page Not Found
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Looks like you've ventured into uncharted digital territory. The page you're looking for seems to have vanished into the void.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
         
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 border border-gray-600 hover:border-gray-500"
          >
            <Home size={20} />
            Go Home
          </button>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-1/3 right-10 opacity-20">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-20">
          <div className="w-1 h-1 bg-green-300 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
