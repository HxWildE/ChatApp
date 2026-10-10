import Message from '../models/Message.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import { io, userSocketMap } from "../socket/socket.js";
 
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch only verified friends
    const Friendship = (await import("../models/Friendship.js")).default;
    const friendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }]
    });

    const friendIds = friendships.map(f => 
      f.user1.toString() === userId.toString() ? f.user2 : f.user1
    );

    const filteredUsers = await User.find({ _id: { $in: friendIds } }).select('-password');

    const unseenCounts = await Message.aggregate([
      {
        $match: {
          receiverId: userId,
          status: { $ne: 'seen' }
        }
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 }
        }
      }
    ]);

    const unseenMessages = {};
    unseenCounts.forEach((item) => {
      unseenMessages[item._id] = item.count;
    });
    res.status(200).json({
      success: true,
      users: filteredUsers,
      unseenMessages
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getMessages = async (req, res) => {
  try {
    const selectedUserId = req.params.id;
    const myId = req.user._id;

    // Pagination Parameters
    let limit = parseInt(req.query.limit) || 20;
    const cursor = req.query.cursor; // The _id of the oldest message currently loaded on the client

    if (limit < 1) limit = 20;
    if (limit > 50) limit = 50; // Prevent abusive limits

    const query = {
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    };

    // If a cursor is provided, only fetch messages older 
    // than the cursor
    if (cursor) {
      query._id = { $lt: cursor };
    }

    const messages = await Message.find(query)
      .sort({ _id: -1 }) // Sort by _id descending (newest first)
      .limit(limit);

    // Messages are fetched newest first, reverse them for chronological UI rendering
    const chronologicalMessages = messages.reverse();

    // Determine the next cursor (the _id of the oldest message in this batch)
    // Since chronologicalMessages is reversed, the oldest message is at index 0.
    // If we fetched less than the limit, there are no more messages to fetch.
    const hasMore = messages.length === limit;
    const nextCursor = hasMore && chronologicalMessages.length > 0 ? chronologicalMessages[0]._id : null;

    // Mark retrieved unseen messages as delivered/seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, status: { $ne: 'seen' } },
      { status: 'seen' }
    );

    res.status(200).json({ 
      success: true, 
      messages: chronologicalMessages,
      pagination: {
        nextCursor,
        limit,
        hasMore
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const markMessagesAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { status: 'seen' });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const sendMessage = async (req,res) =>{
    try{
        const {text , image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
          const upload = await cloudinary.uploader.upload(image);
          imageUrl = upload.secure_url;
        }

      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image :imageUrl
      })

      const receiverSocketId = userSocketMap[receiverId];
      if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage" , newMessage);
      } 

  res.status(201).json({success : true , newMessage})

    }catch(error){
  console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
    }
}