import React from 'react'
import ChatExplore from './explore/ChatExplore'
import ProfileExplore from './explore/ProfileExplore'
import LaunchpadExplore from './explore/LaunchpadExplore'

const ExploreSection = ({ activeSection, activeMenuItem, onLogout }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'chat':
        return <ChatExplore activeMenuItem={activeMenuItem} />
      case 'profile':
        return <ProfileExplore activeMenuItem={activeMenuItem} onLogout={onLogout} />
      case 'launchpad':
        return <LaunchpadExplore activeMenuItem={activeMenuItem} />
      default:
        return <ChatExplore activeMenuItem={activeMenuItem} />
    }
  }

  return (
    <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-hide">
        {renderContent()}
      </div>
    </div>
  )
}

export default ExploreSection