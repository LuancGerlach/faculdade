import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

const AUTH_STORAGE_KEY = 'cs2market:user';
const AuthContext = createContext(null);

// Sessão simulada: guarda o usuário retornado pela API (sem token, retorno mockado)
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readStorage(AUTH_STORAGE_KEY, null));

  const signIn = useCallback((authenticatedUser) => {
    setCurrentUser(authenticatedUser);
    writeStorage(AUTH_STORAGE_KEY, authenticatedUser);
  }, []);

  const signOut = useCallback(() => {
    setCurrentUser(null);
    writeStorage(AUTH_STORAGE_KEY, null);
  }, []);

  const authValue = useMemo(
    () => ({ currentUser, isAuthenticated: Boolean(currentUser), signIn, signOut, updateCurrentUser: signIn }),
    [currentUser, signIn, signOut],
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return authContext;
}
