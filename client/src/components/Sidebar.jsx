import React from 'react'
import assets, { userDummyData } from "../assets/assets"
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ selectedUser , setSelectedUser})=>{
  const navigate = useNavigate();

  return (
    <div className={`glass-panel h-full p-6 rounded-r-3xl
     overflow-y-scroll  text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
      <div className='pb-6'>
        <div className='flex justify-between items-start gap-3'>
          <div>
            <img src={assets.logo} alt='logo' className='max-w-40'/>
          </div>
          <div className='relative py-2 group' >
            <img src={assets.menu_icon} alt='Menu' className='max-h-5 cursor-pointer'/>
            <div className='absolute top-full right-0 z-20 w-40 p-4 mt-3 rounded-2xl glass-panel border border-white/10 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'>
              <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm text-slate-100 hover:text-white'>Edit Profile</p>
              <hr className='my-3 border-t border-slate-600'/>
              <p className='cursor-pointer text-sm text-slate-100 hover:text-white'>Logout</p>
            </div>
          </div>
  </div>

  <div className='bg-[#584f9a] rounded-full flex items-center gap-2 px-2 py-2 w-64'>
    <img src={assets.search_icon} alt='Search' className='w-3'/>
    <input type='text' className='bg-transparent border-none outline-none
     text-white text-xs placeholder-[#c8c8c8] flex-1'
     placeholder='Search User'/>
  </div>
</div>  

<div className ='flex flex-col'>
  {userDummyData.map((user, index) => (
    <div key={index} 
    onClick={()=>setSelectedUser(user)}
    className={`relative flex items center gap-2 
      p-5 pl-4 rounded cursor-pointer max-sm:text-sm 
     ${selectedUser?.id === user.id ? 'bg-[#1c1a27]' : 'hover:bg-[#584f9a]/50'}`}>
      
      <img src={user?.profilePic || assets.avatar_icon} alt=""
      className=' w-10 mr-4 aspect-square rounded-full m-1'/>
      <div className='flex flex-col leading-5'>
        <p>{user?.fullName}</p>{
          index < 3 
          ? <span className='text-green-400 text-xs'> Online</span>
          : <span className='text-neutral-400 text-xs'>Offline</span>
        }
      </div>
       {index > 2 && <p className='absolute top-4 right-4 text-xs
      h-5 w-5 flex justify-center items-center
       rounded-full bg-violet-500/50'>{index}</p>}
       
       {/* //LEFT HERE */}
    </div>
  ))}

</div>
</div>
  
  )
}

export default Sidebar