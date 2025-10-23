import React, { useEffect, useState, useRef, useCallback } from 'react'
import ApiRequest from '../../services/ApiRequest'
import AriImg from '../../assets/Ari.png'
import AvaImg from '../../assets/Ava.png'
import BillyImg from '../../assets/Billy.png'
import BlixieImg from '../../assets/Blixie.png'
import EmilyImg from '../../assets/Emily.png'
import OGImg from '../../assets/OG.png'
import RyanImg from '../../assets/Ryan.png'
import SobeImg from '../../assets/Sobe.png'
import SultanImg from '../../assets/Sultan.png'
import Unamed1Img from '../../assets/unamed.png'
import Unamed2Img from '../../assets/Unamed2.png'
import Unamed3Img from '../../assets/Unamed3.png'

const ChatExplore = ({ activeMenuItem }) => {
  // Avatar images array
  const avatarImages = [
    AriImg, AvaImg, BillyImg, BlixieImg, EmilyImg, OGImg, 
    RyanImg, SobeImg, SultanImg, Unamed1Img, Unamed2Img, Unamed3Img
  ]

  // Function to get random avatars for a team
  const getRandomAvatars = (teamSize, taskId) => {
    // Use taskId as seed for consistent randomization per task
    const seed = taskId * 9301 + 49297 % 233280
    const randomArray = []
    for (let i = 0; i < teamSize; i++) {
      const index = (seed + i * 7) % avatarImages.length
      randomArray.push(avatarImages[index])
    }
    return randomArray
  }

  // Jobs fetched from API
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Real-time update state
  const [lastUpdateTime, setLastUpdateTime] = useState(null)
  const [isPolling, setIsPolling] = useState(false)
  const pollingIntervalRef = useRef(null)
  const jobDetailsIntervalRef = useRef(null)
  const lastTasksHashRef = useRef('')
  const lastJobDetailsHashRef = useRef('')

  // Map genie names to avatar images
  const genieImageMap = {
    // Example mapping provided by user
    'lead_generation': BillyImg,
  }

  const getGenieImages = (genieArray) => {
    if (!Array.isArray(genieArray) || genieArray.length === 0) return [Unamed1Img]
    const images = genieArray.map((g) => {
      const key = (g?.name || '').toLowerCase()
      return genieImageMap[key] || Unamed1Img
    })
    return images
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    let hours = d.getHours()
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    return `${mm}/${dd} ${hours}:${minutes} ${ampm}`
  }

  // Generate hash for data comparison
  const generateDataHash = (data) => {
    return JSON.stringify(data, Object.keys(data).sort())
  }

  // Smart data fetching with change detection
  const fetchJobsData = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
    setLoading(true)
    setError('')
      }

      const response = await new Promise((resolve) => {
    ApiRequest.getJobs({}, (res) => {
          resolve(res)
        })
      })

      if (response?.isSuccess) {
        const apiData = Array.isArray(response.data?.data) ? response.data.data : []
        const mapped = apiData.map((item, index) => {
          const genieImages = getGenieImages(item?.genie)
          return {
            id: item?.job_id || index,
            taskList: item?.name || 'Untitled Task',
            taskDescription: item?.description || item?.taskDescription || '',
            status: item?.status || 'In Progress',
            date: formatDate(item?.updatedAt),
            updatedAt: item?.updatedAt || '',
            genieImages,
          }
        })
        
        // Sort by updatedAt
        mapped.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        
        // Check if data has actually changed
        const newHash = generateDataHash(mapped)
        if (newHash !== lastTasksHashRef.current) {
          lastTasksHashRef.current = newHash
        setTasks(mapped)
          setLastUpdateTime(new Date().toISOString())
          console.log('Tasks updated:', new Date().toLocaleTimeString())
        }

        if (isInitialLoad) {
          setLoading(false)
        }
      } else {
        if (isInitialLoad) {
          setError(response?.error || 'Failed to load tasks')
        setTasks([])
          setLoading(false)
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      if (isInitialLoad) {
        setError('Failed to load tasks')
        setLoading(false)
      }
    }
  }, [])

  // Smart job details fetching with change detection
  const fetchJobDetailsData = useCallback(async (jobId, isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setJobDetailLoading(true)
      }

      const response = await new Promise((resolve) => {
        ApiRequest.getJobDetails(jobId, (res) => {
          resolve(res)
        })
      })

      if (response?.isSuccess) {
        const newDetails = response.data?.data || null
        
        // Check if data has actually changed
        const newHash = generateDataHash(newDetails)
        if (newHash !== lastJobDetailsHashRef.current) {
          lastJobDetailsHashRef.current = newHash
          setJobDetail(newDetails)
          console.log('Job details updated:', new Date().toLocaleTimeString())
        }

        if (isInitialLoad) {
          setJobDetailLoading(false)
        }
      } else {
        if (isInitialLoad) {
          setJobDetail(null)
          setJobDetailLoading(false)
        }
      }
    } catch (error) {
      console.error('Error fetching job details:', error)
      if (isInitialLoad) {
        setJobDetail(null)
        setJobDetailLoading(false)
      }
    }
  }, [])

  // Initialize data and start polling
  useEffect(() => {
    // Initial load
    fetchJobsData(true)
    
    // Start smart polling every 3 seconds
    setIsPolling(true)
    pollingIntervalRef.current = setInterval(() => {
      fetchJobsData(false)
    }, 3000)

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
      if (jobDetailsIntervalRef.current) {
        clearInterval(jobDetailsIntervalRef.current)
      }
    }
  }, [fetchJobsData])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7
  
  // Popup state
  const [selectedTask, setSelectedTask] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [jobDetail, setJobDetail] = useState(null)
  const [jobDetailLoading, setJobDetailLoading] = useState(false)
  
  const totalPages = Math.ceil(tasks.length / itemsPerPage || 1)

  // Handle task click
  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowPopup(true)
    setJobDetail(null)
    
    // Initial load of job details
    fetchJobDetailsData(task.id, true)
    
    // Start polling for job details updates
    if (jobDetailsIntervalRef.current) {
      clearInterval(jobDetailsIntervalRef.current)
    }
    
    jobDetailsIntervalRef.current = setInterval(() => {
      fetchJobDetailsData(task.id, false)
    }, 3000)
  }

  // Close popup
  const closePopup = () => {
    // Stop job details polling
    if (jobDetailsIntervalRef.current) {
      clearInterval(jobDetailsIntervalRef.current)
      jobDetailsIntervalRef.current = null
    }
    
    setShowPopup(false)
    setSelectedTask(null)
    setJobDetail(null)
    lastJobDetailsHashRef.current = '' // Reset hash for next time
  }

  // Get current page data
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = tasks.slice(startIndex, endIndex)

  // Status dot color mapping (case-insensitive, supports common API values)
  const getStatusDotColor = (status) => {
    const s = (status || '').toString().toLowerCase()
    switch (s) {
      case 'completed':
      case 'success':
        return '#45E52F'
      case 'in progress':
      case 'in_progress':
      case 'running':
      case 'processing':
        return '#F9DE17'
      case 'requires action':
      case 'requires_action':
      case 'failed':
      case 'error':
      case 'cancelled':
        return '#EF6464'
      default:
        return '#6B7280'
    }
  }

  // Status dot border color mapping
  const getStatusDotBorderColor = (status) => {
    const s = (status || '').toString().toLowerCase()
    switch (s) {
      case 'completed':
      case 'success':
        return '#C4FFD1'
      case 'in progress':
      case 'in_progress':
      case 'running':
      case 'processing':
        return '#FFF7B9'
      case 'requires action':
      case 'requires_action':
      case 'failed':
      case 'error':
      case 'cancelled':
        return '#FFC4C4'
      default:
        return '#E5E7EB'
    }
  }
  const featuredAgents = [
    {
      id: 1,
      name: 'AI Writing Assistant',
      description: 'Help with writing, editing, and content creation',
      category: 'Productivity',
      users: '12.5K',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Code Mentor',
      description: 'Programming help and code review assistant',
      category: 'Development',
      users: '8.2K',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Language Tutor',
      description: 'Learn languages through conversation',
      category: 'Education',
      users: '15.1K',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
    }
  ]

  const recentChats = [
    { id: 1, agent: 'AI Writing Assistant', lastMessage: 'Can you help me write a blog post about...', time: '2 min ago' },
    { id: 2, agent: 'Code Mentor', lastMessage: 'How do I optimize this React component?', time: '1 hour ago' },
    { id: 3, agent: 'Language Tutor', lastMessage: 'Let\'s practice Spanish conversation', time: '3 hours ago' }
  ]

  const getContent = () => {
    switch (activeMenuItem) {
      case 'recent-chats':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#292D32' }}>Recent Chats</h2>
            <div className="space-y-4">
              {recentChats.map((chat) => (
                <div key={chat.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6845D2' }}>
                        <span className="text-white text-sm font-medium">AI</span>
                      </div>
                      <div>
                        <h3 className="font-medium" style={{ color: '#292D32' }}>{chat.agent}</h3>
                        <p className="text-gray-500 text-sm">{chat.lastMessage}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs">{chat.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'favorites':
        return (
          <div>
            <h2 className="text-2xl font-bold text-text mb-6">Favorite Agents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAgents.map((agent) => (
                <div key={agent.id} className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors">
                  <img src={agent.image} alt={agent.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-text font-semibold mb-2">{agent.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{agent.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-primary text-white px-2 py-1 rounded text-xs">{agent.category}</span>
                      <div className="flex items-center space-x-2 text-gray-500 text-xs">
                        <span>{agent.users} users</span>
                        <span>⭐ {agent.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return (
          <div>
            {/* Header with border */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold pb-3" style={{ color: '#292D32', borderBottom: '1px solid #EFEDF0' }}>All</h1>
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-6 flex justify-end space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-48 px-3 py-2 pr-10 rounded-lg border-0 focus:outline-none focus:ring-0 focus:border-2"
                  style={{ 
                    backgroundColor: '#FAFAFF',
                    color: '#292D32',
                    borderColor: 'transparent'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6845D1'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
                <svg 
                  className="absolute right-3 top-2.5 w-4 h-4" 
                  fill="none" 
                  stroke="#6845D2" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="relative">
                <select 
                  className="w-48 px-3 py-2 pr-8 rounded-lg border-0 focus:outline-none focus:ring-0 focus:border-2 appearance-none"
                  style={{ 
                    backgroundColor: '#FAFAFF',
                    color: '#292D32',
                    borderColor: 'transparent'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6845D1'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                >
                  <option>All</option>
                  <option>Completed</option>
                  <option>In Progress</option>
                  <option>Requires Action</option>
                </select>
                <svg 
                  className="absolute right-3 top-3 w-4 h-4 pointer-events-none" 
                  fill="none" 
                  stroke="#6845D2" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#8C8F95', width: '40%' }}>Task List</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#8C8F95' }}>G-Team</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#8C8F95' }}>Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#8C8F95' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm" style={{ color: '#5F6062' }}>
                          Loading...
                        </td>
                      </tr>
                    )}
                    {!loading && currentData.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm" style={{ color: '#5F6062' }}>
                          No active tasks
                        </td>
                      </tr>
                    )}
                    {!loading && currentData.map((task, index) => (
                      <tr key={task.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: '#292D32', fontSize: '15px' }}>
                          <div 
                            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleTaskClick(task)}
                          >
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: '#6845D2' }}
                            />
                            <span 
                              className="truncate max-w-xs"
                              title={task.taskList}
                            >
                              {task.taskList ? task.taskList.charAt(0).toUpperCase() + task.taskList.slice(1) : ''}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center -space-x-2">
                            {(task.genieImages || []).slice(0, 4).map((avatar, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm relative z-10"
                                style={{ zIndex: 10 - i }}
                              >
                                <img 
                                  src={avatar} 
                                  alt={`Team member ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {(task.genieImages && task.genieImages.length > 4) && (
                              <div
                                className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm relative"
                                style={{ zIndex: 5 }}
                              >
                                +{task.genieImages.length - 4}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full border-4"
                              style={{ 
                                backgroundColor: getStatusDotColor(task.status),
                                borderColor: getStatusDotBorderColor(task.status)
                              }}
                            />
                            <span style={{ color: '#000000' }}>
                              {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : ''}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#5F6062' }}>
                          {task.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center text-sm" style={{ color: '#5F6062' }}>
                  <span>
                    {tasks.length > 0 ? (
                      <>{startIndex + 1} to {Math.min(endIndex, tasks.length)} of {tasks.length} records</>
                    ) : (
                      <>No records</>
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    style={{ color: currentPage === 1 ? '#B7B7B7' : '#292D32' }}
                  >
                    &lt;
                  </button>
                  
                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        style={{ color: '#292D32' }}
                      >
                        1
                      </button>
                      {currentPage > 4 && <span className="px-2 text-gray-400">...</span>}
                    </>
                  )}
                  
                  {/* Show pages around current page */}
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    
                    if (pageNum < 1 || pageNum > totalPages) return null;
                    
                    return (
                    <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                          currentPage === pageNum
                          ? 'text-white border-transparent'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      style={{
                          backgroundColor: currentPage === pageNum ? '#6845D2' : 'transparent',
                          color: currentPage === pageNum ? 'white' : '#292D32'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {/* Show last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-2 text-gray-400">...</span>}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        style={{ color: '#292D32' }}
                      >
                        {totalPages}
                    </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    style={{ color: currentPage === totalPages ? '#B7B7B7' : '#292D32' }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="px-6 pt-4 pb-6 h-full relative">
      {getContent()}
      
      {/* Task Popup */}
      {showPopup && selectedTask && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div 
            className="rounded-lg p-6 w-5/6 h-5/6 relative shadow-lg border-2 flex flex-col"
            style={{ backgroundColor: '#FAFAFF', borderColor: '#E4DFF8' }}
          >
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#6845D2' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Task heading with proper formatting */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-medium mb-2 text-primary font-primary">
                {selectedTask.taskList ? selectedTask.taskList.charAt(0).toUpperCase() + selectedTask.taskList.slice(1) : ''}
              </h2>
              {selectedTask.taskDescription && (
                <p className="text-sm font-primary" style={{ color: '#6B6B6C' }}>
                  {selectedTask.taskDescription}
                </p>
              )}
            </div>

            {/* Genie images */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                {(selectedTask.genieImages || []).slice(0, 6).map((avatar, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm"
                  >
                    <img 
                      src={avatar} 
                      alt={`Genie ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {(selectedTask.genieImages && selectedTask.genieImages.length > 6) && (
                  <div
                    className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm"
                  >
                    +{selectedTask.genieImages.length - 6}
                  </div>
                )}
              </div>
            </div>

            {/* Boxes Container */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {/* Two-column boxes: To-dos and Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
                {/* To-dos box */}
                <div 
                  className="rounded-lg shadow-md overflow-hidden flex flex-col"
                  style={{ backgroundColor: '#F6FEFF' }}
                >
                  <div 
                    className="px-4 py-3 font-semibold text-sm"
                    style={{ backgroundColor: '#D0F8EA', color: '#292D32' }}
                  >
                    To-Do
                  </div>
                  <div 
                    className="flex-1 px-4 pb-4 pt-2 overflow-y-auto"
                    style={{ maxHeight: '150px' }}
                  >
                  {jobDetailLoading && (
                    <p className="text-sm" style={{ color: '#5F6062' }}>Loading...</p>
                  )}
                  {!jobDetailLoading && (!jobDetail?.steps || jobDetail?.steps?.length === 0) && (
                    <p className="text-sm" style={{ color: '#5F6062' }}>No steps</p>
                  )}
                  {!jobDetailLoading && Array.isArray(jobDetail?.steps) && jobDetail.steps.map((step, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="text-sm font-bold mb-2" style={{ color: '#292D32' }}>{step?.step_name || 'Step'}</div>
                      <div className="space-y-2">
                        {Array.isArray(step?.substeps) && step.substeps.map((sub, sidx) => (
                            <label key={sidx} className="flex items-start space-x-2 text-sm" style={{ color: '#6B6B6C' }}>
                              <input 
                                type="checkbox" 
                                className="mt-1" 
                                style={{ accentColor: '#6F8676' }}
                              />
                            <span>{sub?.subStepName || ''}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>

                {/* Schedule box */}
                <div 
                  className="rounded-lg shadow-md overflow-hidden flex flex-col"
                  style={{ backgroundColor: '#FFFBF4' }}
                >
                  <div 
                    className="px-4 py-3 font-semibold text-sm"
                    style={{ backgroundColor: '#FFF0D9', color: '#292D32' }}
                  >
                    Schedule
                  </div>
                  <div 
                    className="flex-1 px-4 pb-4 pt-2 overflow-y-auto"
                    style={{ maxHeight: '150px' }}
                  >
                  {jobDetailLoading && (
                    <p className="text-sm" style={{ color: '#5F6062' }}>Loading...</p>
                  )}
                  {!jobDetailLoading && (!jobDetail?.steps || jobDetail?.steps?.length === 0) && (
                    <p className="text-sm" style={{ color: '#5F6062' }}>No schedule</p>
                  )}
                  {!jobDetailLoading && Array.isArray(jobDetail?.steps) && (
                    <ul className="space-y-2">
                      {jobDetail.steps.map((step, idx) => (
                          <li key={idx} className="text-sm flex items-start justify-between pb-2" style={{ borderBottom: idx < jobDetail.steps.length - 1 ? '1px solid #EEEEEE' : 'none' }}>
                          <span className="font-medium" style={{ color: '#292D32' }}>{step?.step_name || 'Step'}</span>
                          <span className="ml-4" style={{ color: '#5F6062' }}>{formatDate(step?.updated_at)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  </div>
                </div>
              </div>

              {/* Output box */}
              <div 
                className="rounded-lg shadow-md overflow-hidden flex flex-col"
                style={{ backgroundColor: '#EEF7FF' }}
              >
                <div 
                  className="px-4 py-3 font-semibold text-sm"
                  style={{ backgroundColor: '#DAEEFF', color: '#292D32' }}
                >
                  Output
                </div>
                <div 
                  className="flex-1 px-4 pb-4 pt-2 overflow-y-auto"
                  style={{ maxHeight: '250px' }}
                >
                {jobDetailLoading && (
                  <p className="text-sm" style={{ color: '#5F6062' }}>Loading...</p>
                )}
                {!jobDetailLoading && jobDetail && (
                  <div className="space-y-2 text-sm" style={{ color: '#292D32' }}>
                    {(() => {
                      const outputs = []
                      if (Array.isArray(jobDetail?.steps)) {
                        jobDetail.steps.forEach((st) => {
                          if (Array.isArray(st?.substeps)) {
                            st.substeps.forEach((sb) => {
                              if (Array.isArray(sb?.output)) {
                                sb.output.forEach((o) => outputs.push(o))
                              }
                            })
                          }
                        })
                      }
                      if (outputs.length === 0) return <p className="text-sm" style={{ color: '#5F6062' }}>No output</p>
                      return outputs.map((o, i) => {
                        const type = o?.type || ''
                        const data = o?.data
                        if (type === 'url' && typeof data === 'string') {
                          return (
                            <div key={i}>
                              <a href={data} target="_blank" rel="noreferrer" className="underline" style={{ color: '#1D4ED8' }}>
                                {data}
                              </a>
                            </div>
                          )
                        }
                        try {
                          return <pre key={i} className="whitespace-pre-wrap break-words">{JSON.stringify(o, null, 2)}</pre>
                        } catch (e) {
                          return <div key={i}>{String(data)}</div>
                        }
                      })
                    })()}
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatExplore