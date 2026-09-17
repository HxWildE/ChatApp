# 🌟 05 — 100 Interview Questions
### 📌 Every Question You Could Be Asked About This Project

> **How to use this**: Read one section. Close this doc. Answer out loud. Open again. Check.
> The questions are in order of likelihood — highest first.

---

## 🚀 SECTION A — "Tell Me About Your Project" (Questions 1–15)

These are your first 10-minute intro. Know all of these cold.

---

**Q1. Walk me through your project in 2 minutes.**

> "I built a real-time 1-on-1 chat application using the MERN stack — MongoDB, Express, React, and Node.js — with Socket.io for real-time messaging. Users can register and log in securely using JWT-based authentication with bcrypt password hashing. Once logged in, they can chat with any registered user — messages appear instantly using WebSocket connections. Users can also send images, which are uploaded to Cloudinary and stored as CDN URLs. There's a typing indicator system, online presence tracking, and unseen message counts. On the frontend, I used React 19 with Vite for fast development, managed global state with the Context API, and used Axios with a pre-configured instance for all API calls."

---

**Q2. What tech stack did you use and why?**

- 💡 **Node.js + Express 5** — Non-blocking I/O, same language as frontend, large npm ecosystem, Express 5 has better async error handling
- 💡 **MongoDB + Mongoose 9** — Flexible document model suits chat (messages can be text or image), JSON-native, Atlas for managed cloud hosting
- 💡 **React 19 + Vite 8** — Component-based UI, fast HMR, large ecosystem
- 💡 **JWT** — Stateless auth, works across distributed servers, no session store needed
- 💡 **Socket.io** — Real-time bidirectional events with auto-reconnect and fallback
- 💡 **Cloudinary** — CDN for images, avoids MongoDB's 16MB document limit
- 💡 **Zod 4** — Server-side schema validation for request bodies — structured error messages, TypeScript-first

---

**Q3. How does authentication work in your app?**

1. User submits credentials → POST `/api/auth/login`
2. **Zod** validates input format: `loginSchema.safeParse(req.body)` — checks email format, password presence
3. Server verifies password with `bcrypt.compare()`
4. If valid: `jwt.sign({ userId }, JWT_SECRET)` generates a token
5. Token sent to client in HTTP response
6. Client stores token in `localStorage`
7. All future requests send `token` in the HTTP header via Axios default headers
8. `protectRoute` middleware verifies the token and attaches the user object to `req.user`
9. On page refresh: token from localStorage → `checkAuth` → validates → restores session

---

**Q4. What happens when a user sends a message?**

1. User types, hits send in `ChatContainer`
2. `sendMessage({ text })` called from ChatContext
3. `axios.post("/api/messages/send/:id", { text })` with JWT header
4. Backend: verifies JWT → saves message to MongoDB → checks `userSocketMap` for receiver
5. If receiver online: `io.to(socketId).emit("newMessage", msg)` — instant push
6. HTTP response returns the saved message
7. Sender's UI updates via HTTP response; receiver's UI updates via Socket event

---

**Q5. How does the typing indicator work?**

- Sender emits `socket.emit("typing", { receiverId })` on input change
- Server relays it: `io.to(receiverSocketId).emit("typing", { senderId })`
- Receiver's `ChatContainer` listens for `"typing"` event → `setIsTyping(true)`
- Debounce: a 1.5-second timer auto-emits `"stopTyping"` if user pauses typing
- Receiver hides the indicator when `"stopTyping"` is received

---

**Q6. How do you handle images?**

- User selects a file → `FileReader.readAsDataURL()` converts it to base64
- Base64 string sent in POST body (15mb limit configured in Express)
- Server: `cloudinary.uploader.upload(base64)` → returns `{ secure_url }`
- URL stored in MongoDB Message document
- All clients receive the URL and browser fetches the image from Cloudinary CDN

---

**Q7. How do you know who is online?**

- On login, client calls `connectSocket(user)` → Socket.io connection established with `userId` in query
- Server adds to `userSocketMap = { userId: socketId }`
- Server broadcasts `io.emit("getOnlineUsers", Object.keys(userSocketMap))`
- All clients receive this and update `onlineUsers` state
- On disconnect, server removes user and re-broadcasts

---

**Q8. What is Context API and why did you use it?**

Context API is React's built-in global state solution. I used it to avoid prop drilling — passing `authUser`, `socket`, `messages` etc. through every component layer. Instead:
- `AuthContext` holds auth state (user, token, socket, online users)
- `ChatContext` holds chat state (messages, users, selected user)
- Any component can `useContext(AuthContext)` to access these directly

