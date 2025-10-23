import ApiService from "./ApiService";
import ApiUrls from "./ApiUrls";

class Request {
    async signUp(data, param, callback) {
        try {
            const response = await ApiService.postRequest(ApiUrls.signUpUrl, data, param, false);
            const errMsg = response?.data;

            if (response?.status === 200 || response?.status === 201) {
                callback({ data: response.data, isSuccess: true });
            } else {
                callback({ isSuccess: false, data: undefined, error: errMsg });
            }
        } catch (error) {
            callback({ isSuccess: false, data: undefined, error });
        }
        };

     async login(data, param, callback) {
        try {
            const response = await ApiService.postRequest(ApiUrls.loginUrl, data, param, false);
            const errMsg = response?.data;

            if (response?.status === 200 || response?.status === 201) {
                callback({ data: response.data, isSuccess: true });
            } else {
                callback({ isSuccess: false, data: undefined, error: errMsg });
            }
        } catch (error) {
            callback({ isSuccess: false, data: undefined, error });
        }
    };

    async getPlans(data, param, callback) {
        try {
            const response = await ApiService.getRequest(ApiUrls.plans, data);
            const errMsg = response?.data;

            if (response?.status === 200 || response?.status === 201) {
                callback({ data: response.data, isSuccess: true });
            } else {
                callback({ isSuccess: false, data: undefined, error: errMsg });
            }
        } catch (error) {
            callback({ isSuccess: false, data: undefined, error });
        }
    };

    async searchText(data, param, callback) {
        try {
            if (data.option === "premium") {
                // For streaming, return the raw response
                const response = await ApiService.postRequest(ApiUrls.search, data, param, true);
                
                if (response?.status !== 200) {
                    // Use the actual error message from server response
                    const errorMessage = response?.data?.message || 
                                       response?.data?.error || 
                                       response?.statusText || 
                                       `Request failed with status: ${response.status}`;
                    
                    callback({ 
                        isSuccess: false, 
                        data: undefined, 
                        error: errorMessage 
                    });
                    return;
                }
                
                // Return raw response for main component to handle
                callback({ 
                    isSuccess: true, 
                    isStreaming: true,
                    rawResponse: response.data // Raw fetch Response object
                });
            } else {
                // Handle regular non-streaming response
                const response = await ApiService.postRequest(ApiUrls.search, data, param, false);
    
                if (response?.status === 200 || response?.status === 201) {
                    callback({ data: response.data, isSuccess: true });
                } else {
                    // Extract proper error message from server response
                    const errorMessage = response?.data?.message || 
                                       response?.data?.error || 
                                       response?.data?.details || 
                                       response?.statusText || 
                                       `Request failed with status: ${response.status}`;
                    
                    callback({ 
                        isSuccess: false, 
                        data: undefined, 
                        error: errorMessage 
                    });
                }
            }
        } catch (error) {
            // Handle network errors or other exceptions
            const errorMessage = error?.response?.data?.message || 
                               error?.message || 
                               "An unexpected error occurred";
            
            callback({ 
                isSuccess: false, 
                data: undefined, 
                error: errorMessage 
            });
        }
    };

    async logout(callback) {
        try {
            const response = await ApiService.postRequest(ApiUrls.logoutUrl, {}, {}, false);
            const errMsg = response?.data;

            if (response?.status === 200 || response?.status === 201) {
                callback({ data: response.data, isSuccess: true });
            } else {
                callback({ isSuccess: false, data: undefined, error: errMsg });
            }
        } catch (error) {
            callback({ isSuccess: false, data: undefined, error });
        }
    };

    async getJobs(data, callback) {
        try {
            const response = await ApiService.getRequest(ApiUrls.getJobs, data);
            const errMsg = response?.data;

            if (response?.status === 200 || response?.status === 201) {
                callback({ data: response.data, isSuccess: true });
            } else {
                callback({ isSuccess: false, data: undefined, error: errMsg });
            }
        } catch (error) {
            callback({ isSuccess: false, data: undefined, error });
        }
    };

    async getJobDetails(jobId, callback) {
        try {
            const response = await ApiService.getRequest(ApiUrls.getJobDetails(jobId), {});
            const errMsg = response?.data;

            if (response?.status === 200 || response?.status === 201) {
                callback({ data: response.data, isSuccess: true });
            } else {
                callback({ isSuccess: false, data: undefined, error: errMsg });
            }
        } catch (error) {
            callback({ isSuccess: false, data: undefined, error });
        }
    };

    async limitPlans(data, token, callback) {
        try {
            const response = await ApiService.getParamTokenRequest(ApiUrls.limit, data, token);
            const errMsg = response?.data;

            if (response?.status === 200 || response?.status === 201) {
                callback({ data: response.data, isSuccess: true });
            } else {
                callback({ isSuccess: false, data: undefined, error: errMsg });
            }
        } catch (error) {
            callback({ isSuccess: false, data: undefined, error });
        }
    };

    async resendVerification(data, param, callback) {
        try {
            const response = await ApiService.postRequest(ApiUrls.resendVerificationUrl, data, param, false);
            const errMsg = response?.data;

            if (response?.status === 200 || response?.status === 201) {
                callback({ data: response.data, isSuccess: true });
            } else {
                callback({ isSuccess: false, data: undefined, error: errMsg });
            }
        } catch (error) {
            callback({ isSuccess: false, data: undefined, error });
        }
    };

    async forgotPassword(data, param, callback) {
        try {
            const response = await ApiService.postRequest(ApiUrls.forgotPasswordUrl, data, param, false);
            const errMsg = response?.data;

            if (response?.status === 200 || response?.status === 201) {
                callback({ data: response.data, isSuccess: true });
            } else {
                callback({ isSuccess: false, data: undefined, error: errMsg });
            }
        } catch (error) {
            callback({ isSuccess: false, data: undefined, error });
        }
    };

    async verifyForgotPassword(data, param, callback) {
        try {
            const response = await ApiService.postRequest(ApiUrls.verifyForgotPasswordUrl, data, param, false);
            const errMsg = response?.data;

            if (response?.status === 200 || response?.status === 201) {
                callback({ data: response.data, isSuccess: true });
            } else {
                callback({ isSuccess: false, data: undefined, error: errMsg });
            }
        } catch (error) {
            callback({ isSuccess: false, data: undefined, error });
        }
    };

    async verifyEmail(data, param, callback) {
        try {
            const response = await ApiService.postRequest(ApiUrls.verifyEmailUrl, data, param, false);
            const errMsg = response?.data;

            if (response?.status === 200 || response?.status === 201) {
                callback({ data: response.data, isSuccess: true });
            } else {
                callback({ isSuccess: false, data: undefined, error: errMsg });
            }
        } catch (error) {
            callback({ isSuccess: false, data: undefined, error });
        }
    };
}

const ApiRequest = new Request();
export default ApiRequest;
