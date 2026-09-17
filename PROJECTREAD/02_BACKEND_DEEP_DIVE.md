# 🌟 02 — Backend Deep Dive
### 📌 Every File, Every Line, Explained

> **Reading Goal**: You should understand what every server file does, why it's written the way it is, and what breaks if you remove/change any part.
> 
> ⚡ **UPDATE**: This doc reflects the current codebase which uses **Zod** for server-side input validation and **Express 5** (latest major version).

---

## 🚀 1. Entry Point — `server.js`

This is the **first file Node.js runs**. It wires everything together.

```js
import 'dotenv/config';          // Load .env file into process.env IMMEDIATELY
import express from 'express';   // HTTP framework
import http from 'http';         // Node's built-in HTTP module
import cors from 'cors';         // Allow cross-origin requests (browser <-> server)
import connectDB from './lib/db.js';
import messageRouter from './routes/messageRoutes.js';
import userRouter from './routes/userRoutes.js';
import { Server } from "socket.io"
```

### 📌 Why `http.createServer(app)` instead of just `app.listen()`?

```js
const app = express();
const server = http.createServer(app);  // KEY LINE
```

**The reason**: Socket.io needs to attach to the raw HTTP server, not the Express app directly.
`app.listen()` creates its own HTTP server internally. But Socket.io needs access to that server object to upgrade HTTP connections to WebSocket. So we create it explicitly and share it.

```js
export const io = new Server(server, {   // Socket.io wraps the HTTP server
  cors: { origin: "*", methods: ["GET", "POST"] }
});
```

### 📌 The userSocketMap

```js
export const userSocketMap = {}; // { "userId123": "socketId_abc" }
```

This is an **in-memory dictionary** mapping each user's MongoDB `_id` to their current socket connection ID.

- When user connects: `userSocketMap[userId] = socket.id`
- When user disconnects: `delete userSocketMap[userId]`
- When sending a message: look up receiver's socketId here to deliver directly

**What breaks if removed?** — Messages would still save to DB, but the receiver wouldn't get them in real-time. They'd only see new messages after refreshing.

### 📌 Socket.io Event Handlers

```js
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  // socket.handshake.query = the ?userId=xxx from the socket connection URL
```

The `socket.handshake` is like the HTTP request that started the WebSocket. The client sends `userId` in the query string when connecting.

```js
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
```

`io.emit` = broadcast to **ALL** connected sockets. Every time anyone connects or disconnects, every client gets an updated list of online user IDs.

```js
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });
```

`io.to(socketId).emit(...)` = send to **only one** specific socket. This is how direct messaging works — not broadcast, targeted delivery.

### 📌 Express Middleware

```js
app.use(express.json({ limit: '15mb' }));          // Parse JSON body
app.use(express.urlencoded({ extended: true, limit: '15mb' })); // Parse form data
app.use(cors());                                    // Allow all origins
```

**Why 15mb limit?** — Base64-encoded images are ~33% larger than the original file. A 10MB image becomes ~13MB in base64. The limit allows sending images in request bodies before they're uploaded to Cloudinary.

**What is `cors()`?** — By default, browsers block JavaScript from making requests to a different domain/port (same-origin policy). `cors()` tells the browser "it's okay for any origin to call this API."

### 📌 Health Check Endpoint

```js
app.use('/api/status', (req, res) => res.send('Server is live !'));
```

A simple endpoint to verify the server is running. Useful for deployment health checks and uptime monitoring.

---

## 🚀 2. Database — `lib/db.js`

```js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('Database Connected'));
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
```

**Mongoose** is the ODM (Object Document Mapper) for MongoDB. It lets you:
1. Define schemas (field types, validation)
2. Create Models (classes that represent collections)
3. Query the DB with `.find()`, `.create()`, `.findByIdAndUpdate()`, etc.