Alternative: Redux, Zustand, Jotai — but Context was sufficient here since state isn't complex.

---

**Q9. What would break if you removed JWT?**

- All protected routes become accessible without logging in
- Anyone can send/read messages as any user
- No way to identify who is making the request (no `req.user`)
- The entire `protectRoute` middleware would fail or need to be removed

---

**Q10. Why MongoDB over SQL (PostgreSQL/MySQL)?**

- Messages can be text-only OR image-only OR both — flexible schema, no null columns
- JSON/BSON maps directly to JavaScript objects
- Atlas provides managed cloud hosting with free tier
- For a side project chat app, eventual consistency is acceptable
- SQL would require: users table, messages table, foreign keys, joins — more setup for the same result

---

**Q11. How does the app stay authenticated after page refresh?**

1. On login: `localStorage.setItem("token", data.token)`
2. On app load (main.jsx): `AuthProvider` initializes with `useState(localStorage.getItem("token"))`
3. If token exists, `useEffect` fires: sets Axios header + calls `checkAuth`
4. `checkAuth` calls `GET /api/auth/check` (protected route) → returns fresh user data
5. `setAuthUser(data.user)` restores the session

---

**Q12. What is `protectRoute` and how does it work?**

It's Express middleware that acts as a security gate:
```
Request → protectRoute → Controller
           reads token from headers
           jwt.verify(token, secret)
           if valid: req.user = user, next()
           if invalid: returns { success: false }
```
It runs BEFORE the controller. If verification fails, the controller never executes.

---

**Q13. What's the difference between `io.emit()` and `io.to(id).emit()`?**

- `io.emit(event, data)` — sends to **ALL** connected clients (broadcast)
- `io.to(socketId).emit(event, data)` — sends to **one specific** socket (targeted)
- `socket.broadcast.emit(event, data)` — sends to all clients **except** the sender

In this app: `getOnlineUsers` uses `io.emit()` (everyone needs to know). `newMessage` and `typing` use `io.to(socketId).emit()` (private delivery).

---

**Q14. How would you add group chat to this app?**

Current design is 1-on-1 (senderId + receiverId). For group chat:
- Create a `Group` model with `name`, `members[]`, `adminId`
- Change `Message` to have `groupId` instead of `receiverId`
- Use Socket.io rooms: `socket.join(groupId)`, `io.to(groupId).emit("newMessage", msg)`
- Update sidebar to show groups alongside individual users

---

**Q15. How would you scale this app to 100,000 users?**

1. **Multiple Node instances** (PM2 cluster mode or Kubernetes)
2. **Redis Pub/Sub** for Socket.io (`@socket.io/redis-adapter`) — share socket state across instances
3. **MongoDB sharding** — distribute data across multiple nodes
4. **Load balancer** (nginx/AWS ALB) in front of Node instances
5. **Sticky sessions** for WebSocket connections OR Redis adapter solves this
6. **CDN** for static React build files (already using Cloudinary for images)
7. **Message queue** (Redis/RabbitMQ) for async processing of image uploads

---

## 🚀 SECTION B — React Concepts (Questions 16–35)

---

**Q16. What is JSX?**

JSX is a syntax extension that looks like HTML but compiles to `React.createElement()` calls. `<div>Hello</div>` becomes `React.createElement("div", null, "Hello")`. Babel/Vite handles this compilation.

---

**Q17. What is the Virtual DOM?**

An in-memory representation of the real DOM. When state changes, React re-renders the virtual DOM, diffs old vs new (reconciliation), then applies only the minimum changes to the real DOM. This is faster than full DOM replacement.

---

**Q18. What are props vs state?**

- 💡 **Props**: Data passed FROM parent TO child. Read-only in child. Like function arguments.
- 💡 **State**: Data that lives inside a component. When changed with `setState`, the component re-renders.

---

**Q19. What is `useEffect` and when does it run?**

`useEffect(callback, [deps])` — runs side effects after rendering.
- No deps array: runs after every render
- Empty array `[]`: runs once after first render (like componentDidMount)
- With deps `[x, y]`: runs after first render AND whenever x or y changes

Cleanup: return a function from `useEffect` to clean up (remove event listeners, timers) before the next run.

---

**Q20. Why does `useEffect` in Sidebar have `[onlineUsers]` as dependency?**

```jsx
useEffect(() => { getUsers(); }, [onlineUsers])
```

