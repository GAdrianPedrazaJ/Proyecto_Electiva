import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

const defaultUser = {
  name: 'Camila P.',
  username: 'camila.pro',
  role: 'Creadora de contenido',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
};

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{ user: defaultUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