The URI `mongodb+srv://...` connects to **MongoDB Atlas** (cloud). The `/chat-app` at the end is the **database name** inside the cluster.

**Why `async/await`?** — Connecting to a remote database takes time (network request). Async lets Node continue doing other things while waiting. `await` pauses only this function, not the whole server.

---

## 🚀 3. Auth Token — `lib/utils.js`

```js
import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};
```

### 📌 What is JWT?

JWT = JSON Web Token. It's a **signed string** with 3 parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9    ← Header (algorithm info)
.eyJ1c2VySWQiOiI2N2ZiMzc..."}            ← Payload (your data: { userId })
.SflKxwRJSMeKKF2QT4fwpMeJ...             ← Signature (HMAC of header+payload)
```

The server signs it with `JWT_SECRET`. Anyone can decode the header+payload (it's just base64), but **can't forge the signature** without knowing the secret.

```js
jwt.sign({ userId }, process.env.JWT_SECRET)
```

- `{ userId }` = the data embedded in the token (the "payload")
- `JWT_SECRET` = the private key only the server knows
- No expiry set here — token lasts forever (a production app should add `{ expiresIn: '7d' }`)

**Interview trap**: "Is JWT encrypted?" — **No!** The payload is base64-encoded (reversible), not encrypted. Don't put sensitive data in it. It's signed, not secret.

---

## 🚀 4. Auth Middleware — `middleware/auth.js`

```js
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;          // Read token from request header
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify + decode
    const user = await User.findById(decoded.userId).select('-password'); // Fetch user
    
    if (!user) {
      return res.json({ success: false, message: 'User not Found !' });
    }
    
    req.user = user;  // Attach user to request object
    next();           // Pass control to the next function (the actual controller)
  } catch (error) {
    res.json({ success: false, message: 'User not found!' });
  }
};
```

### 📌 Middleware Pattern Explained

Express middleware is any function with `(req, res, next)`. The `next()` call passes control to the next function in the chain.

```
Request → protectRoute → (if valid) → sendMessage controller
                       → (if invalid) → returns error, stops here
```

### 📌 Why `.select('-password')`?

This tells Mongoose: "Give me all fields **except** password." The `-` prefix means "exclude". This prevents accidentally sending the hashed password to the frontend.

### 📌 How the token gets there (client side):

```js
// In AuthContext.jsx
api.defaults.headers.common["token"] = token;
// This sets the "token" header on ALL future axios requests from this instance
```

So every request automatically carries the JWT. The middleware reads `req.headers.token` to find it.

---

## 🚀 5. Mongoose Models

### 📌 `models/User.js`

```js
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: '' },
    bio: { type: String }
  },
  { timestamps: true }   // Adds: createdAt, updatedAt automatically
);

const User = mongoose.model('User', userSchema);
```

**What `mongoose.model('User', userSchema)` does:**
- Creates a model class named `User`
- Automatically uses the collection `users` in MongoDB (pluralized, lowercased)
- Every instance of this class represents one document (one row)

**`{ timestamps: true }`** — Mongoose automatically adds and manages `createdAt` and `updatedAt` fields. You never set them manually.

### 📌 `models/Message.js`

```js
const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },         // Optional — can send image only
    image: { type: String },        // Optional — Cloudinary URL
    seen: { type: Boolean, default: false }
  },
  { timestamps: true }
);
```

**`mongoose.Schema.Types.ObjectId`** — This is MongoDB's special ID type (24-char hex string like `67fb37...`). Each document in MongoDB has a unique `_id` of this type.

**`ref: 'User'`** — This is a reference (like a foreign key in SQL). It tells Mongoose that `senderId` points to a document in the `User` collection. This enables `.populate()` to join data (not used here but the relationship is declared).

**Why both `text` and `image` are optional?** — A message can be text-only, image-only, or both. Mongoose validates them independently.

---

## 🚀 6. Controllers — The Business Logic

### 📌 `controllers/userController.js`

#### Zod Validation Schemas (NEW — not in earlier docs)

```js
import { z } from 'zod';

