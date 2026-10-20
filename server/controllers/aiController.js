import mongoose from 'mongoose';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { getSmartRepliesFromGemini } from '../services/aiService.js';

/**
 * Controller: Generate Smart Replies
 * Endpoint: GET /api/ai/smart-replies/:friendId
 * Access: Private (protectRoute)
 */
export const generateSmartReplies = async (req, res) => {
  try {
    const myId = req.user._id;
    const { friendId } = req.params;

    // 1. Validate friendId
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ success: false, message: 'Invalid friend ID.' });
    }

    if (friendId === myId.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot generate smart replies for yourself.' });
    }

    // 2. Fetch friend details for contextual personalization
    const friend = await User.findById(friendId).select('fullName');
    if (!friend) {
      return res.status(404).json({ success: false, message: 'Friend not found.' });
    }

    // 3. Query the last 5 messages between the two users
    // Uses compound index { senderId: 1, receiverId: 1, _id: -1 }
    const rawMessages = await Message.find({
      $or: [
        { senderId: myId, receiverId: friendId },
        { senderId: friendId, receiverId: myId }
      ]
    })
      .sort({ _id: -1 })
      .limit(5);

    // Edge Case: Empty conversation history - provide icebreakers
    if (!rawMessages || rawMessages.length === 0) {
      return res.status(200).json({
        success: true,
        suggestions: ["Hey there! 👋", "How's your day going?", "Great to connect!"]
      });
    }

    // Messages are fetched newest-first (_id: -1); reverse to chronological order
    const chronologicalMessages = [...rawMessages].reverse();

    // Check who sent the last message
    const lastMessage = chronologicalMessages[chronologicalMessages.length - 1];
    const isLastMessageFromFriend = lastMessage.senderId.toString() === friendId.toString();

    // If the last message was sent by me, smart replies are not needed
    if (!isLastMessageFromFriend) {
      return res.status(200).json({
        success: true,
        suggestions: []
      });
    }

    // Format messages for the AI service
    const formattedHistory = chronologicalMessages.map(msg => ({
      senderName: msg.senderId.toString() === myId.toString() ? req.user.fullName : friend.fullName,
      text: msg.text || (msg.image ? "[Attached an image]" : ""),
      isMe: msg.senderId.toString() === myId.toString()
    }));

    // Call Gemini AI Service
    const suggestions = await getSmartRepliesFromGemini(
      formattedHistory,
      friend.fullName,
      req.user.fullName
    );

    return res.status(200).json({
      success: true,
      suggestions: suggestions || []
    });

  } catch (error) {
    console.error("Error in generateSmartReplies controller:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate smart replies',
      error: error.message,
      suggestions: []
    });
  }
};
