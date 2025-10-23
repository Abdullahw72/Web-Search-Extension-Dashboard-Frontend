import React, { useState } from 'react'
import { BsSun, BsMoon } from 'react-icons/bs'
import { TokenService } from '../../services/TokenService'

const ProfileExplore = ({ activeMenuItem, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Logout function extracted from the provided code
  const handleLogout = () => {
    // Clear authentication state
    localStorage.setItem('isAuthenticated', 'false')
    
    // Clear all saved state when logging out
    localStorage.removeItem('currentPage')
    localStorage.removeItem('selectedTab')
    localStorage.removeItem('signupState')
    localStorage.removeItem('otpScreen')
    localStorage.removeItem('signinState')
    localStorage.removeItem('showWelcomeScreen')
    localStorage.removeItem('signinForgotPassword')
    localStorage.removeItem('signinOtpScreen')
    localStorage.removeItem('signinOtpScreen2')
    localStorage.removeItem('currentAuthScreen')
    
    // Clear tokens
    TokenService.clearTokens()
    
    // Call the logout callback to update parent component state
    if (onLogout) {
      onLogout()
    }
  }

  const getContent = () => {
    switch (activeMenuItem) {
      case 'settings':
        return (
          <div>
            {/* Header with border */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold pb-3" style={{ color: '#292D32', borderBottom: '1px solid #EFEDF0' }}>Settings</h1>
            </div>

            {/* Centered Settings Fields */}
            <div className="flex flex-col items-center justify-center min-h-96 space-y-6">
              <div className="w-full max-w-md space-y-6">
                
                {/* Language Field */}
                <div>
                  <div 
                    className="w-full px-4 py-3 rounded-lg flex items-center justify-between border-0 focus-within:border-2"
                    style={{ 
                      backgroundColor: '#FAFAFF',
                      borderColor: 'transparent'
                    }}
                  >
                    <span style={{ color: '#292D32' }}>Language</span>
                    <div className="flex items-center space-x-2">
                      <select 
                        className="bg-transparent border-0 focus:outline-none appearance-none"
                        style={{ color: '#292D32' }}
                        onFocus={(e) => e.target.parentElement.parentElement.style.borderColor = '#6845D1'}
                        onBlur={(e) => e.target.parentElement.parentElement.style.borderColor = 'transparent'}
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Japanese</option>
                      </select>
                      <svg 
                        className="w-4 h-4 pointer-events-none" 
                        fill="none" 
                        stroke="#6845D2" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Theme Color Field */}
                <div>
                  <div 
                    className="w-full px-4 py-3 rounded-lg flex items-center justify-between"
                    style={{ backgroundColor: '#FAFAFF' }}
                  >
                    <span style={{ color: '#292D32' }}>Theme Color</span>
                    <button 
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none"
                      style={{ backgroundColor: isDarkMode ? '#6845D2' : '#D1D5DB' }}
                      onClick={() => setIsDarkMode(!isDarkMode)}
                    >
                      <span 
                        className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'} h-4 w-4 transform rounded-full bg-white transition duration-200 flex items-center justify-center`}
                      >
                        {isDarkMode ? (
                          <BsMoon className="w-3 h-3" style={{ color: '#6845D2' }} />
                        ) : (
                          <BsSun className="w-3 h-3" style={{ color: '#D1D5DB' }} />
                        )}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Sign Out Button */}
                <div className="pt-4">
                  <button 
                    onClick={handleLogout}
                    className="w-full py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: '#E4DFF8',
                      color: '#292D32'
                    }}
                  >
                    Sign Out
                  </button>
                </div>

              </div>
            </div>
          </div>
        )
      case 'help':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-4xl">❓</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Help Center</h2>
              <p className="text-xl text-gray-400">Coming Soon</p>
              <p className="text-gray-500 mt-2">We're working on comprehensive help resources for you.</p>
            </div>
          </div>
        )
      case 'terms':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-4xl">📄</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Terms of Service</h2>
              <p className="text-xl text-gray-400">Coming Soon</p>
              <p className="text-gray-500 mt-2">Our legal team is preparing the terms and conditions.</p>
            </div>
          </div>
        )
      case 'privacy':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-4xl">🔒</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Privacy Policy</h2>
              <p className="text-xl text-gray-400">Coming Soon</p>
              <p className="text-gray-500 mt-2">We're crafting a comprehensive privacy policy to protect your data.</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-4xl">⚙️</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Profile Settings</h2>
              <p className="text-gray-400">Select a menu item from the left to get started.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      {getContent()}
    </div>
  )
}

export default ProfileExplore