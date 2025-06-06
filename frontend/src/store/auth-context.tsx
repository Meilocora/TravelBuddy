import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { refreshAuthToken } from '../utils/http';

interface AuthContextType {
  username: string | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  authenticate: (token: string, refreshToken: string) => void;
  logout: () => void;
  useRefreshToken: (refreshToken: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  username: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  authenticate: (token, refreshToken) => {},
  logout: () => {},
  useRefreshToken: (refreshToken) => {},
});

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      if (storedToken) {
        const decodedToken = JSON.parse(
          Buffer.from(storedToken.split('.')[1], 'base64').toString()
        );
        if (decodedToken.exp * 1000 > Date.now()) {
          setAuthToken(storedToken);
          setRefreshToken(storedRefreshToken);
          setUsername(decodedToken.username);
        } else {
          const { error, status, newToken, newRefreshToken } =
            await refreshAuthToken(storedRefreshToken!);
          if (!error && newToken && newRefreshToken) {
            setAuthToken(newToken);
            setRefreshToken(newRefreshToken);
            setUsername(
              JSON.parse(
                Buffer.from(newToken.split('.')[1], 'base64').toString()
              ).username
            );
            AsyncStorage.setItem('token', newToken);
            AsyncStorage.setItem('refreshToken', newRefreshToken);
          } else {
            return;
          }
        }
      }
    };
    loadToken();
  }, []);

  function authenticate(token: string, refreshToken: string) {
    const decodedToken = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );

    if (decodedToken.exp * 1000 > Date.now()) {
      setAuthToken(token);
      setRefreshToken(refreshToken);
      setUsername(decodedToken.username);
      AsyncStorage.setItem('token', token);
      AsyncStorage.setItem('refreshToken', refreshToken!);
    } else {
      return;
    }
  }

  function logout() {
    setAuthToken(null);
    setRefreshToken(null);
    setUsername(null);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('refreshToken');
  }

  async function useRefreshToken(refreshToken: string) {
    const { error, status, newToken, newRefreshToken } = await refreshAuthToken(
      refreshToken!
    );
    if (!error && newToken && newRefreshToken) {
      setAuthToken(newToken);
      setRefreshToken(newRefreshToken);
      setUsername(
        JSON.parse(Buffer.from(newToken.split('.')[1], 'base64').toString())
          .username
      );
      AsyncStorage.setItem('token', newToken);
      AsyncStorage.setItem('refreshToken', newRefreshToken);
    } else {
      return error;
    }
  }

  const value = {
    username: username,
    token: authToken,
    refreshToken: refreshToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    useRefreshToken: useRefreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
