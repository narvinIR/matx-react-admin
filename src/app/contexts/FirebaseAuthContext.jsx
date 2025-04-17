import { createContext, useEffect, useReducer } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
// FIREBASE CONFIGURATION
import { firebaseConfig } from "app/config";
// GLOBAL CUSTOM COMPONENT
import Loading from "app/components/MatxLoading";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const initialAuthState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
  isLoading: true
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FB_AUTH_STATE_CHANGED": {
      const { isAuthenticated, user } = action.payload;
      return { 
        ...state, 
        isAuthenticated, 
        isInitialized: true, 
        user,
        isLoading: false 
      };
    }
    case "SET_LOADING": {
      return { ...state, isLoading: action.payload };
    }
    default: {
      return state;
    }
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  method: "FIREBASE"
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const signInWithEmail = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const signInWithGoogle = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createUserWithEmail = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await signOut(auth);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: "FB_AUTH_STATE_CHANGED",
          payload: {
            isAuthenticated: true,
            user: {
              id: user.uid,
              email: user.email,
              avatar: user.photoURL,
              name: user.displayName || user.email
            }
          }
        });
      } else {
        dispatch({
          type: "FB_AUTH_STATE_CHANGED",
          payload: { isAuthenticated: false, user: null }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Показываем лоадер только при первичной инициализации
  if (!state.isInitialized) return <Loading />;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        logout,
        signInWithGoogle,
        method: "FIREBASE",
        signInWithEmail,
        createUserWithEmail
      }}>
      {state.isLoading && <Loading />}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
