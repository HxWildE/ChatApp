import { useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/chatContext'

// selected USer arg in this i have changed myself
// writing here for future debugging 

const RightSidebar = () => {
  
  const {selectedUser ,messages } = useContext(ChatContext)
  const {logout , onlineUsers }= useContext(AuthContext)
  const msgImages = messages.filter(msg => msg.image).map(msg => msg.image)

  return selectedUser ? (
    <div className={`bg-slate-900 border-l border-slate-800 text-slate-200 w-full relative overflow-y-scroll
    hidden lg:block`}>
     
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
          <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full'/>
          <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
           {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
                {selectedUser.fullName}
          </h1>
          <p className='px-10 mx-auto'> {selectedUser.bio} </p>
      </div>

      <hr className="border-slate-800/80 my-4 mx-6"/>

      <div className="px-5 test-xs">
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2
        gap-4 opacity-80'>
       
        {msgImages.map((url,index)=>(
            <div className ='cursor-pointer rounded'
            key={index} onClick= {()=>window.open(url)}>
              <img src={url} alt="" className='h-full rounded-md'/>
                   </div>
          ))}
        </div>
      </div>
      <button onClick={() => logout()} className='absolute bottom-6 left-1/2 
      transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2 px-12 rounded-xl cursor-pointer w-3/4'>
            Logout
      </button>
    </div>
  ):null
}

export default RightSidebar