import { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import ExplorePage from './pages/ExplorePage'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

const App = () => {
  const { authUser, isCheckingAuth } = useContext(AuthContext);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#110e1b] text-slate-400 gap-3">
        <div className="w-9 h-9 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-xs tracking-wider uppercase text-slate-500 font-semibold">Connecting...</span>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#110e1b] text-white w-full'>
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path='/explore' element={authUser ? <ExplorePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App