Every time the online user list changes (someone joins/leaves), `getUsers()` is called to refresh the sidebar with updated unseen message counts and user presence. If dependency were `[]`, the sidebar would only load users once.

---

**Q21. What is `useRef` and when do you use it vs `useState`?**

- `useRef` stores a mutable value that **doesn't trigger re-renders**
- `useState` stores state that **does trigger re-renders**

Use `useRef` for:
- Accessing DOM elements directly (`<div ref={myRef}>`)
- Storing timer IDs between renders
- Storing any value that shouldn't cause re-renders

In this app: `typingTimeoutRef` (timer) and `scrollEnd` (DOM reference).

---

**Q22. What is conditional rendering?**

Showing different JSX based on a condition:
```jsx
// Ternary
{authUser ? <HomePage /> : <Navigate to="/login" />}

// && short-circuit
{unseenMessages[user._id] > 0 && <span>{unseenMessages[user._id]}</span>}
```

The `&&` operator: if left side is falsy, right side never renders. If truthy, renders right side.

---

**Q23. Why do we need `key` prop when rendering lists?**

```jsx
users.map((user, index) => <div key={index}>...</div>)
```

React uses `key` to identify which items in a list changed, were added, or removed. Without keys, React re-renders the entire list on any change. With stable keys (ideally IDs, not array indices), React only updates changed items.

**Problem with index as key**: If the list reorders, indices change → React gets confused. Use `user._id` as key instead (this is actually a bug in the current code that should be fixed).

---

**Q24. What is a controlled vs uncontrolled component?**

- 💡 **Controlled**: React state controls the input value. `value={state}` + `onChange` = React controls it.
- 💡 **Uncontrolled**: DOM controls it. Use `ref` to access value when needed.

This app uses controlled inputs everywhere:
```jsx
<input value={email} onChange={(e) => setEmail(e.target.value)} />
```

---

**Q25. What is prop drilling and how did you solve it?**

Passing props through intermediate components that don't need them, just to reach a deeply nested component. Solved with Context API — store data centrally, any component can access it directly.

---

**Q26. What is the difference between `createContext` and `useContext`?**

- `createContext()` — creates the context object (done once, at module level)
- `useContext(MyContext)` — reads the current value of that context in a component

---

**Q27. What happens if you call `useContext` outside a Provider?**

You get the `defaultValue` passed to `createContext(defaultValue)`. In this project, `createContext()` is called without a default, so you get `undefined`. Component would crash trying to destructure from it.

---

**Q28. Why is the `AuthProvider` wrapping the `ChatProvider`?**

`ChatProvider` calls `useContext(AuthContext)` to get `socket` and `axios`. If `ChatProvider` were outside `AuthProvider`, `AuthContext` would have no value — `socket` and `axios` would be undefined. Order of nesting = order of dependency.

---

**Q29. What is `react-hot-toast` and how is it used?**

A toast notification library. You place `<Toaster />` once in the app root. Then anywhere:
```jsx
toast.success("Login successful!")
toast.error("Invalid credentials!")
```
Messages appear/disappear automatically with animation.

---

**Q30. What does `event.preventDefault()` do?**

Prevents the browser's default action for that event. On form submit, the default is to send an HTTP GET/POST and reload the page. `preventDefault()` lets you handle submission in JavaScript instead.

---

**Q31. What is `useNavigate`?**

React Router v6+ hook for programmatic navigation:
```jsx
const navigate = useNavigate();
navigate('/');          // Go to home
navigate(-1);           // Go back (like browser back button)
navigate('/login', { replace: true });  // Replace current history entry
```

---

**Q32. What is `<Navigate>` in React Router?**

A component that immediately redirects to another route when rendered. Used in route guards:
```jsx
<Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login" />} />
```

---

**Q33. What does the spread operator `...prev` do in state updates?**

```jsx
setUnseenMessages(prev => ({ ...prev, [newMessage.senderId]: count + 1 }))
```

`...prev` copies all existing key-value pairs. Then `[newMessage.senderId]: count` adds/overwrites just that one key. Result: new object with all old data + updated count. Never mutates the existing state object.

---

**Q34. What is optional chaining `?.`?**

Safely accesses nested properties without throwing if something is null/undefined:
```jsx
socket?.disconnect()    // If socket is null, this does nothing (no crash)
authUser?.profilePic    // If authUser is null, returns undefined (no crash)
selectedUser?._id       // Safe nested access
```

---

**Q35. What is the difference between `[]` and `{}` in destructuring?**

