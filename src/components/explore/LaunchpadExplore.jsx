import React from 'react'

const LaunchpadExplore = ({ activeMenuItem }) => {
  
  const getContent = () => {
    switch (activeMenuItem) {
      case 'my-assets':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-4xl">🤖</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">My Genies</h2>
              <p className="text-xl text-gray-400">Coming Soon</p>
              <p className="text-gray-500 mt-2">Manage and monitor your AI agents from here.</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-4xl">💎</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">My Genies</h2>
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

export default LaunchpadExplore