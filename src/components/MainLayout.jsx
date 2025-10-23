import React, { useState, useEffect } from 'react'
import MiniNavbar from './MiniNavbar'
import SecondaryMenu from './SecondaryMenu'
import ExploreSection from './ExploreSection'
import WelcomeScreen from './WelcomeScreen'
import LoginScreen from './LoginScreen'
import { TokenService } from '../services/TokenService'

const MainLayout = () => {
  const [activeSection, setActiveSection] = useState('chat')
  const [activeMenuItem, setActiveMenuItem] = useState('new-chat')
  const [showWelcome, setShowWelcome] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = TokenService.getAccessToken()
      const refreshToken = TokenService.getRefreshToken()
      
      if (accessToken && refreshToken) {
        setIsAuthenticated(true)
        setShowWelcome(false)
        setShowLogin(false)
      } else {
        // Show welcome screen first, then login
        setShowWelcome(true)
        setIsAuthenticated(false)
      }
    }

    checkAuthStatus()
  }, [])

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    setShowLogin(true)
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setShowLogin(false)
    setShowWelcome(false)
  }

  const handleLogout = () => {
    TokenService.clearTokens()
    setIsAuthenticated(false)
    setShowWelcome(true)
    setShowLogin(false)
  }

  // Show welcome screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {/* Mini Navbar */}
          <div className="w-20 bg-white border-r border-gray-200 flex-shrink-0">
            <MiniNavbar 
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              setActiveMenuItem={setActiveMenuItem}
            />
          </div>

          {/* Welcome Screen - occupies remaining space (secondary menu + explore section area) */}
          <div className="flex-1 overflow-hidden">
            <WelcomeScreen onComplete={handleWelcomeComplete} />
          </div>
        </div>
      </div>
    )
  }

  // Show login screen
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {/* Mini Navbar */}
          <div className="w-20 bg-white border-r border-gray-200 flex-shrink-0">
            <MiniNavbar 
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              setActiveMenuItem={setActiveMenuItem}
            />
          </div>

          {/* Login Screen - occupies remaining space (secondary menu + explore section area) */}
          <div className="flex-1 overflow-hidden">
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>
    )
  }

  // Show main app (authenticated)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Mini Navbar */}
        <div className="w-20 bg-white border-r border-gray-200 flex-shrink-0">
          <MiniNavbar 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setActiveMenuItem={setActiveMenuItem}
          />
        </div>
        
        {/* Secondary Menu */}
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
          <SecondaryMenu 
            activeSection={activeSection}
            activeMenuItem={activeMenuItem}
            setActiveMenuItem={setActiveMenuItem}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <ExploreSection 
            activeSection={activeSection}
            activeMenuItem={activeMenuItem}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </div>
  )
}

export default MainLayout