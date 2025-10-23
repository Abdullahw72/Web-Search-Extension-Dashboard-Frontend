import React from 'react'

const WorkshopExplore = ({ activeMenuItem }) => {
  const myAgents = [
    {
      id: 1,
      name: 'Customer Support Bot',
      description: 'Automated customer service assistant',
      status: 'Active',
      users: '1.2K',
      created: '2 weeks ago',
      category: 'Business'
    },
    {
      id: 2,
      name: 'Content Writer',
      description: 'Blog post and article writing assistant',
      status: 'Draft',
      users: '0',
      created: '3 days ago',
      category: 'Writing'
    },
    {
      id: 3,
      name: 'Language Translator',
      description: 'Multi-language translation agent',
      status: 'Active',
      users: '856',
      created: '1 month ago',
      category: 'Utility'
    }
  ]

  const templates = [
    {
      id: 1,
      name: 'Chatbot Template',
      description: 'Basic conversational AI template',
      category: 'General',
      difficulty: 'Beginner',
      uses: '5.2K'
    },
    {
      id: 2,
      name: 'Image Generator',
      description: 'AI image creation template',
      category: 'Creative',
      difficulty: 'Intermediate',
      uses: '3.8K'
    },
    {
      id: 3,
      name: 'Code Assistant',
      description: 'Programming help template',
      category: 'Development',
      difficulty: 'Advanced',
      uses: '2.1K'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500'
      case 'Draft':
        return 'bg-yellow-500'
      case 'Paused':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-600'
      case 'Intermediate':
        return 'bg-yellow-600'
      case 'Advanced':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getContent = () => {
    switch (activeMenuItem) {
      case 'create-agent':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Create New Agent</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors cursor-pointer">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-white font-semibold mb-2">Start from Scratch</h3>
                  <p className="text-gray-400 text-sm mb-4">Build a completely custom AI agent with your own configuration</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Create Agent
                  </button>
                </div>
                <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors cursor-pointer">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-white font-semibold mb-2">Use Template</h3>
                  <p className="text-gray-400 text-sm mb-4">Choose from pre-built templates to get started quickly</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Browse Templates
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'templates':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Agent Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                  <h3 className="text-white font-semibold mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">{template.category}</span>
                    <span className={`${getDifficultyColor(template.difficulty)} text-white px-2 py-1 rounded text-xs`}>
                      {template.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{template.uses} uses</span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'shared':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Shared with Me</h2>
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-white text-xl font-semibold mb-2">No shared agents yet</h3>
              <p className="text-gray-400">When someone shares an agent with you, it will appear here</p>
            </div>
          </div>
        )
      default:
        return (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Agents</h1>
                <p className="text-gray-400">Manage and monitor your AI agents</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                + Create New Agent
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Total Agents</h3>
                <p className="text-3xl font-bold text-white">3</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Active Agents</h3>
                <p className="text-3xl font-bold text-green-400">2</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-400">2.1K</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 text-sm font-medium mb-2">This Month</h3>
                <p className="text-3xl font-bold text-purple-400">+24%</p>
              </div>
            </div>

            {/* Agents List */}
            <div className="space-y-4">
              {myAgents.map((agent) => (
                <div key={agent.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">🤖</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-semibold">{agent.name}</h3>
                          <span className={`${getStatusColor(agent.status)} text-white px-2 py-1 rounded text-xs`}>
                            {agent.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-1">{agent.description}</p>
                        <div className="flex items-center space-x-4 text-gray-500 text-xs">
                          <span>{agent.category}</span>
                          <span>{agent.users} users</span>
                          <span>Created {agent.created}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-white p-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-white p-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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

export default WorkshopExplore