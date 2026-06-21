import React,{useEffect ,useRef} from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils';

const ChatContainer = ({selectedUser, setSelectedUser }) => {
 
 const scrollEnd = React.useRef()
 
 useEffect(()=>{
  if(scrollEnd.current){
      scrollEnd.current.scrollIntoView({behavior:'smooth'})
   }
},[]);
 
  return selectedUser ? (
    <div className='relative h-full flex flex-col'>
      <div className = 'flex items-center gap-3 py-4 mx-4 border-b border-stone-500'>
      
        <img src={assets.profile_martin} alt="" className="w-8 rounded-full "/>
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          Martin Johnson 
          <span className = "w-2 h-2 rounded-full bg-green-500"></span>
        </p>

        <img onClick={()=>setSelectedUser(null)} src={assets.menu_icon} 
        alt="" className='md:hidden max-w-7'/>
        <img src={assets.help_icon } alt="" 
        className='max-md:hidden max-w-5'/>
      
      </div>

      {/*chat area*/}

      <div className='flex-1 overflow-y-scroll p-3 pb-24'>
        
        {messagesDummyData.map((msg,index)=>(
          <div key={index} className={`flex items-end gap-2 justify-end 
          ${msg.senderId !== '680f5116f10f3cd28382ed02' &&  'flex-row-reverse'}`}>

            { msg.image ? (<img src={msg.image} alt="" 
               className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"/>
            ) : (
            <p className={`p-2 max-w-200px md:text-sm font-light
              rounded-lg mb-8 break-all bg-violet-500/30 text-white
              ${msg.senderId === '680f5116f10f3cd28382ed02' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
               {msg.text} </p>
            )}
            <div className = "text-center text-xs">
              <img src={msg.senderId === '680f5116f10f3cd28382ed02' ? assets.avatar_icon : assets.profile_martin} alt ="" className='w-7 rounded-full'/>
              <p className = 'text-gray-500'>{formatMessageTime(msg.createdAt)} </p>             
              </div>

              {/* senderids are randomly filed -345j */}

          </div>
      ))}
      <div ref={scrollEnd}></div>
    </div>

{/* bottomarea */}
    <div className='flex items-center gap-3 p-3 border-t border-stone-500 bg-black/10'>
      <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>  
        <input type="text" placeholder='Type a message'
          className='flex-1 text-sm p-3 border-none rounded-lg text-white 
          placeholder-gray-400 outline-none bg-transparent'/>
        <input type="file" id='image' accept='image/png,image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer"/>
        </label>
      </div>
      <img src={assets.send_button} alt="" className="w-10 cursor-pointer" />
    </div>
  </div>

  ) : (
   <div className='flex flex-col items-center  justify-center
   h-full gap-2 text-gray-500  bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16'/>
  <p className='text-lg font-medium text-white'>
       Chat Anytime , Anywhere </p>
  </div>

  )
}


export default ChatContainer