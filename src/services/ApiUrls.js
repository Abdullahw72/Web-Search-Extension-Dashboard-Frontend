class Urls {
    // Develop
    // baseUrl = "https://web-search-backend-develop-447288546059.us-central1.run.app";

    // QA
    // baseUrl = "https://web-search-backend-qa-447288546059.us-central1.run.app";

    //Prod
    baseUrl = "https://web-search-backend-prod-447288546059.us-central1.run.app";
    
    loginUrl = this.baseUrl + '/auth/login';
    signUpUrl = this.baseUrl + '/user';
    search = this.baseUrl + '/search';
    limit = this.baseUrl + '/subscription/limits';
    plans = this.baseUrl + '/subscription/plans';
    subscribe = this.baseUrl + '/subscription/checkout';
   
    // Login forgot password
    forgotPasswordUrl = this.baseUrl + '/auth/forgot-password';
    verifyForgotPasswordUrl = this.baseUrl + '/auth/verify-forget-password';

    // Signup Flow
    verifyEmailUrl = this.baseUrl + '/user/verify';
    resendVerificationUrl = this.baseUrl + '/user/resend-verification-otp';

    // Change Password
    changePasswordUrl = this.baseUrl + '/auth/change-password';
    
    // Usage History
    usageHistoryUrl = this.baseUrl + '/subscription/usage-history';

    // RefreshToken
    refreshToken = this.baseUrl + '/auth/refresh-token';

    // Mobile Phone
    sendPhoneOtp = this.baseUrl + '/user/send-phone-otp';
    verifyphoneOtp = this.baseUrl + '/user/verify-phone';
    
    // Jobs/Tasks
    getJobs = this.baseUrl + '/search/jobs';
    getJobDetails = (jobId) => this.baseUrl + `/search/jobs/${jobId}`;
    
    // Logout
    logoutUrl = this.baseUrl + '/auth/logout';
    
}

const ApiUrls = new Urls();

export default ApiUrls;
