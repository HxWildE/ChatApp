import Message from "../models/Message";
import User from "../models/User";

export const getUsersForSidebar = async (req , res) =>{
    try{
        const userId = req.user._id;
        const filteredUsers = await User.find({_id :{_id : {$ne :userId}}}).select("-password");
    
    const unseenMessages = {}
    const promises = filteredUsers.map(async (user) =>{
            const messages   =  await Message.find({senderId : user._id , recieverId : userId 
                , seen :false})         

                if(messages.length > 0){
        unseenMessages[user._id] = messages.length;
    }
})

await Promise.all(promises);
res.json({
      success: true,
      users : filteredUsers, 
      unseenMessages
    })

} catch(error){
   console.log(error.message)
   res.json({success : false , message : error.message})
    }
}

//Get all messages for selected user

export const getMessages = async (req,res) =>{
    try{
             
} catch(error){
   console.log(error.message)
   res.json({success : false , message : error.message})
    }
}