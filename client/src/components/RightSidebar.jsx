import React,{useEffect,useRef} from 'react'
import assets, { imagesDummyData } from '../assets/assets'

// selected USer arg in this i have changed myself
// writing here for future debugging 

const RightSidebar = ({selectedUser, setSelectedUser }) => {
  return selectedUser ? (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll
    ${selectedUser ? "max-md:hidden" : ""}`}>
     
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full'/>
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <p className='w-2 h-2 rounded-full bg-green-500'></p>
        {selectedUser.fullName}
        </h1>
           <p className='px-10 mx-auto'> {selectedUser.bio} </p>
      </div>

      <hr className="border-[#ffffff50]"/>

      <div className="px-5 test-xs">
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2
        gap-4 opacity-80'>
       
        {imagesDummyData.map((url,index)=>(
            <div className ='cursor-pointer rounded'
            key={index} onClick= {()=>window.open(url)}>
              <img src={url} alt="" className='h-full rounded-md'/>
                   </div>
          ))}
        </div>
      </div>
      <button className='absolute bottom-3 left-1/2 
      transform -translate-x-1/2 bg-linear-to-r from-purple-400 to-violet-600 text-white 
      border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
            Logout
      </button>
    </div>
  ):null
}

export default RightSidebar