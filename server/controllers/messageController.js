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
          const selectedUserId = req.params;
          const myId = req.user._id;
          
          const messages = await Messages.find({
               $or:[
                {senderId : myId ,recieverId : selectedUserId},
                 {senderId : selectedUserId ,recieverId : myId}
               ]
          })

          await Message.updateMany({senderId: selectedUserId , recieverId : myId},
          { seen : true});
          //marked messages as seen true  in DB

         res.json({success : false , messages})

        } catch(error){
            console.log(error.message)
           res.json({success : false , message : error.message})
    }
}

export const getMessages = async (req,res) =>{
    try{
          const selectedUserId = req.params;
          const myId = req.user._id;
          
          const messages = await Messages.find({
               $or:[
                {senderId : myId ,recieverId : selectedUserId},
                 {senderId : selectedUserId ,recieverId : myId}
               ]
          })

          await Message.updateMany({senderId: selectedUserId , recieverId : myId},
          { seen : true});
          //marked messages as seen true  in DB

         res.json({success : false , messages})

        } catch(error){
            console.log(error.message)
           res.json({success : false , message : error.message})
    }
}

export const markMessagesAsSeen = async (req,res) =>{
    try{
            const { id } = req.params;
          await Message.findByIdAndUpdate(id , {seen :true})
          res.json({success : true})
          //marked messages as seen true  in DB

        } catch(error){
            console.log(error.message)
           res.json({success : false , message : error.message})
    }
}