```jsx
const [token, setToken] = useState(...)   // Array destructuring: position-based
const { authUser, socket } = useContext(AuthContext)  // Object destructuring: name-based
const { data } = await axios.get(...)     // Object destructuring from response
```

---

## 🚀 SECTION C — Backend / Node / Express (Questions 36–55)

---

**Q36. What is middleware in Express?**

A function with `(req, res, next)` signature that runs between the request arriving and the response being sent. Can modify `req`, call `res.json()` to end the request, or call `next()` to continue the chain.

---

**Q37. What does `next()` do?**

Passes control to the next middleware or route handler in the stack. If `next()` is not called, the request hangs.

---

**Q38. What is `express.json()` middleware?**

Parses incoming requests with JSON bodies. Without it, `req.body` is `undefined`. With it, JSON is automatically parsed into a JavaScript object.

---

**Q39. What is the difference between `req.body`, `req.params`, and `req.query`?**

- `req.body` — data from request body (POST, PUT). Needs `express.json()` middleware.
- `req.params` — values from URL path: `/api/messages/send/:id` → `req.params.id`
- `req.query` — values from query string: `/api/users?search=john` → `req.query.search`

---

**Q40. What is `async/await` and why is it used?**

Syntax for handling Promises. Without it:
```js
User.findOne({ email }).then(user => { ... }).catch(err => { ... })
```
With async/await:
```js
const user = await User.findOne({ email });
```
Much more readable. `await` pauses execution until the Promise resolves. `async` makes the function return a Promise.

---

**Q41. What happens if you forget `await` on a DB call?**

```js
const user = User.findOne({ email });  // No await
// user is a Mongoose Query object, NOT the actual user data
if (user) { ... }  // Always truthy (Query object exists)
```
Bugs are subtle and hard to catch. Always `await` async DB operations.

---

**Q42. What is the `$ne` operator in MongoDB?**

"Not equal" operator:
```js
User.find({ _id: { $ne: userId } })
// Find all users where _id is NOT EQUAL to userId
```
Used in `getUsersForSidebar` to exclude the logged-in user from their own contact list.

---

**Q43. What is `$or` in MongoDB?**

```js
Message.find({
  $or: [
    { senderId: myId, receiverId: otherId },
    { senderId: otherId, receiverId: myId }
  ]
})
```
Matches documents where ANY of the conditions are true. Gets the full conversation between two users.

---

**Q44. What does `.select('-password')` do?**

Tells Mongoose to exclude the `password` field from the returned document. The `-` prefix means "exclude this field". All other fields are included.

---

**Q45. What does `{ new: true }` do in `findByIdAndUpdate`?**

Returns the document **after** the update. Default behavior returns the document **before** the update. We need the updated version to send back to the client.

---

**Q46. What is `Promise.all()` and why is it used in `getUsersForSidebar`?**

Runs multiple Promises in **parallel** and waits for all to complete:
```js
const promises = users.map(async (user) => {
  return Message.find({ senderId: user._id, seen: false });
});
await Promise.all(promises);  // All DB queries run concurrently
```
Without it: promises aren't awaited, `unseenMessages` remains empty.

---

**Q47. What is `bcrypt.genSalt()` and why is salt needed?**