const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  bio: z.string().min(1, 'Bio is required')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});
```

**What is Zod?** — A TypeScript-first schema validation library. It defines the *shape* of expected data and validates against it. `safeParse` returns `{ success, data, error }` without throwing. This replaces manual `if (!field)` checks with structured, descriptive validation.

**Why `safeParse` not `parse`?** — `parse` throws a `ZodError` on invalid data (needs try-catch). `safeParse` returns a result object — more elegant for handling expected invalid input without exceptions.

#### `signup`

```js
export const signup = async (req, res) => {
  // 1. Validate inputs with Zod
  const validatedData = signupSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res.json({
      success: false,
      message: validatedData.error.errors[0].message  // First error's message
    });
  }
  
  const { fullName, email, password, bio } = validatedData.data;  // Validated data
  
  // 2. Check if email already exists
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ success: false, message: 'Account Already exists' });
  }
  
  // 3. Hash the password
  const salt = await bcrypt.genSalt();         // Generates random salt
  const hashedPassword = await bcrypt.hash(password, salt);  // Hash = f(password, salt)
  
  // 4. Create user in DB
  const newUser = await User.create({
    fullName, email, password: hashedPassword, bio
  });
  
  // 5. Generate JWT and send back
  const token = generateToken(newUser._id);
  res.json({ success: true, userData: newUser, token, message: 'Account Created Successfully' });
};
```

**The bcrypt flow:**
```
"mypassword" + random_salt → bcrypt.hash() → "$2b$10$N9qo8uLOickgx..."
```
Salt is embedded in the hash string. Next time you verify, bcrypt extracts the salt from the hash and re-hashes the input to compare.

#### `login`

```js
// Zod validates email format + password presence first
const validatedData = loginSchema.safeParse(req.body);
if (!validatedData.success) {
  return res.json({ success: false, message: validatedData.error.errors[0].message });
}

const isPasswordCorrect = await bcrypt.compare(password, userData.password);
```

`bcrypt.compare(plaintext, hash)` — extracts the salt from the stored hash, hashes the input the same way, and compares. Returns `true` or `false`. Never decrypts.

**Note**: Login returns `"Invalid Credentials"` for both "email not found" and "wrong password" — this prevents attackers from knowing which emails are registered (enumeration attack).

#### `updateProfile`

```js
if (profilePic) {
  const upload = await cloudinary.uploader.upload(profilePic);
  updateData.profilePic = upload.secure_url;  // Store the CDN URL, not the raw image
}

const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true })
  .select('-password');
```

**`{ new: true }`** — By default, `findByIdAndUpdate` returns the document **before** the update. `{ new: true }` makes it return the **updated** document.

**Why store CDN URL, not the image?** — Cloudinary gives you a URL like `https://res.cloudinary.com/.../image.jpg`. Storing this URL in MongoDB means:
- DB stores tiny string (not MB of image data)
- Images are served globally via CDN (fast)
- You can apply transformations via URL params

### 📌 `controllers/messageController.js`

#### `getUsersForSidebar`

```js
const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');
```

`$ne` = "not equal". Finds all users where `_id` is NOT equal to the logged-in user's ID. You don't want to see yourself in your own contact list.

```js
const promises = filteredUsers.map(async (user) => {
  const messages = await Message.find({
    senderId: user._id,
    receiverId: userId,
    seen: false
  });
  if (messages.length > 0) unseenMessages[user._id] = messages.length;
});

await Promise.all(promises);
```

**Why `Promise.all`?** — `map` creates an array of Promises (async operations). `Promise.all` runs them **in parallel** and waits for all to complete. Without it, you'd only get the Promise objects, not the results.

Without Promise.all, the `unseenMessages` object would be empty when the response is sent.

#### `getMessages`

