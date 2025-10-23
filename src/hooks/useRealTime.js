/**
 * React hook for real-time data updates
 * Provides easy integration with WebSockets, SSE, or optimized polling
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import realTimeService from './RealTimeService'

// Hook for real-time jobs list updates
export const useRealTimeJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const unsubscribeRef = useRef(null)

  // Optimized update function that only changes what's different
  const updateJobs = useCallback((newJobs) => {
    setJobs(prevJobs => {
      // If it's the first load or jobs array is empty, replace entirely
      if (prevJobs.length === 0) {
        return newJobs
      }

      // Otherwise, merge intelligently
      const updatedJobs = [...prevJobs]
      let hasChanges = false

      newJobs.forEach(newJob => {
        const existingIndex = updatedJobs.findIndex(job => job.id === newJob.id)
        
        if (existingIndex === -1) {
          // New job - add it
          updatedJobs.push(newJob)
          hasChanges = true
        } else {
          // Existing job - check if it changed
          const existingJob = updatedJobs[existingIndex]
          if (JSON.stringify(existingJob) !== JSON.stringify(newJob)) {
            updatedJobs[existingIndex] = newJob
            hasChanges = true
          }
        }
      })

      // Remove jobs that are no longer in the list
      const newJobIds = newJobs.map(job => job.id)
      const filteredJobs = updatedJobs.filter(job => newJobIds.includes(job.id))
      
      if (filteredJobs.length !== updatedJobs.length) {
        hasChanges = true
        return filteredJobs
      }

      return hasChanges ? updatedJobs : prevJobs
    })
  }, [])

  useEffect(() => {
    // Subscribe to jobs updates
    const unsubscribeJobs = realTimeService.subscribe('jobs_update', updateJobs)
    const unsubscribeConnection = realTimeService.subscribe('connection', (status) => {
      setConnectionStatus(status.status)
    })

    unsubscribeRef.current = () => {
      unsubscribeJobs()
      unsubscribeConnection()
    }

    // Initial load
    setLoading(true)
    // You would call your initial API here
    // fetchInitialJobs().then(data => {
    //   updateJobs(data)
    //   setLoading(false)
    // })

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [updateJobs])

  return {
    jobs,
    loading,
    error,
    connectionStatus,
    updateJobs
  }
}

// Hook for real-time job details updates
export const useRealTimeJobDetails = (jobId) => {
  const [jobDetails, setJobDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const unsubscribeRef = useRef(null)

  const updateJobDetails = useCallback((newDetails) => {
    setJobDetails(prevDetails => {
      // If it's the first load or details are null, replace entirely
      if (!prevDetails) {
        return newDetails
      }

      // Check if details actually changed
      if (JSON.stringify(prevDetails) !== JSON.stringify(newDetails)) {
        return newDetails
      }

      return prevDetails
    })
  }, [])

  useEffect(() => {
    if (!jobId) return

    // Subscribe to specific job updates
    const unsubscribeJobDetails = realTimeService.subscribe(`job_details_${jobId}`, updateJobDetails)

    unsubscribeRef.current = unsubscribeJobDetails

    // Initial load
    setLoading(true)
    // You would call your initial API here
    // fetchJobDetails(jobId).then(data => {
    //   updateJobDetails(data)
    //   setLoading(false)
    // })

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [jobId, updateJobDetails])

  return {
    jobDetails,
    loading,
    error,
    updateJobDetails
  }
}

// Hook for connection management
export const useRealTimeConnection = () => {
  const [status, setStatus] = useState(realTimeService.getConnectionStatus())
  const unsubscribeRef = useRef(null)

  useEffect(() => {
    const unsubscribe = realTimeService.subscribe('connection', (connectionData) => {
      setStatus(realTimeService.getConnectionStatus())
    })

    unsubscribeRef.current = unsubscribe

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [])

  const connect = useCallback((url, type = 'websocket') => {
    if (type === 'websocket') {
      realTimeService.connectWebSocket(url)
    } else if (type === 'sse') {
      realTimeService.connectSSE(url)
    }
  }, [])

  const disconnect = useCallback(() => {
    realTimeService.disconnect()
  }, [])

  return {
    status,
    connect,
    disconnect
  }
}

// Optimized polling hook (fallback option)
export const useOptimizedPolling = (fetchFunction, interval = 3000, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const lastFetchRef = useRef(null)
  const intervalRef = useRef(null)

  const fetchData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true)
      }

      const result = await fetchFunction()
      
      // Only update if data has changed
      if (JSON.stringify(data) !== JSON.stringify(result)) {
        setData(result)
      }

      if (isInitial) {
        setLoading(false)
      }

      lastFetchRef.current = Date.now()
    } catch (err) {
      setError(err)
      if (isInitial) {
        setLoading(false)
      }
    }
  }, [fetchFunction, data])

  useEffect(() => {
    // Initial fetch
    fetchData(true)

    // Set up polling
    intervalRef.current = setInterval(() => {
      fetchData(false)
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchData, interval, ...dependencies])

  return { data, loading, error, refetch: () => fetchData(true) }
}
