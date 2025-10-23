import React from 'react'
import { CgGoogleTasks } from 'react-icons/cg'
import { MdHelpOutline } from 'react-icons/md'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { MdOutlinePrivacyTip } from 'react-icons/md'
import { RiRobot2Line } from 'react-icons/ri'

const SecondaryMenu = ({ activeSection, activeMenuItem, setActiveMenuItem }) => {
  const menuData = {
    chat: {
      title: 'Tasks',
      items: [
        { id: 'new-chat', label: 'All', icon: <CgGoogleTasks className="w-5 h-5 p-1 border border-black rounded" /> }
      ]
    },
    profile: {
      title: 'Profile',
      items: [
        { id: 'settings', label: 'Settings', icon: '⚙️' },
        { id: 'help', label: 'Help', icon: <MdHelpOutline className="w-5 h-5 p-1 border border-black rounded" /> },
        { id: 'terms', label: 'Terms of Service', icon: <HiOutlineDocumentText className="w-5 h-5 p-1 border border-black rounded" /> },
        { id: 'privacy', label: 'Privacy Policy', icon: <MdOutlinePrivacyTip className="w-5 h-5 p-1 border border-black rounded" /> }
      ]
    },
    launchpad: {
      title: 'Genies',
      items: [
        { id: 'my-assets', label: 'My Genies', icon: <RiRobot2Line className="w-5 h-5 p-1 border border-black rounded" /> }
      ]
    }
  }

  const currentMenu = menuData[activeSection] || menuData.chat

  return (
    <div className="flex flex-col h-full bg-background-secondary">
      {/* Header */}
      <div className="p-6 border-b border-light">
        <h2 className="text-xl font-semibold mb-4 text-primary font-primary">{currentMenu.title}</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="input-field pl-4 pr-10"
          />
          <svg className="absolute right-3 top-2.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-custom">
        <div className="space-y-2">
          {currentMenu.items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenuItem(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-fast font-primary ${
                activeMenuItem === item.id 
                  ? 'bg-primary-light text-primary' 
                  : 'text-secondary hover:bg-primary-light'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Additional Content Based on Section */}

        {activeSection === 'launchpad' && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-tertiary uppercase tracking-wide mb-3 font-primary">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn-primary w-full">
                + Create Genie
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg transition-fast text-primary font-primary">
                My Genies
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SecondaryMenu