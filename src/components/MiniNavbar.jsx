import React from 'react'
import { BsListTask } from 'react-icons/bs'
import { RiRobot2Line } from 'react-icons/ri'
import { AiOutlineUser } from 'react-icons/ai'
import askGenieMainLogo from '../assets/GenieLogo.png'

const MiniNavbar = ({ activeSection, setActiveSection, setActiveMenuItem }) => {
  const mainNavItems = [
    {
      id: 'chat',
      icon: <BsListTask className="w-6 h-6" />,
      name: 'Tasks'
    },
    {
      id: 'launchpad',
      icon: <RiRobot2Line className="w-6 h-6" />,
      name: 'Genies'
    }
  ]

  const bottomNavItems = [
    {
      id: 'profile',
      icon: <AiOutlineUser className="w-6 h-6" />,
      name: 'Profile'
    }
  ]

  const handleItemClick = (itemId) => {
    setActiveSection(itemId)
    // Set default active menu item based on section
    switch (itemId) {
      case 'chat':
        setActiveMenuItem('new-chat')
        break
      case 'profile':
        setActiveMenuItem('settings')
        break
      case 'launchpad':
        setActiveMenuItem('my-assets')
        break
      default:
        setActiveMenuItem(null)
    }
  }

  const NavItem = ({ item, isActive, onClick }) => (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onClick(item.id)}
        className={`flex items-center justify-center transition-all duration-200 ${
          item.id === 'profile' ? 'w-10 h-10 rounded-full' : 'w-12 h-12 rounded-lg'
        }`}
        style={{ 
          color: isActive ? '#6845D2' : '#B7A6E9',
          backgroundColor: item.id === 'profile' ? '#EEEBFB' : 'transparent'
        }}
      >
        {item.icon}
      </button>
      <span 
        className="text-xs mt-0 transition-colors duration-200"
        style={{ 
          color: isActive ? '#6845D2' : '#B7A6E9',
          fontWeight: isActive ? '500' : '400'
        }}
      >
        {item.name}
      </span>
    </div>
  )

  return (
    <div className="flex flex-col h-full py-6">
      {/* Logo */}
      <div className="flex justify-center mb-12">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'transparent' }}>
          <img 
            src={askGenieMainLogo} 
            alt="AskGenie Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col space-y-6 px-2">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeSection === item.id}
            onClick={handleItemClick}
          />
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Navigation */}
      <div className="flex flex-col space-y-6 px-2">
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeSection === item.id}
            onClick={handleItemClick}
          />
        ))}
      </div>
    </div>
  )
}

export default MiniNavbar