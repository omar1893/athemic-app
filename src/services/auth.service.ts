import axios from 'axios';
import config from '@/config';
import { EmailLoginResponse } from '@/types/auth.types';

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

const authService = {
  async loginWithEmail(email: string): Promise<EmailLoginResponse> {
    const response = await axios.post<EmailLoginResponse>(`${config.API_URL}/auth/login/request`, {
      email
    });
    return response.data;
  },

  async confirmLogin(email: string, code: string): Promise<any> {
    const response = await axios.post(`${config.API_URL}/auth/login/confirm`, {
      email,
      code
    });
    return response.data;
  },

  async loginWithGoogle(idToken: string): Promise<any> {
    const response = await axios.post(`${config.API_URL}/auth/login/google`, {
      id_token: idToken
    });
    return response.data;
  },

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<GoogleTokenResponse> {
    const redirectUri = `${window.location.origin}/auth/callback`;
    console.log('Redirect URI:', redirectUri);
    console.log('Code:', code);
    console.log('Code Verifier:', codeVerifier);

    const params = new URLSearchParams();
    params.append('code', code);
    params.append('access_type', 'offline');
    params.append('client_id', config.AT_GOOGLE_CLIENT_ID);
    params.append('client_secret', config.AT_GOOGLE_CLIENT_SECRET);
    params.append('code_verifier', codeVerifier);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirectUri);

    try {
      const response = await axios.post<GoogleTokenResponse>(
        'https://www.googleapis.com/oauth2/v4/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Token exchange error:', error.response?.data);
      throw error;
    }
  }
};

export default authService; 