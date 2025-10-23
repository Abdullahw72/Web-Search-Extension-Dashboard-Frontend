const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";


class Service {
    getAccessToken() {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    setAccessToken(token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }

    getRefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    setRefreshToken(token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }

    clearTokens(redirectToLogin = false) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        
        if (redirectToLogin) {
            // Redirect to login page
            window.location.href = "/login";
        }
    }

    isAuthenticated() {
        return !!this.getAccessToken();
    }
}

export const TokenService = new Service();
