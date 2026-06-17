import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'

const HomePage = () => {

  const [selectedUser , setSelectedUser] = useState(false)
  
  return (
    <div className='bg-[url("./src/assets/bgImage.svg")] w-full min-h-screen flex items-center justify-center py-8'>

      <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl 
      overflow-hidden w-[95%] max-w-350 h-[88vh] grid grid-cols-1 gap-0 relative 
      ${selectedUser ? 'grid-cols-[300px_1fr_300px]' : 'grid-cols-[300px_1fr]'}`}>
      
        <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
        <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
        <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
    
      </div>
    </div>
  )
}

export default HomePage