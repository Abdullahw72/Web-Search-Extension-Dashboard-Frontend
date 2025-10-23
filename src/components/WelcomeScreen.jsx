import React, { useState, useEffect } from 'react'

const WelcomeScreen = ({ onComplete }) => {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setShowText(true)
    }, 100)

    // Complete after 5 seconds
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200 rounded-full blur-2xl"></div>
      </div>

      {/* Welcome Text */}
      <div className="text-center z-10">
        <h1 
          className={`text-4xl font-bold transition-all duration-1000 ease-out ${
            showText 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
          style={{ color: '#6845D2' }}
        >
          Welcome to Genieverse INC
        </h1>
        
        {/* Subtitle */}
        <p 
          className={`text-lg mt-4 transition-all duration-1200 ease-out delay-300 ${
            showText 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
          }`}
          style={{ color: '#8C8F95' }}
        >
          Your AI-powered assistant awaits
        </p>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                showText ? 'bg-purple-400' : 'bg-gray-300'
              }`}
              style={{
                animationDelay: `${i * 200}ms`,
                animation: showText ? 'pulse 1.5s infinite' : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