```js
const messages = await Message.find({
  $or: [
    { senderId: myId, receiverId: selectedUserId },
    { senderId: selectedUserId, receiverId: myId }
  ]
});
```

`$or` — MongoDB query operator. Find messages where (I sent to them) OR (they sent to me). This gets the full conversation thread.

```js
await Message.updateMany(
  { senderId: selectedUserId, receiverId: myId },
  { seen: true }
);
```

When you open a chat, all their messages to you are marked as seen immediately.

#### `sendMessage` — The most important function

```js
export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const receiverId = req.params.id;  // from the URL /send/:id
  const senderId = req.user._id;     // from protectRoute middleware

  // 1. If image, upload to Cloudinary
  let imageUrl;
  if (image) {
    const upload = await cloudinary.uploader.upload(image); // image = base64 string
    imageUrl = upload.secure_url;                           // get CDN URL back
  }

  // 2. Save message to DB
  const newMessage = await Message.create({
    senderId, receiverId, text, image: imageUrl
  });

  // 3. Real-time delivery if receiver is online
  const receiverSocketId = userSocketMap[receiverId];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.json({ success: true, newMessage });
};
```

**The image pipeline:**
```
User picks file → FileReader converts to base64 → axios POST (base64 in body)
→ Cloudinary.upload(base64) → returns { secure_url: "https://res.cloudinary.com/..." }
→ Store URL in MongoDB Message document
```

---

## 🚀 7. Routes — URL Mapping

### 📌 `routes/userRoutes.js`
```js
userRouter.post("/signup", signup)                            // No auth
userRouter.post("/login", login)                              // No auth
userRouter.put("/update-profile", protectRoute, updateProfile) // Auth required
userRouter.get("/check", protectRoute, checkAuth)             // Auth required
```

### 📌 `routes/messageRoutes.js`
```js
messageRouter.get('/users', protectRoute, getUsersForSidebar);    // Get contacts
messageRouter.get('/:id', protectRoute, getMessages);              // Get conversation
messageRouter.get('/mark/:id', protectRoute, markMessagesAsSeen);  // Mark as seen
messageRouter.post('/send/:id', protectRoute, sendMessage);        // Send message
```

**Note**: `/mark/:id` uses GET not POST. This is technically incorrect REST convention (marking as seen is a state change = should be PUT/PATCH), but it works. A common shortcut in smaller projects.

---

## 🚀 8. Cloudinary Setup — `lib/cloudinary.js`

```js
import { v2 as cloudinary } from "cloudinary";  // Import v2 API
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
export default cloudinary;
```

This configures the Cloudinary SDK once. Any file that imports `cloudinary` gets the pre-configured instance. Exporting as default means: `import cloudinary from './lib/cloudinary.js'` in any controller.

---

## 🚀 9. What Breaks If You Remove Each Part?

| Remove | What Breaks |
|--------|-------------|
| `dotenv/config` import | All `process.env.*` = undefined. DB won't connect, JWT won't work |
| `cors()` | Browser blocks all requests from frontend (CORS error in console) |
| `protectRoute` from a route | Anyone can access that endpoint without logging in |
| `userSocketMap` | Real-time delivery stops — messages save but aren't pushed to receiver |
| `bcrypt.hash` on signup | Passwords stored in plaintext — catastrophic security hole |
| `jwt.verify` in auth middleware | Anyone can pass any string as a token and get in |
| `{ new: true }` in findByIdAndUpdate | Profile update returns stale data, UI shows old info |
| `Promise.all` | Unseen message counts always 0 (promises not awaited) |
| `limit: '15mb'` | Images over ~1MB are rejected with "request entity too large" error |
| Zod `safeParse` | No server-side validation — malformed data hits DB, potential crashes |
| `http.createServer(app)` | Socket.io can't attach — no real-time features at all |

---

*Next: `03_FRONTEND_DEEP_DIVE.md` — React, Context, Axios, every component.*
