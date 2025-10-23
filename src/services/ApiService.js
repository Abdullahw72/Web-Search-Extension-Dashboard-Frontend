import { TokenService } from "./TokenService";
import axios from "axios";
import ApiUrls from "./ApiUrls";
import { Paths } from "./Route";

class Service {
  constructor() {
    this.api = axios.create({
      baseURL: ApiUrls.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request Interceptor to add token to every request
    this.api.interceptors.request.use(
      (config) => {
        const accessToken = TokenService.getAccessToken();
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor to handle 401 errors and token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const result = await this.callRefreshTokenApi();

            if (result?.isSuccess) {
              originalRequest.headers["Authorization"] = `Bearer ${TokenService.getAccessToken()}`;
              return this.api(originalRequest);
            }
          } 
          catch (refreshError) {
            TokenService.clearTokens(true);
            window.location.replace(Paths.login);
            return Promise.reject(refreshError);
          }
        }

        if (error.response?.status === 401) return null
        else return Promise.reject(error?.response?.data);
      }
    );
  }

  // Call Refresh Token API
  async callRefreshTokenApi() {
    const refreshToken = TokenService.getRefreshToken();

    try {
      const response = await axios.get(ApiUrls.refreshToken, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });

      if (response?.status === 200) {
        const { accessToken, refreshToken } = response.data;

        TokenService.setAccessToken(accessToken);
        TokenService.setRefreshToken(refreshToken);

        return { isSuccess: true };
      }
    } catch (error) {
      console.log("Token refresh error:", error);
    }
  }

  // GET request with token
  async getRequest(url, data) {
    return this.api.get(url, { params: data });
  }

  async getParamTokenRequest(url, params, token, isRetry = false) {
    console.log("res?.data?.accessToken LIMIT 03", token)

    try {
        const response = await axios.get(url, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        // Handle 401 error and token refresh
        if (error.response?.status === 401 && !isRetry) {
            try {
                const refreshResult = await this.callRefreshTokenApi();
                
                if (refreshResult?.isSuccess) {
                    // Get the new access token and retry the request
                    const newToken = TokenService.getAccessToken();
                    return this.getParamTokenRequest(url, params, newToken, true);
                } else {
                    // Refresh failed, redirect to login
                    TokenService.clearTokens(true);
                    window.location.replace(Paths.login);
                    return error.response || { status: 401, data: "Token refresh failed" };
                }
            } catch (refreshError) {
                TokenService.clearTokens(true);
                window.location.replace(Paths.login);
                return { status: 401, data: "Token refresh error" };
            }
        }
        
        return error.response || { status: 500, data: "Unknown error" };
    }
  }

  // GET request without token
  async getRequestWithoutToken(url, data) {
    return this.api.get(url, { params: data });
  }

  // POST request (JSON or FormData) - FIXED FOR STREAMING
  async postRequest(url, body, param, isStreaming = false) {
    if (isStreaming) {
      // Handle streaming response
      return this.handleStreamingRequest(url, body, param);
    }
    return this.api.post(url, body, { params: param });
  }

  // UPDATED METHOD: Handle streaming requests with 401 error handling and token refresh
  async handleStreamingRequest(url, body, param, isRetry = false) {
    try {
      const accessToken = TokenService.getAccessToken();
      
      const response = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          responseType: "blob",
          "Authorization": accessToken ? `Bearer ${accessToken}` : "",
        },
        body: JSON.stringify(body),
      });
  
      // Handle 401 error and token refresh
      if (response.status === 401 && !isRetry) {
        try {
          const refreshResult = await this.callRefreshTokenApi();
          
          if (refreshResult?.isSuccess) {
            // Retry the request with new token
            return this.handleStreamingRequest(url, body, param, true);
          } else {
            // Refresh failed, redirect to login
            TokenService.clearTokens(true);
            window.location.replace(Paths.login);
            throw new Error("Token refresh failed");
          }
        } catch (refreshError) {
          TokenService.clearTokens(true);
          window.location.replace(Paths.login);
          throw refreshError;
        }
      }
  
      // Handle other HTTP errors with dynamic error messages
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          // Try to parse error response as JSON
          const errorData = await response.clone().json();
          
          // Extract message from various possible error response formats
          if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (errorData?.error?.message) {
            errorMessage = errorData.error.message;
          } else if (errorData?.error) {
            errorMessage = typeof errorData.error === "string" ? errorData.error : errorMessage;
          } else if (errorData?.detail) {
            errorMessage = errorData.detail;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          }
          
          // Fallback to status text if no custom message found
          if (errorMessage === `HTTP error! status: ${response.status}` && response.statusText) {
            errorMessage = `${response.status} ${response.statusText}`;
          }
          
        } catch (parseError) {
          // If JSON parsing fails, try to get text response
          try {
            const errorText = await response.clone().text();
            if (errorText && errorText.trim()) {
              errorMessage = errorText;
            }
          } catch (textError) {
            // Keep the default HTTP error message if both JSON and text parsing fail
            console.warn("Failed to parse error response:", parseError, textError);
          }
        }
        
        throw new Error(errorMessage);
      }
  
      return {
        status: response.status,
        data: response, // Return the raw response for streaming
        headers: response.headers
      };
      
    } catch (error) {
      // Re-throw the error with preserved message
      throw error;
    }
  }

  // POST request for uploading images
  async postRequestImage(url, body, param) {
    return this.api.post(url, body, {
      responseType: "arraybuffer",
      params: param,
    });
  }

  // POST request for stream with FormData
  async postRequestStream(url, body, param) {
    return this.api.post(url, body, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "arraybuffer",
      params: param,
    });
  }

  // POST request with stream and JSON
  async postRequestStreamWithJSON(url, body, param) {
    return this.api.post(url, body, {
      headers: { "Content-Type": "application/json" },
      responseType: "arraybuffer",
      params: param,
    });
  }

  // POST request for stream without FormData
  async postRequestStreamWithoutFormData(url, body, param) {
    return this.api.post(url, body, {
      responseType: "arraybuffer",
      params: param,
    });
  }

  // PUT request with token
  async putRequest(url, body, param, isForm) {
    var formData = new FormData();

    if (isForm) {
      return this.api.put(url, body, {
        headers: { "Content-Type": "multipart/form-data" },
        params: param,
        data: formData
      });
    }
    return this.api.put(url, body, { params: param });
  }

  // DELETE request with token
  async deleteRequest(url, param, body = null) {
    const config = {
      params: param,
      headers: { "Content-Type": "application/json" },
    };
  
    if (body) {
      config.data = body;
    }
  
    return this.api.delete(url, config);
  }

  // PATCH request with token
  async patchRequest(url, id, body) {
    return this.api.patch(`${url}${id}/`, body);
  }

  // Upload file to GCP (Google Cloud Platform)
  async uploadFileToGCP(url, headers, body) {
    return this.api.put(url, body, { headers });
  }

  // POST request for text-to-speech conversion and return blob
  async postBlobTextToSpeech(url, body, param, isForm) {
    try {
      const dataToSend = isForm ? body : body;
  
      const response = await this.api.post(url, dataToSend, {
        responseType: "blob",
        params: param,
        headers: isForm ? { "Content-Type": "multipart/form-data" } : {}
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  //POST Chatbot
  async postChatbotAgent(url, data) {
    try {
        const response = await this.api.post(url, data, {
            responseType: "blob",
            params: {},
            headers: { "Content-Type": "application/json"}
        });

        return response;
      } catch (error) {
        throw error;
      }
  }
}

const ApiService = new Service();
export default ApiService;
