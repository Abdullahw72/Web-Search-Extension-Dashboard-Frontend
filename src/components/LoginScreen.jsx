import React, { useState, useEffect, useRef } from 'react'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ApiRequest from "../services/ApiRequest"
import { TokenService } from "../services/TokenService"
import { Eye, EyeOff } from "lucide-react"
import askGenieMainLogo from '../assets/GenieLogo.png'

const LoginScreen = ({ onLoginSuccess }) => {
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [otpScreen, setOtpScreen] = useState(false)
  const [otpScreen2, setOtpScreen2] = useState(false)
  const [otp, setOtp] = useState(new Array(6).fill(""))
  const [resetEmail, setResetEmail] = useState("")
  const [resetNewPassword, setResetNewPassword] = useState("")
  const [resetConfirmPassword, setResetConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const otpRefs = useRef([])

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('signinState')
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        setUserEmail(state.userEmail || '')
        setResetNewPassword(state.resetNewPassword || '')
        setResetConfirmPassword(state.resetConfirmPassword || '')
      } catch (error) {
        console.error('Error parsing signin state:', error)
        localStorage.removeItem('signinState')
      }
    }
  }, [])

  // Save state to localStorage whenever relevant values change
  useEffect(() => {
    const state = {
      userEmail,
      resetNewPassword,
      resetConfirmPassword
    }
    localStorage.setItem('signinState', JSON.stringify(state))
  }, [userEmail, resetNewPassword, resetConfirmPassword])

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    let value = e.target.value
    if (!/^[0-9]?$/.test(value)) return

    let newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input field if value is entered
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace key press to move to the previous field
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const clearSigninState = () => {
    localStorage.removeItem('signinState')
    setForgotPassword(false)
    setOtpScreen(false)
    setOtpScreen2(false)
    setUserEmail('')
    setResetNewPassword('')
    setResetConfirmPassword('')
    setOtp(new Array(6).fill(""))
  }

  const requestOtpAgain = () => {
    ApiRequest.resendVerification({ userEmail: userEmail ?? localStorage.getItem("userEmail") }, "", (res) => {
      if (res?.isSuccess) {
        setOtpScreen2(true)
        toast.success(res?.data?.message ?? "OTP Email Sent Successfully!")
      }
      else toast.error(res?.error?.message ?? "Something went wrong")
    })
  }

  const handleSignIn = (e) => {
    e.preventDefault()
    if (userEmail && password) {
      setLoading(true)
      if (userEmail) {
        localStorage.setItem("userEmail", userEmail)
      }
      ApiRequest.login({ userEmail, password }, "", (res) => {
        if (res?.isSuccess) {
          console.log("res?.data?.accessToken LIMIT", res?.data?.accessToken)
          ApiRequest.limitPlans('', res?.data?.accessToken, (res2) => {
            if (res2?.isSuccess) {
              // Clear chat histories only after successful login
              localStorage.setItem('freeChatHistory', '')
              localStorage.setItem('premiumChatHistory', '')
              
              TokenService.setAccessToken(res?.data?.accessToken)
              TokenService.setRefreshToken(res?.data?.refreshToken)
              localStorage.setItem("plan", btoa(res2?.data?.subscriptionDetails?.planName))
              localStorage.setItem("isActiveTrial", btoa(res?.data?.subscriptionDetails?.isFreePlanActive ? "isActiveTrial" : "notActive"))
              localStorage.setItem("isPlanAvailable", btoa(res?.data?.subscriptionDetails?.isFreePlanAvailable))
              clearSigninState()
              onLoginSuccess()  // Navigate to main app
            } else {
              toast.error(res2?.error?.message ?? "Plan not found")
            }

            setLoading(false)
          })
        } else if (res?.error?.message === "Please verify your email address before logging in.") {
          requestOtpAgain()
        }
        else {
          toast.error(res?.error?.message ?? "Something went wrong")
          setLoading(false)
        }
      })
    } else {
      setError('Invalid credentials, try again.')
    }
  }

  const handleForgotPassword = () => {
    if (!userEmail) {
      toast.error("Please enter your email first.")
      return
    } else {
      localStorage.setItem("userEmail", userEmail)
    }

    ApiRequest.forgotPassword({ userEmail }, "", (res) => {
      if (res?.isSuccess) {
        toast.success("Email sent successfully. Please verify OTP and enter it here")
        setOtpScreen(true)
      } else {
        toast.error(res?.error?.message ?? "Failed to send email")
      }
    })
  }

  const forgetPasswordOtp = () => {
    const data = {
      otp: Number(otp.join('')),
      userEmail: localStorage.getItem("userEmail"),
      newPassword: resetNewPassword
    }
    ApiRequest.verifyForgotPassword(data, "", (res) => {
      if (res?.isSuccess) {
        toast.success("Verification of OTP is successfull")
        clearSigninState()
        setForgotPassword(false)
      } else {
        toast.error(res?.error?.message ?? "Something went wrong")
      }
    })
  }

  const otpRequest = () => {
    ApiRequest.verifyEmail({ userEmail: localStorage.getItem("userEmail"), otp: Number(otp.join('')) }, "", (res) => {
      if (res?.isSuccess) toast.success(res?.data?.message ?? "Email Verified Successfully!")
      else toast.error(res?.error?.message ?? "Something went wrong")

      clearSigninState()
      setOtpScreen2(false)
    })
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'transparent' }}>
            <img
              src={askGenieMainLogo}
              alt="AskGenie Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-center" style={{ color: '#6845D2' }}>
            {otpScreen ? "Verify OTP" : forgotPassword ? "Forgot Password" : "Sign In"}
          </h2>
          {!forgotPassword && !otpScreen && !otpScreen2 && (
            <p className="text-sm text-center" style={{ color: '#525252' }}>Welcome back</p>
          )}
        </div>

        {otpScreen2 ? (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-bold text-gray-800">Verify</h2>
            <p className="text-sm text-gray-600">Your code was sent to you via email</p>

            <div className="flex justify-center space-x-2 my-4">
              {Array(6).fill(0).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (otpRefs.current[index] = el)}
                  className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg font-semibold focus:outline-none focus:ring focus:ring-purple-300"
                  value={otp[index] || ""}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <button
              className="w-full text-white py-2 px-4 rounded-lg"
              style={{ backgroundColor: '#6845D2' }}
              onClick={() => otpRequest()}
            >
              Verify
            </button>

            <p className="text-sm text-gray-600 mt-2">
              Didn't receive code?
              <button 
                className="text-purple-600 hover:underline ml-1"
                onClick={requestOtpAgain}
              >
                Request again
              </button>
            </p>

            <button
              className="text-purple-600 hover:underline w-full text-center mt-2"
              onClick={() => { 
                clearSigninState()
                setOtpScreen2(false)
              }}
            >
              Back to Login
            </button>
          </div>
        ) : otpScreen ? (
          <div className="space-y-4 text-center">
            <div className="flex justify-center space-x-2 my-4">
              {Array(6).fill(0).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (otpRefs.current[index] = el)}
                  className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg font-semibold focus:outline-none focus:ring focus:ring-purple-300"
                  value={otp[index] || ""}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <div className="max-w-md mx-auto p-4">
              <label className="block text-sm text-left font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder='Enter New Password'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={resetNewPassword}
                onChange={(e) => setResetNewPassword(e.target.value)}
              />

              <label className="block text-sm text-left font-medium text-gray-700 mb-1 mt-3">Confirm Password</label>
              <input
                type="password"
                placeholder='Confirm Password'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={resetConfirmPassword}
                onChange={(e) => setResetConfirmPassword(e.target.value)}
              />
            </div>

            <button
              className="w-full text-white py-2 px-4 rounded-lg"
              style={{ backgroundColor: '#6845D2' }}
              onClick={() => forgetPasswordOtp()}
            >
              Verify
            </button>

            <button
              className="text-purple-600 hover:underline w-full text-center mt-2"
              onClick={() => { 
                clearSigninState()
                setOtpScreen(false)
              }}
            >
              Back to Login
            </button>
          </div>
        ) : forgotPassword ? (
          <div className='space-y-4'>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <button
              className="w-full text-white py-2 px-4 rounded-lg"
              style={{ backgroundColor: '#6845D2' }}
              onClick={handleForgotPassword}
            >
              Request Password Reset
            </button>
            <div className="flex justify-end">
              <button
                className="text-purple-600 hover:underline text-sm"
                onClick={() => setForgotPassword(false)}
              >
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                  value={password}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                onClick={() => setForgotPassword(true)}
                className="text-sm text-purple-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full text-white py-2 px-4 rounded-lg disabled:opacity-50"
              style={{ backgroundColor: '#6845D2' }}
            >
              {loading ? "Loading..." : "Sign In"}
            </button>

          </form>
        )}

        <ToastContainer />
      </div>
    </div>
  )
}

export default LoginScreen