Salt is a random string added to the password before hashing. This ensures:
- Same password → different hash each time (defeats rainbow table attacks)
- Two users with same password → different hashes (attacker can't see duplicates)

`genSalt()` generates a random salt. `hash(password, salt)` incorporates the salt into the hash.

---

**Q48. Can you reverse a bcrypt hash to get the original password?**

No. bcrypt is a one-way hash function, not encryption. You can only verify by hashing the input again with the same salt and comparing. This is what `bcrypt.compare()` does.

---

**Q49. What is `dotenv` and why is it the first import?**

`dotenv/config` reads `.env` file and loads variables into `process.env`. It must be imported first because other code (like DB connection strings) depends on `process.env` being populated.

---

**Q50. What is CORS and why is it needed?**

Cross-Origin Resource Sharing. Browsers enforce the Same-Origin Policy — JavaScript can't make requests to a different domain/port by default. The Express `cors()` middleware sets HTTP headers (`Access-Control-Allow-Origin: *`) that tell the browser to allow cross-origin requests.

Without it: frontend (localhost:3000) can't call backend (localhost:5000) — CORS error.

---

**Q51. What is the difference between `module.exports` and `export default`?**

- `module.exports` — CommonJS (older Node.js style, `.js` files default)
- `export default` — ES Modules (modern, used here because `"type": "module"` in package.json)

This project uses ES Modules throughout (`import`/`export`).

---

**Q52. What does `nodemon` do?**

Watches for file changes and automatically restarts the Node.js server. Without it, you'd have to manually kill and restart the server after every code change during development.

---

**Q53. What is Mongoose and what does it add over the MongoDB driver?**

Mongoose is an ODM (Object Document Mapper):
- 💡 **Schema definition** — enforce structure, types, validation
- 💡 **Models** — classes representing collections with methods
- 💡 **Query API** — `.find()`, `.create()`, `.findByIdAndUpdate()` etc.
- 💡 **Middleware hooks** — pre/post save, validation etc.
- 💡 **Auto `_id`** and `timestamps`

Raw MongoDB driver: you write raw query objects. Mongoose: cleaner, safer, more structured.

---

**Q54. What happens when Mongoose connects with `await mongoose.connect(uri)`?**

1. Opens a connection pool to MongoDB Atlas
2. Authenticates with credentials in the URI
3. The `connected` event fires
4. All subsequent `Model.find()` etc. use this connection

If this fails, the server starts but all DB operations throw errors.

---

**Q55. How is `cloudinary.uploader.upload()` used for images?**

```js
const upload = await cloudinary.uploader.upload(base64ImageString);
// Returns: { public_id, secure_url, width, height, ... }
const url = upload.secure_url;  // "https://res.cloudinary.com/..."
```

Cloudinary detects the format from the data URI prefix (`data:image/jpeg;base64,...`), uploads it, transforms it, and returns a CDN URL.

---

## 🚀 SECTION D — JWT & Security (Questions 56–65)

---

**Q56. What are the three parts of a JWT?**

`header.payload.signature`

- 💡 **Header**: `{ "alg": "HS256", "typ": "JWT" }` — algorithm and type (base64 encoded)
- 💡 **Payload**: `{ "userId": "67fb37..." }` — your data (base64 encoded)
- 💡 **Signature**: HMAC-SHA256(header + payload, secret) — tamper-proof seal

---

**Q57. Is JWT secure? Is the payload secret?**

The payload is **NOT encrypted** — anyone can decode it with base64. However, it is **signed** — you can't modify it without knowing the secret. Don't store sensitive data (passwords, PII) in JWT payload.

---

**Q58. How is JWT verified on the server?**

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

Internally:
1. Splits the token into header, payload, signature
2. Re-computes the signature from header + payload using `JWT_SECRET`
3. If computed signature matches the token's signature → valid
4. Decodes and returns the payload `{ userId: "..." }`

---

**Q59. What happens if the JWT_SECRET changes on the server?**

All existing tokens become invalid. Every user gets logged out. Their stored tokens fail verification with the new secret. This is how you can "revoke all sessions" in an emergency — change the secret.

---

**Q60. How does logout work if JWT is stateless (server stores nothing)?**

The server-side logout is simply: don't revoke anything.
The client-side logout:
- Removes token from localStorage
- Removes the Axios default header
- Sets `authUser` to null → routes redirect to login

The token technically still works if someone saved it separately, until it expires. This is the fundamental limitation of JWTs without a blocklist.

For production: add a token revocation list (Redis store of invalidated JWTs) or use short expiry + refresh tokens.

---

**Q61. Why store the token in localStorage instead of cookies?**

**localStorage**:
- Easy to use with Axios (set as header manually)
- Vulnerable to XSS attacks (malicious JS can read it)

**httpOnly cookie**:
- JS can't read it (XSS resistant)
- Automatically sent with requests
- Needs CSRF protection instead

This project uses localStorage — simpler for learning projects, not recommended for production with sensitive data.

---

**Q62. What is bcrypt's work factor / cost factor?**

`bcrypt.genSalt(10)` — the `10` is the cost factor (log2 of rounds). Higher = slower = more secure against brute force. Default is 10 (2^10 = 1024 rounds). 12-14 is more secure. 10 is generally fine for web apps.

---

**Q63. What does `minlength: 6` in the Mongoose schema do?**

Mongoose validation that throws an error if a string is shorter than 6 chars. Runs when you call `.save()` or `.create()`. If validation fails, the error is caught in the try-catch.

---

**Q64. Why use `{ $ne: userId }` for the sidebar user list instead of just filtering in JS?**

Database-level filtering is more efficient. MongoDB only returns the documents you need — filtered at the source. Fetching all users and filtering in Node.js wastes bandwidth and memory. Always filter at the DB level when possible.

---

**Q65. What is the `unique: true` constraint on email in the User schema?**

Creates a unique index in MongoDB. If you try to create two users with the same email, MongoDB throws a duplicate key error. This is enforced at the database level, not just application level — more reliable.

---

## 🚀 SECTION E — Socket.io & Real-Time (Questions 66–75)

---

**Q66. What is the difference between HTTP polling and WebSocket?**

- 💡 **Polling**: Client repeatedly asks "any new messages?" every N seconds. Wastes bandwidth. Latency = polling interval.
- 💡 **Long polling**: Server holds the request open until there's data or timeout. Better but still HTTP overhead.
- 💡 **WebSocket**: Persistent bidirectional connection. Server pushes instantly. Zero polling overhead.

---

**Q67. How does Socket.io fall back if WebSockets aren't available?**

Socket.io automatically tries WebSocket first. If blocked (some corporate firewalls), it falls back to HTTP long-polling. From the app's perspective, the API is the same — `socket.emit(...)` works regardless.

---

**Q68. What is the difference between `socket.emit` and `io.emit`?**

- `socket.emit` — sends event from **this specific socket** (in a handler) or **from the client**
- `io.emit` — server broadcasts to **all connected sockets**
- `io.to(id).emit` — server sends to **one specific socket**
- `socket.broadcast.emit` — server sends to **all except the sender**

---

**Q69. What happens if the receiver is offline when a message is sent?**

```js
const receiverSocketId = userSocketMap[receiverId];
if (receiverSocketId) {
  io.to(receiverSocketId).emit("newMessage", newMessage);
}
```

If `receiverSocketId` is `undefined` (user offline), the `if` block doesn't run. The message is still saved to MongoDB. When the receiver comes online, `getMessages()` fetches all messages including the missed ones. Unseen count is tracked in the DB via the `seen: false` field.

---

**Q70. Why does the server export `io` and `userSocketMap`?**

```js
export const io = new Server(server, {...});
export const userSocketMap = {};
```

`messageController.js` needs them to emit the `newMessage` event after saving a message. Instead of creating a new Socket.io server, it imports the existing one. This is the singleton pattern.

---

**Q71. What is the `socket.handshake` object?**

Metadata about the connection initiation — the HTTP upgrade request that started the WebSocket. Contains:
- `headers` — HTTP headers from the upgrade request
- `query` — query string parameters
- `auth` — auth object (if using Socket.io's auth option)
- `time` — timestamp of connection

---

**Q72. What is a WebSocket "room"?**

A group of sockets. `socket.join("roomName")` adds a socket to a room. `io.to("roomName").emit(...)` sends to all sockets in that room. Useful for group chats, game lobbies, etc. This app doesn't use rooms — it uses direct socket ID targeting.

---

**Q73. How does the cleanup in useEffect prevent memory leaks with socket listeners?**

```jsx
return () => {
  socket.off("typing", handleUserTyping);
  socket.off("stopTyping", handleUserStopTyping);
};
```

Without cleanup: every time `selectedUser` changes, a NEW event listener is added. After 10 chat switches, there are 10 listeners for "typing". All fire on each event, causing bugs and memory leaks. The return function removes the old listener before adding a new one.

---

**Q74. What would you use instead of `userSocketMap` for production?**

**Redis**. In-memory maps don't survive server restarts and don't work across multiple server instances. Redis is an in-memory data store that all server instances can share:
```
Server 1 writes: { "userId": "socketId" }
Server 2 reads: { "userId": "socketId" }  ← sees it!
```
Use with `@socket.io/redis-adapter`.

---

**Q75. What is the `disconnect` event and what is cleaned up?**

```js
socket.on("disconnect", () => {
  delete userSocketMap[userId];
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
});
```

When a user closes the tab, loses internet, or calls `socket.disconnect()`:
1. Their `userId` is removed from `userSocketMap`
2. All other clients are notified of the updated online list
3. No more messages can be pushed to that socket

---

## 🚀 SECTION F — General Web / CS Concepts (Questions 76–88)

---

**Q76. What is REST and does this app follow it?**

REST (Representational State Transfer) principles:
- Use HTTP methods semantically: GET = read, POST = create, PUT = update, DELETE = remove
- Resources identified by URLs: `/api/messages/:id`
- Stateless: each request contains all needed info

This app mostly follows REST but has one violation: `GET /api/messages/mark/:id` should be `PUT` or `PATCH` (it's a state change, not a read).

---

**Q77. What is the difference between `PUT` and `PATCH`?**

- `PUT` — replace the entire resource with new data
- `PATCH` — partially update a resource (only the changed fields)

The `updateProfile` endpoint uses `PUT`, but builds `updateData` with only the changed fields — technically should be `PATCH`.

---

**Q78. What is base64 encoding?**

A way to encode binary data (images, files) into ASCII text using 64 characters (A-Z, a-z, 0-9, +, /). Binary data becomes ~33% larger. Allows binary data to be sent as text in JSON bodies or data URLs. `data:image/jpeg;base64,/9j/4AAQ...` is the format.

---

**Q79. What is a CDN?**

Content Delivery Network. Distributes content across servers worldwide. When a user in India requests an image from Cloudinary, they get it from the nearest Cloudinary server (maybe in Asia), not from the origin server in the US. Result: faster load times globally.

---

**Q80. What is the event loop in Node.js?**

Node.js is single-threaded but handles many concurrent connections through the event loop:
1. Code runs synchronously
2. When async operation (DB query, HTTP request) starts, it's delegated to OS/thread pool
3. Event loop continues running other code
4. When async operation completes, its callback is queued
5. Event loop picks it up and runs it

This is why Node.js can handle thousands of connections without spawning threads for each.

---

**Q81. What is `import.meta.env` in Vite?**

Vite's way to expose environment variables to the browser. Variables in `.env` file that start with `VITE_` are available as `import.meta.env.VITE_VARIABLE_NAME`. Non-VITE_ variables are only available on the server (Node.js).

---

**Q82. What is Vite and why is it faster than Webpack/CRA?**

Vite uses native ES modules in the browser during development — no bundling needed. The browser requests only the files it needs, and Vite serves them directly. Webpack bundles everything into one file first (slow for large projects). Vite also uses esbuild (written in Go) for transforms, which is 10-100x faster than Babel.

---

**Q83. What is `"type": "module"` in package.json?**

Tells Node.js to treat `.js` files as ES Modules (use `import`/`export`). Without it, Node uses CommonJS by default (`require`/`module.exports`). Both the server and client use `"type": "module"`.

---

**Q84. What is a MongoDB ObjectId?**

A 24-character hexadecimal string (12 bytes) automatically generated for each document's `_id` field. Contains: 4-byte timestamp, 5-byte random, 3-byte incrementing counter. This means you can extract the creation time from an ObjectId.

---

**Q85. What is the difference between `==` and `===` in JavaScript?**

- `==` — loose equality, type coercion. `"1" == 1` is `true`
- `===` — strict equality, no coercion. `"1" === 1` is `false`

Always use `===` to avoid surprising type coercions.

---

**Q86. Why does `String(senderId) === String(selectedUser._id)` use `String()`?**

MongoDB ObjectIds from Mongoose can be objects (not strings). Socket.io transmits them as strings. Without `String()` conversion, comparing an ObjectId object to a string would always be `false` even if they represent the same ID.

---

**Q87. What is the `FileReader` API?**

Browser API for reading file contents. Used in this app to convert a selected image file to a base64 data URL:
```js
const reader = new FileReader();
reader.readAsDataURL(file);      // Start reading
reader.onload = () => {
  const base64 = reader.result; // "data:image/jpeg;base64,..."
}
```
It's asynchronous — `onload` fires when reading is complete.

---

**Q88. What is the Mongoose `timestamps: true` option?**

Automatically adds `createdAt` (when document was created) and `updatedAt` (when last modified) fields to every document. Mongoose manages these automatically — you never set them manually.

---

## 🚀 SECTION G — Debugging & Tricky Questions (Questions 89–100)

---

**Q89. Why do messages sometimes appear twice for the sender?**

Potential cause: `sendMessage` in ChatContext adds the message optimistically (from HTTP response), AND if the socket relay accidentally fires back to the sender, the `newMessage` socket event adds it again. Current code avoids this because `newMessage` is only emitted to the **receiver's** socket, not the sender's. But if a user has the same conversation open in two tabs, they might see duplicates.

---

**Q90. What is the bug with using `index` as the `key` in lists?**

```jsx
users.map((user, index) => <div key={index}>...</div>)
```

If users are filtered (search), the indices change for the same users. React may reuse the wrong DOM elements. Better: use `key={user._id}` — stable, unique identifiers.

---

**Q91. What happens if `connectSocket` is called multiple times?**

```jsx
const connectSocket = (userData) => {
  if (!userData || socket?.connected) return;  // Guard!
```

The guard `socket?.connected` prevents creating duplicate connections. If called without this guard during re-renders, you'd have multiple sockets open — receiving duplicate events.

---

**Q92. What does `socket.off("newMessage")` do in `unsubscribeFromMessages`?**

Removes ALL listeners for the `"newMessage"` event on that socket. More aggressive than passing the specific handler function. If multiple listeners are registered, all are removed. This is fine here since there's only one.

---

**Q93. What would happen if the `.env` file was pushed to GitHub?**

All secrets exposed: database credentials (data breach), JWT secret (forge auth tokens), Cloudinary API key (abuse your account, cost you money). This is why `.env` is in `.gitignore`. Use environment variables in deployment (Vercel, Render, Railway etc.) — never commit secrets.

---

**Q94. What is the race condition in `checkAuth` + `useEffect`?**

```jsx
useEffect(() => {
  if (token) {
    api.defaults.headers.common["token"] = token;
    checkAuth();  // Async! Doesn't await.
  }
}, [token])
```

`checkAuth` starts but the effect completes immediately. Multiple rapid token changes could cause multiple `checkAuth` calls in flight. For this simple app it's acceptable. Production fix: use `AbortController` to cancel the previous request.

---

**Q95. What happens when `selectedUser` changes in ChatContainer?**

```jsx
useEffect(() => {
  if (selectedUser) {
    getMessages(selectedUser._id);  // Fetch conversation history
    setIsTyping(false);              // Reset typing indicator
  }
}, [selectedUser])
```

The old typing state is cleared (you shouldn't see "typing..." from a different chat). New messages are fetched. The socket subscription effect re-runs (different deps).

---

**Q96. Why does `subscribeToMessages` have `async` but doesn't `await` anything?**

```jsx
const subscribetoMessages = async () => {
  if (!socket) return;
  socket.on("newMessage", ...)  // Not an async operation
}
```

The `async` keyword is unnecessary here — there's no `await` inside. It's a minor code smell but doesn't cause bugs (an async function just returns a Promise that resolves immediately if nothing is awaited).

---

**Q97. If you could rewrite the token storage, what would you change?**

Current: localStorage (XSS vulnerable).
Better: `httpOnly` cookie — JavaScript can't read it, sent automatically with requests, immune to XSS. Requires setting cookie on server (`res.cookie()`), adding CSRF protection, and removing the manual Axios header approach. More secure but more complex setup.

---

**Q98. What is the purpose of `export const io = ...` in server.js?**

Making `io` and `userSocketMap` available to other modules (specifically `messageController.js`). This is the **module singleton** pattern — one instance, shared across imports.

---

**Q99. How would you add message persistence for offline users?**

Current: messages are stored in MongoDB but only "pushed" if the user is online.
When they come online and call `getMessages()`, they get all historical messages (HTTP). So offline delivery is already handled — by the database!

The `unseenMessages` count tracks what they missed. When they open the chat, `getMessages()` fetches everything.

What's missing: **push notifications** (FCM/APNS) for truly offline users (phone locked, app closed).

---

**Q100. What are the top 3 things you'd improve in this project for production?**

1. **Security**: Move JWT to httpOnly cookies; add expiry + refresh token system; rate limit auth endpoints; use Socket.io auth middleware instead of query param userId.
2. **Scalability**: Replace in-memory `userSocketMap` with Redis; add Socket.io Redis adapter; use Node.js cluster mode; optimize the `getUsers` → `getOnlineUsers` re-fetch cycle.
3. **UX**: Implement message pagination (don't load all messages at once); add read receipts (sender sees "seen"); add push notifications for offline users; use `user._id` as list keys instead of index; add client-side Zod validation to match server schemas.

---

## 🚀 Quick-Fire Summary

| Topic | Key Number/Fact |
|-------|----------------|
| JWT parts | 3 (header.payload.signature) |
| bcrypt salt rounds | 10 (default) |
| MongoDB document limit | 16MB |
| Typing debounce delay | 1500ms |
| Express body limit | 15mb |
| Port (server) | 5000 |
| Image encoding overhead | ~33% larger in base64 |
| User collections | 2 (users, messages) |
| Contexts | 2 (AuthContext, ChatContext) |
| Pages | 3 (Login, Home, Profile) |
| Components | 3 (Sidebar, ChatContainer, RightSidebar) |
| Socket.io events (custom) | 5 (getOnlineUsers, newMessage, typing, stopTyping, disconnect) |
| Protected routes | All message routes + /auth/check + /auth/update-profile |
| Public routes | /auth/signup, /auth/login |

---

*You've finished all 5 docs. Run the app, trace a message send, then answer Q4 out loud without reading. If you can do that — you own this project.*
