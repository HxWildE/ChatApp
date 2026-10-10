import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },
    image: { type: String },
    status: { 
      type: String, 
      enum: ['sent', 'delivered', 'seen'], 
      default: 'sent' 
    }
  },
  { timestamps: true }
);

// Compound index for optimal cursor pagination performance
messageSchema.index({ senderId: 1, receiverId: 1, _id: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;

