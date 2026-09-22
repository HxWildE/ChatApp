import { useContext, useEffect, useState } from 'react'
import assets from "../assets/assets"
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../../context/chatContext'
import { AuthContext } from '../../context/AuthContext'

const Sidebar = () => {        //destructured props picked up here, selectedUser = variable 

  const { getUsers, users, selectedUser, setSelectedUser
    , unseenMessages, setUnseenMessages } = useContext(ChatContext)

  const { logout, onlineUsers } = useContext(AuthContext)

  const [input, setInput] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  //setSEelctedUSer a function
  const navigate = useNavigate();

  const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers])
//useEffect captures side effecTs (api call is involved)

  return (
    <div className={`h-full p-6 text-slate-200
     overflow-y-scroll ${selectedUser ? 'max-md:hidden' : ''}`}>
      <div className='pb-6'>
        <div className='flex justify-between items-start gap-3'>
          <div>
            <img src={assets.logo} alt='logo' className='w-12 h-12 rounded-full shadow-md object-cover' />
          </div>
          <div className='relative py-2'>
            <img
              src={assets.menu_icon}
              alt='Menu'
              className='max-h-5 cursor-pointer p-1 rounded hover:bg-white/10 transition duration-150'
              onClick={() => setShowMenu(prev => !prev)}
            />
            {showMenu && (
              <div className='absolute top-full right-0 z-50 w-40 p-4 mt-2 rounded-xl border border-slate-800 shadow-2xl bg-slate-800 text-slate-200'>
                <p
                  onClick={() => { setShowMenu(false); navigate('/profile'); }}
                  className='cursor-pointer text-sm text-slate-100 hover:text-white py-1.5 px-2 rounded hover:bg-white/10 transition'
                >
                  Edit Profile
                </p>
                <hr className='my-2 border-t border-slate-600/60' />
                <p
                  onClick={() => { setShowMenu(false); logout(); }}
                  className='cursor-pointer text-sm text-slate-100 hover:text-white py-1.5 px-2 rounded hover:bg-white/10 transition'
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='bg-slate-800 border border-slate-700 rounded-lg flex items-center gap-2 px-3 py-2 w-64'>
          <img src={assets.search_icon} alt='Search' className='w-3 opacity-70' />
          <input onChange={(e) => setInput(e.target.value)} type='text' className='bg-transparent border-none outline-none
     text-slate-200 text-xs placeholder-slate-500 flex-1'
            placeholder='Search User' />
        </div>
      </div>

      <div className='flex flex-col'>
        {filteredUsers.map((user, index) => (
          <div key={index}
            onClick={() => {
              setSelectedUser(user); setUnseenMessages(prev =>
                ({ ...prev, [user._id]: 0 }))
            }}

            className={`relative flex items-center gap-2 
      p-4 cursor-pointer max-sm:text-sm transition-all duration-200 border-b
    ${selectedUser?._id === user._id ? 'bg-blue-900/20 border-blue-500/30' : 'border-slate-800/60 hover:bg-slate-800/30'}`}>

            <img src={user?.profilePic || assets.avatar_icon} alt=""
              className='w-12 h-12 mr-3 object-cover rounded-full m-1' />
            <div className='flex flex-col leading-5'>
              <p>{user?.fullName}</p>{
                onlineUsers.includes(String(user._id))
                  ? <span className='text-green-400 text-xs font-medium'>Online</span>
                  : <span className='text-neutral-400 text-xs'>Offline</span>
              }
            </div>
            {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs
      h-5 w-5 flex justify-center items-center
      rounded-full bg-blue-600 text-white font-medium'>{unseenMessages[user._id]}</p>}

            {/* //LEFT HERE */}
          </div>
        ))}

      </div>
    </div>

  )
}

export default Sidebar