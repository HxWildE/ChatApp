
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
      scrollEnd.current?.scrollIntoView({behavior:'smooth'})
   } 
},[messages, isTyping]);
 
  return selectedUser ? (
    <div className='relative h-full flex flex-col'>
      <div className = 'flex items-center gap-3 py-4 mx-4 border-b border-stone-500'>
      
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 h-8 rounded-full object-cover"/>
        <p className='flex-1 text-lg text-[#e4e4e7] flex items-center gap-2'>
         {selectedUser.fullName}
         {isTyping ? (
           <span className="text-xs text-zinc-400 font-medium animate-pulse">typing...</span>
         ) : (
           onlineUsers.includes(String(selectedUser._id)) && <span className = "w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm" title="Online"></span>
         )}
        </p>

        <img onClick={()=>setSelectedUser(null)} src={assets.menu_icon} 
        alt="" className='md:hidden max-w-7 cursor-pointer'/>
        <img src={assets.help_icon } alt="" 
        className='max-md:hidden max-w-5'/>
      
      </div>

      {/*chat area*/}

      <div className='flex-1 overflow-y-scroll p-3 pb-24'>
        
        { messages.map((msg,index)=>(
          <div key={index} className={`flex items-end gap-2 justify-end mb-6
          ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>

            { msg.image ? (
     <img src={msg.image} alt="" 
          className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"/>
            ) : (
      <p className={`py-2 px-3 max-w-[200px] md:text-sm font-light break-all shadow-sm
          ${msg.senderId === authUser._id 
            ? 'bg-emerald-600 text-white border border-emerald-500 rounded-xl rounded-br-sm' 
            : 'bg-orange-500 border border-orange-400 text-white rounded-xl rounded-bl-sm'}`}>
               {msg.text} </p>
            )}

            <div className = "text-center text-xs">
              <img src={ msg.senderId === authUser._id ? (authUser?.profilePic || assets.avatar_icon) : (selectedUser?.profilePic || assets.avatar_icon)} alt ="" className='w-7 h-7 rounded-full object-cover'/>
              <p className = 'text-gray-500'>{formatMessageTime(msg.createdAt)} </p>             
              </div>

          </div>
      ))}

      {isTyping && (
        <div className='flex items-center gap-2 justify-start mb-4 pl-1'>
          <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-6 h-6 rounded-full object-cover'/>
          <div className='bg-[#18181b] text-zinc-400 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 border border-[#27272a]'>
            <span>typing</span>
            <span className='animate-pulse'>...</span>
          </div>
        </div>
      )}

      <div ref={scrollEnd}></div>
    </div>

{/* bottomarea */}
    <div className='flex items-center gap-3 p-3 border-t border-[#27272a] bg-[#09090b]'>
      <div className='flex-1 flex items-center bg-[#18181b] px-3 rounded-lg border border-[#27272a]'>  
        
        <input onChange={handleInputChange} value={input}
        onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
        type="text" placeholder='Type a message'
          className='flex-1 text-sm p-3 border-none rounded-lg text-white 
          placeholder-gray-400 outline-none bg-transparent'/>
        <input onChange={handleSendImage} type="file" id='image' accept='image/png,image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer"/>
        </label>
      </div>
      <img onClick={handleSendMessage} src={assets.send_button} alt="" className="w-10 cursor-pointer" />
    </div>
  </div>

  ) : (
   <div className='flex flex-col items-center  justify-center
   h-full gap-2 text-gray-500  bg-[#000000] max-md:hidden'>
        <input onChange={handleSendImage} type="file" id='image' accept='image/png,image/jpeg' hidden />
  <p className='text-lg font-medium text-white'>
       Chat Anytime , Anywhere </p>
  </div>

  )
}


export default ChatContainer