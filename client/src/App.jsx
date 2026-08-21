import React from 'react'
import {Route , Routes ,Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'

const authUser = AuthContext.authUser;

const App = () => {
  return (
    <div className='bg-[url("./src/assets/bgImage.svg")] bg-repeat-x bg-top bg-[length:calc(100vw/15)_auto] w-full'>
      <Toaster/>
      <Routes>
        <Route path='/' element= { authUser ? <HomePage/> :
         <Navigate to="/login" />} />
        //redirectd to login unless authenticated

        <Route path='/login' element={ !authUser ? <LoginPage/> :
         <Navigate to="/" />} />

        <Route path='/profile' element={authUser ? <ProfilePage/> :
         <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App