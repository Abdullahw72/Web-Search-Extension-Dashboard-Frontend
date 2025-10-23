import { TokenService } from "libraries/TokenService";
import { Paths } from "libraries/Route";
import ApiUrls from "./ApiUrls"; // Assuming ApiUrls contains necessary API endpoints
import axios from "axios";

// Call Refresh Token API
const callRefreshTokenApi = async () => {
    const refreshToken = TokenService.getRefreshToken(); // Get the current refresh token

    // Define the URL for refresh token
    // const refreshUrl = `${this.baseUrl}/auth/login/refresh-token`;

    try {
      // Make the API call to refresh the token
      const response = await axios.get(ApiUrls.refreshToken, {
        headers: {
          Authorization: `Bearer ${refreshToken}` // Use refresh token in the Authorization header
        }
      });

      // If the API call is successful and the response contains tokens
      if (response?.status === 200) {
        const { accessToken, refreshToken } = response.data;

        // Update the TokenService with new tokens
        TokenService.setAccessToken(accessToken);
        TokenService.setRefreshToken(refreshToken);

        return { isSuccess: true };
      } 
      else {
        window.location.replace(Paths.login)
        // return { isSuccess: false }; // Handle failure case
      }
    } 
    catch (error) {
      window.location.replace(Paths.login)
      // return { isSuccess: false }; // Return failure in case of any error
    }
  }

const fetchWithInterceptor = async (url, options) => {
    // Request interceptor logic
    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${TokenService.getAccessToken()}`,
    };

    try {
        const response = await fetch(url, options);

        // Response interceptor logic
        if (response.status === 401) {
            // Handle unauthorized access (e.g., refresh token)

            const result = await callRefreshTokenApi();

            if (result?.isSuccess) {
                options.headers.Authorization = `Bearer ${TokenService.getAccessToken()}`;
                const retryResponse = await fetch(url, options);
                return retryResponse;
            }

            
        }

        return response;
    } catch (error) {
        // Handle fetch error
        throw error;
    }
};

export default fetchWithInterceptor;
