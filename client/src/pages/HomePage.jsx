import { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/chatContent'

const HomePage = () => {

  const { selectedUser } = useContext(ChatContext)
  
  return (
    <div className='bg-[#000000] w-full min-h-screen flex items-center justify-center py-8'>

      <div className={`bg-[#09090b] border border-[#27272a] rounded-xl shadow-2xl
      overflow-hidden w-[95%] max-w-350 h-[88vh] grid grid-cols-1 gap-0 relative 
      ${selectedUser ? 'grid-cols-[300px_1fr_300px]' : 'grid-cols-[300px_1fr]'}`}>
      
        <Sidebar  />
        <ChatContainer/>
        <RightSidebar />
    
      </div>
    </div>
  )
}

export default HomePage