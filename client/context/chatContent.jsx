import { createContext, useContext, useState } from 'react'
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const ChatContext = createContext();

export const ChatProvider = ({ children}) =>{


    const [messages , setMessages ] = useState([]);
    const [users , setUsers] = useState([]);
    const [selectedUser , setSelectedUser ] = useState(null);
    const [unseenMessages , setunseenMessages ] = useState({})
   
    const { socket ,axios } = useContext(AuthContext);

    const getUSers = async () =>{
        try{
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users)
                setunseenMessages(data.unseenMessages)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

        //fucntion to getMessages fr selected users
    const geMessages = async (userId) =>{
        try{
            const {data} = await axios.get(`/api/messages/${userId}`);
              if(data.success){
                setMessages(data.messages)
            }
        }catch(error){
            toast.error(error.message)
        }
    }


const sendMessage = async (messageData) =>{
        try{
            const {data} = await axios.get(`/api/messages/${selectedUser._id}`);
              if(data.success){
                setMessages((prevMessages) => [...prevMessages , data.newMessage])
            }else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error(error.message)
        }
    }
    
    
const subscribetoMessages = async () =>{
    if(!socket) return;

    socket.on("newMessage" ,(newMessage) =>{
        if(selectedUser && newMessage.senderId === selectedUser._id){
            newMessage.seen = true;
            setMessages(()=>[...newMessage])
        }
    })
}

    const value = {}

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )

}