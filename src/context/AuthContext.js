import { onAuthStateChanged } from 'firebase/auth';
import { useContext, useReducer, useEffect, createContext } from 'react';
import { auth } from '../firebase/config';

//ccreate the context (so that user can be accessed through all of app)
export const AuthContext = createContext();

// create a reducer to be able to change user state to be used in app (AUTH_IS_READY is used to make sure auth status is set before we load pages)
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'AUTH_IS_READY':
      return { user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

// create the context provider that will wrap the App
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });
  // when page loads (AuthContextProvider componen will mount) dispatch action that AuthIsReady when the Auth data is ready to be used (onAuthChanged fires when userdata is ready, wheter logged in or out), then unsubscribe to it
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch({ type: 'AUTH_IS_READY', payload: user });
      unsub();
    });
  }, []);

  console.log('AuthContext state:', state);
  // makes AuthContextProvider able to wrap components and makes the state as well as dispatch function avaialbe to it
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
