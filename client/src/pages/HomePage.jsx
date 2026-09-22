import { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/chatContext'

const HomePage = () => {

  const { selectedUser } = useContext(ChatContext)
  
  return (
    <div className='bg-slate-950 w-full min-h-screen flex items-center justify-center py-8'>

      <div className={`bg-slate-900 border border-slate-800 rounded-xl shadow-2xl
      overflow-hidden w-[95%] max-w-[1400px] h-[88vh] grid gap-0 relative 
      grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr_300px] 
      min-h-0 min-w-0`}>
      
        <Sidebar  />
        <ChatContainer/>
        <RightSidebar />
    
      </div>
    </div>
  )
}

export default HomePage