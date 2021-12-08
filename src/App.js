import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import AddPost from './pages/addPost/AddPost';

import './App.css';
import { AuthContextProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { authIsReady, user } = useAuthContext();
  console.log(authIsReady);
  return (
    <div className='App'>
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route
              path='/'
              element={user ? <Home /> : <Navigate to='/login' />}
            />
            <Route
              path='/signup'
              element={user ? <Navigate to='/' /> : <Signup />}
            />
            <Route
              path='/login'
              element={user ? <Navigate to='/' /> : <Login />}
            />
            <Route path='/profile' element={user && <Profile />} />
            <Route path='/add-post' element={user && <AddPost />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
