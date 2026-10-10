import FriendRequest from '../models/FriendRequest.js';
import Friendship from '../models/Friendship.js';
import mongoose from 'mongoose';
import { io, userSocketMap } from "../socket/socket.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ success: false, message: "Cannot send request to yourself." });
    }

    const [user1, user2] = [senderId, receiverId].sort();
    const existingFriendship = await Friendship.findOne({ user1, user2 });
    if (existingFriendship) {
      return res.status(400).json({ success: false, message: "Already friends." });
    }

    const newRequest = await FriendRequest.create({ sender: senderId, receiver: receiverId });
    
    const receiverSocket = userSocketMap[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("friendRequestReceived", newRequest);
    }
    
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: "Request already sent." });
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { requestId } = req.params;
    const request = await FriendRequest.findById(requestId).session(session);
    if (!request) throw new Error("Request not found");

    await FriendRequest.findByIdAndDelete(requestId).session(session);

    const [user1, user2] = [request.sender, request.receiver].sort();
    await Friendship.create([{ user1, user2 }], { session });
    
    await session.commitTransaction();

    const senderSocket = userSocketMap[request.sender];
    if (senderSocket) {
      io.to(senderSocket).emit("friendRequestAccepted", { userId: request.receiver });
    }

    res.status(200).json({ success: true, message: "Friend request accepted." });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};
