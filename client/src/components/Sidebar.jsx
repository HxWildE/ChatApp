import { useContext, useEffect, useState } from 'react'
import assets from "../assets/assets"
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../../context/chatContext'
import { AuthContext } from '../../context/AuthContext'

const Sidebar = () => {
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    unseenMessages, 
    setUnseenMessages,
    incomingRequestsCount 
  } = useContext(ChatContext)

  const { logout, onlineUsers } = useContext(AuthContext)

  const [input, setInput] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate();

  const filteredUsers = input 
    ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) 
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div className={`h-full p-6 text-slate-200 flex flex-col border-r border-slate-800/80
     overflow-y-auto ${selectedUser ? 'max-md:hidden' : ''}`}>
      <div className='pb-4'>
        {/* Top Header with Logo, Explore Button, and Menu */}
        <div className='flex justify-between items-center gap-2 mb-4'>
          <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/')}>
            <img src={assets.logo} alt='logo' className='w-10 h-10 rounded-full shadow-md object-cover' />
            <span className='font-bold text-sm tracking-wide text-white'>NEXUS</span>
          </div>

          <div className='flex items-center gap-2'>
            {/* Explore / Add Friends Button */}
            <button
              onClick={() => navigate('/explore')}
              className='relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold shadow-md transition duration-150'
              title='Explore and find friends'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Explore</span>
              {incomingRequestsCount > 0 && (
                <span className='absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse'>
                  {incomingRequestsCount}
                </span>
              )}
            </button>

            {/* Menu Icon */}
            <div className='relative'>
              <img
                src={assets.menu_icon}
                alt='Menu'
                className='max-h-5 cursor-pointer p-1 rounded hover:bg-white/10 transition duration-150'
                onClick={() => setShowMenu(prev => !prev)}
              />
              {showMenu && (
                <div className='absolute top-full right-0 z-50 w-44 p-3 mt-2 rounded-xl border border-slate-800 shadow-2xl bg-slate-800 text-slate-200'>
                  <p
                    onClick={() => { setShowMenu(false); navigate('/explore'); }}
                    className='cursor-pointer text-xs text-slate-100 hover:text-white py-1.5 px-2 rounded hover:bg-white/10 transition flex items-center justify-between'
                  >
                    <span>Explore Friends</span>
                    {incomingRequestsCount > 0 && (
                      <span className='text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded-full font-bold'>
                        {incomingRequestsCount}
                      </span>
                    )}
                  </p>
                  <p
                    onClick={() => { setShowMenu(false); navigate('/profile'); }}
                    className='cursor-pointer text-xs text-slate-100 hover:text-white py-1.5 px-2 rounded hover:bg-white/10 transition'
                  >
                    Edit Profile
                  </p>
                  <hr className='my-2 border-t border-slate-700' />
                  <p
                    onClick={() => { setShowMenu(false); logout(); }}
                    className='cursor-pointer text-xs text-red-400 hover:text-red-300 py-1.5 px-2 rounded hover:bg-red-500/10 transition'
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Local Search Input */}
        <div className='bg-slate-800/90 border border-slate-700/80 rounded-lg flex items-center gap-2 px-3 py-2 w-full'>
          <img src={assets.search_icon} alt='Search' className='w-3 opacity-70' />
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)} 
            type='text' 
            className='bg-transparent border-none outline-none text-slate-200 text-xs placeholder-slate-500 flex-1'
            placeholder='Search Friends...' 
          />
          {input && (
            <button onClick={() => setInput('')} className='text-xs text-slate-400 hover:text-white'>✕</button>
          )}
        </div>
      </div>

      {/* Friends List or Empty State */}
      <div className='flex flex-col flex-1 overflow-y-auto'>
        {filteredUsers.length === 0 ? (
          input ? (
            <div className='text-center py-10 text-xs text-slate-500'>
              No friends match "{input}"
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-12 px-2 text-center my-auto'>
              <div className='w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-xl mb-3'>
                👥
              </div>
              <p className='text-xs font-semibold text-slate-300'>No friends added yet</p>
              <p className='text-[11px] text-slate-500 mt-1 max-w-[190px] leading-relaxed'>
                Find and add users on the Explore page to start conversations.
              </p>
              <button 
                onClick={() => navigate('/explore')}
                className='mt-4 py-2 px-4 bg-white hover:bg-slate-200 text-black rounded-lg text-xs font-bold transition shadow-md'
              >
                Find Friends
              </button>
            </div>
          )
        ) : (
          filteredUsers.map((user, index) => {
            const isOnline = onlineUsers.includes(String(user._id));
            const isSelected = selectedUser?._id === user._id;

            return (
              <div 
                key={user._id || index}
                onClick={() => {
                  setSelectedUser(user); 
                  setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));
                }}
                className={`relative flex items-center gap-2.5 p-3.5 cursor-pointer max-sm:text-sm transition-all duration-200 rounded-xl mb-1
                  ${isSelected ? 'bg-blue-600/20 border border-blue-500/40 text-white' : 'hover:bg-slate-800/50 border border-transparent text-slate-300'}`}
              >
                <div className='relative shrink-0'>
                  <img 
                    src={user?.profilePic || assets.avatar_icon} 
                    alt={user.fullName}
                    className='w-11 h-11 object-cover rounded-full border border-slate-700' 
                  />
                  {isOnline && (
                    <span className='absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full'></span>
                  )}
                </div>

                <div className='flex flex-col flex-1 min-w-0'>
                  <p className='font-semibold text-xs text-white truncate'>{user?.fullName}</p>
                  <span className={`text-[11px] mt-0.5 ${isOnline ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>

                {unseenMessages[user._id] > 0 && (
                  <span className='text-xs h-5 min-w-[20px] px-1 flex justify-center items-center rounded-full bg-blue-600 text-white font-bold shrink-0'>
                    {unseenMessages[user._id]}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;