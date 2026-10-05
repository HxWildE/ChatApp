import { useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/chatContext'

const RightSidebar = () => {
  const {selectedUser, messages} = useContext(ChatContext)
  const {logout, onlineUsers} = useContext(AuthContext)
  const msgImages = messages.filter(msg => msg.image).map(msg => msg.image)
  const isOnline = selectedUser ? onlineUsers.includes(selectedUser._id) : false;

  return selectedUser ? (
    <div className={`bg-slate-900 border-l border-slate-800/50 text-slate-200 w-full h-full flex flex-col hidden lg:flex relative overflow-hidden`}>
     
      {/* Decorative background glow */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

      <div className='overflow-y-auto flex-1 flex flex-col p-6 scrollbar-hide'>
        
        {/* Profile Section */}
        <div className='flex flex-col items-center mt-6 text-center z-10'>
          <div className="relative mb-4">
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-24 h-24 object-cover rounded-full border-4 border-slate-800 shadow-xl'/>
            {isOnline && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-800 rounded-full"></span>
            )}
          </div>
          <h1 className='text-xl font-semibold tracking-tight text-white mb-1'>
            {selectedUser.fullName}
          </h1>
          <p className='text-sm text-slate-400 max-w-[200px] leading-relaxed'>
            {selectedUser.bio || "No bio available"}
          </p>
        </div>

        <hr className="border-slate-800/60 my-8 w-full"/>

        {/* Media Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Shared Media</h3>
            <span className="text-xs bg-slate-800 text-slate-400 py-0.5 px-2 rounded-full">{msgImages.length}</span>
          </div>

          {msgImages.length > 0 ? (
            <div className='grid grid-cols-2 gap-3 overflow-y-auto pr-1 pb-24'>
              {msgImages.map((url, index) => (
                <div className='cursor-pointer rounded-xl overflow-hidden aspect-square border border-slate-800 hover:border-blue-500/50 transition-all group relative'
                     key={index} onClick={() => window.open(url)}>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10"></div>
                  <img src={url} alt="" className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'/>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-slate-500 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs">No media shared</p>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-6 bg-slate-900 border-t border-slate-800/50 mt-auto shrink-0">
        <button onClick={() => logout()} 
          className='w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800/50 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 transition-all rounded-xl font-medium'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

    </div>
  ) : null
}

export default RightSidebar