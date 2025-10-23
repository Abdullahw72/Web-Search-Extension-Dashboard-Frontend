import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiRequest from "../../services/ApiRequest";
import { TokenService } from "../../services/TokenService";
import { countries } from '../../services/Utils';
import logoFull from '../../assets/AskGenieFullLogo.png';
import logoWelcome from '../../assets/WelcomeGenie.png';
import { Eye, EyeOff } from "lucide-react";

export default function SignIn({ toggleAuthScreen, onAuthSuccess }) {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(() => {
    const saved = localStorage.getItem('showWelcomeScreen');
    return saved !== 'false'; // Show welcome screen by default unless explicitly set to false
  });
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(() => {
    const saved = localStorage.getItem('signinForgotPassword');
    return saved === 'true';
  });
  const [otpScreen, setOtpScreen] = useState(() => {
    const saved = localStorage.getItem('signinOtpScreen');
    return saved === 'true';
  });
  const [otpScreen2, setOtpScreen2] = useState(() => {
    const saved = localStorage.getItem('signinOtpScreen2');
    return saved === 'true';
  });
  const otpRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resetEmail, setResetEmail] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('signinState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setUserEmail(state.userEmail || '');
        setResetNewPassword(state.resetNewPassword || '');
        setResetConfirmPassword(state.resetConfirmPassword || '');
      } catch (error) {
        console.error('Error parsing signin state:', error);
        localStorage.removeItem('signinState');
      }
    }
  }, []);

  // Save state to localStorage whenever relevant values change
  useEffect(() => {
    const state = {
      userEmail,
      resetNewPassword,
      resetConfirmPassword
    };
    localStorage.setItem('signinState', JSON.stringify(state));
    localStorage.setItem('showWelcomeScreen', showWelcomeScreen.toString());
    localStorage.setItem('signinForgotPassword', forgotPassword.toString());
    localStorage.setItem('signinOtpScreen', otpScreen.toString());
    localStorage.setItem('signinOtpScreen2', otpScreen2.toString());
  }, [userEmail, resetNewPassword, resetConfirmPassword, showWelcomeScreen, forgotPassword, otpScreen, otpScreen2]);

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    let value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input field if value is entered
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key press to move to the previous field
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const clearSigninState = () => {
    localStorage.removeItem('signinState');
    localStorage.removeItem('showWelcomeScreen');
    localStorage.removeItem('signinForgotPassword');
    localStorage.removeItem('signinOtpScreen');
    localStorage.removeItem('signinOtpScreen2');
    setShowWelcomeScreen(true);
    setForgotPassword(false);
    setOtpScreen(false);
    setOtpScreen2(false);
    setUserEmail('');
    setResetNewPassword('');
    setResetConfirmPassword('');
    setOtp(new Array(6).fill(""));
  };

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
    e.preventDefault();
    if (userEmail && password) {
      setLoading(true);
      if (userEmail) {
        localStorage.setItem("userEmail", userEmail)
      }
      ApiRequest.login({ userEmail, password }, "", (res) => {
        if (res?.isSuccess) {
          console.log("res?.data?.accessToken LIMIT", res?.data?.accessToken)
          ApiRequest.limitPlans('', res?.data?.accessToken, (res2) => {
            if (res2?.isSuccess) {
              // Clear chat histories only after successful login
              localStorage.setItem('freeChatHistory', '');
              localStorage.setItem('premiumChatHistory', '');
              
              
              TokenService.setAccessToken(res?.data?.accessToken);
              TokenService.setRefreshToken(res?.data?.refreshToken);
              localStorage.setItem("plan", btoa(res2?.data?.subscriptionDetails?.planName));
              localStorage.setItem("isActiveTrial", btoa(res?.data?.subscriptionDetails?.isFreePlanActive ? "isActiveTrial" : "notActive"));
              localStorage.setItem("isPlanAvailable", btoa(res?.data?.subscriptionDetails?.isFreePlanAvailable));
              clearSigninState();
              onAuthSuccess();  // likely navigates away
            } else {
              toast.error(res2?.error?.message ?? "Plan not found");
            }

            setLoading(false);
          });
        } else if (res?.error?.message === "Please verify your email address before logging in.") {
          requestOtpAgain();
        }
        else {
          toast.error(res?.error?.message ?? "Something went wrong");
          setLoading(false);
        }
      });
    } else {
      setError('Invalid credentials, try again.');
    }
  };

  const handleForgotPassword = () => {
    if (!userEmail) {
      toast.error("Please enter your email first.");
      return;
    } else {
      localStorage.setItem("userEmail", userEmail)
    }

    ApiRequest.forgotPassword({ userEmail }, "", (res) => {
      if (res?.isSuccess) {
        toast.success("Email sent successfully. Please verify OTP and enter it here");
        setOtpScreen(true);
      } else {
        toast.error(res?.error?.message ?? "Failed to send email");
      }
    });
  };

  const forgetPasswordOtp = () => {
    const data = {
      otp: Number(otp.join('')),
      userEmail: localStorage.getItem("userEmail"),
      newPassword: resetNewPassword
    }
    ApiRequest.verifyForgotPassword(data, "", (res) => {
      if (res?.isSuccess) {
        toast.success("Verification of OTP is successfull");
        clearSigninState(); // Clear state after successful password reset
        toggleAuthScreen();
      } else {
        toast.error(res?.error?.message ?? "Something went wrong");
      }
    });
  }

  const otpRequest = () => {
    ApiRequest.verifyEmail({ userEmail: localStorage.getItem("userEmail"), otp: Number(otp.join('')) }, "", (res) => {
      if (res?.isSuccess) toast.success(res?.data?.message ?? "Email Verified Successfully!")
      else toast.error(res?.error?.message ?? "Something went wrong")

      clearSigninState(); // Clear state after successful verification
      toggleAuthScreen();
    })
  }

  return (
    <div className="pb-6 bg-[#ffffff00] flex flex-col items-center justify-center rounded-2xl">

      {/* Logo Header */}
      <div className="w-full max-w-md mx-auto  bg-[#F9F9F9] px-6 py-4">
        <img
          src={logoFull}
          width={150}
          height={60}
          alt="Genie Logo"
          className="rounded-md"
        />
      </div>

      <div className="mx-6 max-w-md w-full bg-white p-8 ">

        {/* Welcome Screen */}
        {showWelcomeScreen ? (
          <div className="relative flex flex-col items-center justify-center text-center ">
            <img
              src={logoWelcome}
              alt="Welcome Illustration"
              className="w-full h-auto max-h-64 object-contain mb-6 rounded-md"
            />
            <p className="text-xs text-[525252] mb-6">Your AI-powered  assistant that makes browsing smarter, faster and more intuititve</p>
            <button
              onClick={() => setShowWelcomeScreen(false)}
              className="flex items-center justify-center w-full bg-gradient-to-br from-[#7A5FD8] to-[#6845D2] text-white py-3 px-3 text-[15px] font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-2 w-full text-center text-[#6845D2]">
              {otpScreen ? "Verify OTP" : forgotPassword ? "Forgot Password" : "Sign In"}
            </h2>

            {!forgotPassword && !otpScreen && !otpScreen2 && (
              <p className="text-sm w-full text-center text-[#525252] mb-6">Welcome back</p>
            )}

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
                      className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg font-semibold focus:outline-none focus:ring focus:ring-[#EEE3F9]"
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>

                <button
                  className="w-full bg-[#6b3fd1] text-white py-2 px-4 rounded-lg"
                  onClick={() => otpRequest()}
                >
                  Verify
                </button>

                <p className="text-sm text-gray-600 mt-2">
                  Didn't receive code?
                  <button className=" text-[#6845D2] hover:underline"
                    onClick={requestOtpAgain}
                  >
                    Request again
                  </button>
                </p>

                <button
                  className=" text-[#6845D2] hover:underline w-full text-center mt-2"
                  onClick={() => { 
                    clearSigninState();
                    toggleAuthScreen();
                  }}
                >
                  Back to Login
                </button>
              </div>
            ) :
              otpScreen ? (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center space-x-2 my-4">
                    {Array(6).fill(0).map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        ref={(el) => (otpRefs.current[index] = el)}
                        className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg font-semibold focus:outline-none focus:ring focus:ring-[#EEE3F9]"
                        value={otp[index] || ""}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    ))}
                  </div>

                  <div className="max-w-md mx-auto p-4">
                    {/* New Password Field */}
                    <label className="block text-sm text-left font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder='Enter New Password'
                      className="bg-[#F9F9F9] input-standard"
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                    />

                    {/* Confirm Password Field */}
                    <label className="block text-sm text-left font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      placeholder='Confirm Password'
                      className="bg-[#F9F9F9] input-standard"
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                    />
                  </div>

                  <button
                    className="w-full bg-[#6b3fd1] text-white py-2 px-4 rounded-lg"
                    onClick={() => forgetPasswordOtp()}
                  >
                    Verify
                  </button>

                  <button
                    className=" text-[#6845D2] hover:underline w-full text-center mt-2"
                    onClick={() => { 
                      clearSigninState();
                      toggleAuthScreen(); 
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              ) : forgotPassword ? (
                <div className='space-y-4'>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Email</label>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className="bg-[#F9F9F9] input-standard mb-5"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  <button
                    className="w-full bg-[#6b3fd1] text-white py-2 px-4 rounded-lg "
                    onClick={handleForgotPassword}
                  >
                    Request Password Reset
                  </button>
                  <div className="flex justify-end">
                    <button
                      className="text-[#6845D2] hover:underline text-xs"
                      onClick={() => setForgotPassword(false)}
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className="bg-[#F9F9F9] input-standard"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    {/* <input
                      type="password"
                      placeholder="Enter Password"
                      className="bg-[#F9F9F9] input-standard"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    /> */}
                    <div className="relative mt-0" style={{ marginTop: "0px" }}>
        <input
          type={showPassword ? "text" : "password"}
          className="custom-input bg-[#F9F9F9] block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 focus:outline-none focus:ring focus:ring-purple-300"
          value={password}
          placeholder={"Enter Password"}
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
                      className="text-xs text-[#6845D2] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-[#6b3fd1] text-white py-2 px-4 rounded-lg">
                    {loading ? "Loading..." : "Sign In"}
                  </button>

                  <p className="text-xs text-[#525252] mt-4 text-center">
                    Don't have an account? <button type="button" className=" text-[#6845D2] font-medium hover:underline" onClick={toggleAuthScreen}>Sign Up</button>
                  </p>
                </form>
              )}
          </>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}