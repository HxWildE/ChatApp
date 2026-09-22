
import { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/chatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
 
  const { messages , selectedUser, setSelectedUser , 
    sendMessage , getMessages} = useContext(ChatContext)

  const {authUser , onlineUsers, socket} = useContext(AuthContext)
   
 const scrollEnd = useRef()
 const typingTimeoutRef = useRef(null)

 const [input , setInput] = useState('');
 const [isTyping, setIsTyping] = useState(false);

 const handleInputChange = (e) => {
  const value = e.target.value;
  setInput(value);

  if (!socket || !selectedUser) return;

  if (value.trim() !== '') {
    socket.emit("typing", { receiverId: selectedUser._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 1500);
  } else {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("stopTyping", { receiverId: selectedUser._id });
  }
 };

 const handleSendMessage = async (e) =>{
  if (e) e.preventDefault();
  if(input.trim() === "") return;
  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  //manually clear debouncing
  socket?.emit("stopTyping", { receiverId: selectedUser._id });
  //send stopTyping here else it will show typing for 1.5 sec even after sendig message
  const textToSend = input.trim();
  setInput("");
  await sendMessage({text : textToSend});
 }

 //handle Sending an image
 const handleSendImage = async (e) =>{
      const file = e.target.files[0];
      if(!file || !file.type.startsWith("image/")){
          toast.error("Select an image file")
          return;
    }
    const reader = new FileReader();

    reader.onloadend = async () =>{
      await sendMessage({image : reader.result})
      e.target.value = ""
    }

    reader.readAsDataURL(file)
  }

  useEffect(() => {
      if(selectedUser){
        getMessages(selectedUser._id);
        setIsTyping(false);
      }
  },[selectedUser])

  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleUserTyping = ({ senderId }) => {
      if (String(senderId) === String(selectedUser._id)) {
        setIsTyping(true);
      }
    };

    const handleUserStopTyping = ({ senderId }) => {
      if (String(senderId) === String(selectedUser._id)) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleUserTyping);
    socket.on("stopTyping", handleUserStopTyping);

    return () => {
      socket.off("typing", handleUserTyping);
      socket.off("stopTyping", handleUserStopTyping);
    };
  }, [socket, selectedUser]);

  useEffect(()=>{
  if(scrollEnd.current){
      scrollEnd.current?.scrollIntoView({behavior:'auto'})
   } 
},[messages, isTyping]);
 
  return selectedUser ? (
    <div className='relative h-full flex flex-col min-h-0 min-w-0'>
      <div className = 'flex items-center gap-3 py-4 mx-4 border-b border-slate-800'>
      
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 h-8 rounded-full object-cover"/>
        <p className='flex-1 text-lg text-slate-100 flex items-center gap-2'>
         {selectedUser.fullName}
         {isTyping ? (
           <span className="text-xs text-blue-400 font-medium animate-pulse">typing...</span>
         ) : (
           onlineUsers.includes(String(selectedUser._id)) && <span className = "w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" title="Online"></span>
         )}
        </p>

        <img onClick={()=>setSelectedUser(null)} src={assets.menu_icon} 
        alt="" className='md:hidden max-w-7 cursor-pointer'/>
        <img src={assets.help_icon } alt="" 
        className='max-md:hidden max-w-5'/>
      
      </div>

      {/*chat area*/}

      <div className='flex-1 overflow-y-scroll p-3'>
        
        { messages.map((msg,index)=>(
          <div key={index} className={`flex items-end gap-2 mb-2 ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}>
            
            {msg.senderId !== authUser._id && (
               <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1'/>
            )}

            <div className={`flex flex-col gap-1 max-w-[75%] ${msg.senderId === authUser._id ? 'items-end' : 'items-start'}`}>
              { msg.image ? (
                <img src={msg.image} alt="" className="max-w-[250px] rounded-lg overflow-hidden shadow-sm"/>
              ) : (
                <p className={`py-[6px] px-3.5 md:text-sm font-normal break-words whitespace-pre-wrap
                  ${msg.senderId === authUser._id 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
                    : 'bg-[#27272a] text-zinc-100 rounded-2xl rounded-bl-sm'}`}>
                  {msg.text}
                </p>
              )}
              <span className='text-[10px] text-slate-500 font-medium'>{formatMessageTime(msg.createdAt)}</span>
            </div>

            {msg.senderId === authUser._id && (
               <img src={authUser?.profilePic || assets.avatar_icon} alt="" className='w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1'/>
            )}

          </div>
      ))}

      {isTyping && (
        <div className='flex items-center gap-2 justify-start mb-2 pl-1'>
          <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-7 h-7 rounded-full object-cover mb-1'/>
          <div className='bg-[#27272a] text-zinc-400 px-4 py-2 rounded-2xl rounded-bl-sm text-xs flex items-center gap-1'>
            <span>typing</span>
            <span className='animate-pulse'>...</span>
          </div>
        </div>
      )}

      <div ref={scrollEnd}></div>
    </div>

{/* bottomarea */}
    <div className='flex items-center gap-2 p-3 bg-slate-900'>
      <div className='flex-1 flex items-center bg-[#18181b] px-4 rounded-full focus-within:ring-1 focus-within:ring-blue-500 transition-shadow'>  
        
        <input onChange={handleInputChange} value={input}
        onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
        type="text" placeholder='Type a message...'
          className='flex-1 text-sm py-2.5 px-1 border-none bg-transparent text-slate-100 
          placeholder-slate-500 outline-none font-normal'/>
        <input onChange={handleSendImage} type="file" id='image' accept='image/png,image/jpeg' hidden />
        <label htmlFor="image" className="hover:opacity-80 transition-opacity">
          <img src={assets.gallery_icon} alt="Upload" className="w-5 cursor-pointer opacity-70 hover:opacity-100"/>
        </label>
      </div>
      <button onClick={handleSendMessage} className="p-2.5 bg-black hover:bg-[#111] border border-slate-800 transition-colors rounded-full flex items-center justify-center flex-shrink-0 group">
         <img src={assets.send_button} alt="Send" className="w-5 h-5 invert sepia saturate-[3] hue-rotate-[60deg] opacity-90 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  </div>

  ) : (
   <div className='flex flex-col items-center justify-center
   h-full gap-2 text-slate-500 bg-slate-950 max-md:hidden'>
        <input onChange={handleSendImage} type="file" id='image' accept='image/png,image/jpeg' hidden />
  <p className='text-lg font-medium text-slate-300 tracking-wide'>
       Chat Anytime, Anywhere </p>
  </div>

  )
}


export default ChatContainer