import FriendRequest from '../models/FriendRequest.js';
import Friendship from '../models/Friendship.js';
import User from '../models/User.js';
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

    // Check if receiver already sent a request to sender
    const reverseRequest = await FriendRequest.findOne({ 
      sender: receiverId, 
      receiver: senderId, 
      status: 'pending' 
    });
    if (reverseRequest) {
      return res.status(400).json({ 
        success: false, 
        message: "This user already sent you a friend request. Accept it instead!" 
      });
    }

    const newRequest = await FriendRequest.create({ sender: senderId, receiver: receiverId });
    
    const populatedRequest = await FriendRequest.findById(newRequest._id)
      .populate('sender', '-password -email')
      .lean();

    const receiverSocket = userSocketMap[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("friendRequestReceived", populatedRequest);
    }
    
    res.status(201).json({ success: true, data: populatedRequest });
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
    if (!request) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // Only the receiver of the request can accept it
    if (request.receiver.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ success: false, message: "Unauthorized to accept this request" });
    }

    await FriendRequest.findByIdAndDelete(requestId).session(session);

    const [user1, user2] = [request.sender, request.receiver].sort();
    await Friendship.create([{ user1, user2 }], { session });
    
    await session.commitTransaction();

    const senderSocket = userSocketMap[request.sender];
    if (senderSocket) {
      io.to(senderSocket).emit("friendRequestAccepted", { 
        userId: request.receiver,
        acceptedBy: req.user
      });
    }

    res.status(200).json({ success: true, message: "Friend request accepted." });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id.toString();

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.receiver.toString() !== userId && request.sender.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to manage this request" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ success: true, message: "Friend request removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { query } = req.query;

    const filter = { _id: { $ne: currentUserId } };
    if (query && query.trim()) {
      filter.fullName = { $regex: query.trim(), $options: 'i' };
    }

    const candidateUsers = await User.find(filter)
      .select('-password -email')
      .limit(30)
      .lean();

    // Query friendships involving current user
    const friendships = await Friendship.find({
      $or: [{ user1: currentUserId }, { user2: currentUserId }]
    }).lean();

    const friendIdSet = new Set(
      friendships.map(f => f.user1.toString() === currentUserId.toString() ? f.user2.toString() : f.user1.toString())
    );

    // Query pending requests involving current user
    const pendingRequests = await FriendRequest.find({
      status: 'pending',
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    }).lean();

    const sentRequestsMap = new Map();
    const receivedRequestsMap = new Map();

    pendingRequests.forEach(r => {
      if (r.sender.toString() === currentUserId.toString()) {
        sentRequestsMap.set(r.receiver.toString(), r._id);
      } else if (r.receiver.toString() === currentUserId.toString()) {
        receivedRequestsMap.set(r.sender.toString(), r._id);
      }
    });

    const enrichedUsers = candidateUsers.map(user => {
      const uIdStr = user._id.toString();
      let relationship = 'none';
      let requestId = null;

      if (friendIdSet.has(uIdStr)) {
        relationship = 'friend';
      } else if (sentRequestsMap.has(uIdStr)) {
        relationship = 'sent';
        requestId = sentRequestsMap.get(uIdStr);
      } else if (receivedRequestsMap.has(uIdStr)) {
        relationship = 'received';
        requestId = receivedRequestsMap.get(uIdStr);
      }

      return {
        ...user,
        relationship,
        requestId
      };
    });

    res.status(200).json({ success: true, users: enrichedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const received = await FriendRequest.find({ receiver: currentUserId, status: 'pending' })
      .populate('sender', '-password -email')
      .sort({ createdAt: -1 })
      .lean();

    const sent = await FriendRequest.find({ sender: currentUserId, status: 'pending' })
      .populate('receiver', '-password -email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, received, sent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
