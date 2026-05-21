import React from 'react'
import {Route , Routes} from 'react-router-dom'

const App = () => {
  return (
    <div>

      <Routes>
        <Route path = '/' element ={<HomePage/>}/>
        <Route path = '/login' element ={<LoginPage/>}/>
        <Route path = '/profile' element ={<ProfilePage/>}/>
      </Routes>
    </div>
  )
}

export default App