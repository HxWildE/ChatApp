# 🌟 03 — Frontend Deep Dive
### 📌 React, Context API, Axios, React Router — Every File Explained

> **Reading Goal**: Understand React's component model, why Context is used, how Axios talks to the backend, and what every JSX file does.

---

## 🚀 1. What is React? The Core Mental Model

React is a **UI library** built on one principle:

```
UI = f(state)
```

Your UI is a function of your state. When state changes, React **re-renders** the affected parts automatically.

### 📌 The Virtual DOM

Instead of directly manipulating the browser's DOM (slow), React:
1. Keeps a **virtual copy** of the DOM in memory
2. When state changes, re-renders the virtual DOM
3. **Diffs** old vs new virtual DOM (finds minimum changes)
4. Applies only those changes to the real DOM

Result: Fast updates without touching everything.

### 📌 Components

Everything in React is a **component** — a JavaScript function that returns JSX (HTML-like syntax):

```jsx
const Sidebar = () => {
  return <div className="sidebar">Hello</div>
}
```

Components can have:
- 💡 **Props** — data passed in from parent (like function arguments)
- 💡 **State** — internal data that triggers re-renders when changed

---

## 🚀 2. Project Entry — `src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'
import { ChatProvider } from '../context/chatContent.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>,
)
```

**`createRoot`** — React 18+ API. Finds `<div id="root">` in `index.html` and mounts the entire React app there.

**The nesting order matters:**

```
BrowserRouter           ← Must be outermost — enables URL-based routing everywhere inside
  AuthProvider          ← Second — AuthContext is available to all children
    ChatProvider        ← Third — ChatContext can use AuthContext (it depends on socket/axios from Auth)
      App               ← Innermost — all pages and components have access to both contexts
```

If `ChatProvider` was outside `AuthProvider`, `chatContent.jsx` couldn't call `useContext(AuthContext)` — it would get `undefined`.

---

## 🚀 3. Routing — `src/App.jsx`

```jsx
const App = () => {
  const { authUser } = useContext(AuthContext);  // Is there a logged-in user?

  return (
    <div className='min-h-screen bg-[#110e1b] text-white w-full'>
      <Toaster/>  {/* Toast notifications appear here */}
      <Routes>
        <Route path='/' element={ authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path='/login' element={ !authUser ? <LoginPage/> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}
```

### 📌 Route Guards (Protected Routes)

```jsx
authUser ? <HomePage/> : <Navigate to="/login" />
```

This is React's conditional rendering used as a route guard:
- If `authUser` is truthy (logged in) → show `HomePage`
- If `authUser` is falsy (null/not logged in) → redirect to `/login`

The reverse applies for the login page: if you're already logged in and visit `/login`, you get redirected to `/`.

**`<Navigate to="/login" />`** — This is a React Router component that immediately performs a redirect.

### 📌 `<Toaster />`

The `react-hot-toast` library renders all toast notifications through this single component. You place it once at the app root, and `toast.success()` / `toast.error()` calls anywhere in the app show up here.

---

## 🚀 4. Context API — The Global State System

### 📌 The Problem Context Solves: Prop Drilling

Without context, to share `authUser` from App down to a deeply nested component:
```
App → HomePage → ChatContainer → [needs authUser]
```
You'd pass it as props at every level — "prop drilling". Annoying and hard to maintain.

### 📌 How Context Works

```
AuthContext.Provider (holds the value)
    └─ Any component anywhere in the tree
           └─ can call useContext(AuthContext) to grab that value
```

No prop passing needed. It's like a global variable, but React-tracked (re-renders consumers when value changes).

---

## 🚀 5. `context/AuthContext.jsx` — Auth State

This is the **most important file on the frontend**. It manages:
- Who is logged in (`authUser`)
- The JWT token (stored in `localStorage`)
- The socket connection
- List of online users

```jsx
export const AuthContext = createContext();  // Create the context object

export const AuthProvider = ({ children }) => {  // The Provider component
  
  const [token, setToken] = useState(localStorage.getItem("token"));
```

**`localStorage.getItem("token")`** — On page load, check if there's a saved token from a previous session. If yes, initialize state with it (user stays logged in after refresh).

```jsx
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
```

Four pieces of state:
- `token` — the JWT string (also persisted in localStorage)
- `authUser` — the full user object from DB (name, email, profilePic, etc.)
- `onlineUsers` — array of userIds currently connected via socket
- `socket` — the Socket.io client instance

### 📌 The Axios Instance

```jsx
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({ baseURL: backendUrl });
```

`axios.create()` creates a **configured instance** of Axios. Benefits:
- All requests automatically use `backendUrl` as the base
- You set headers once, they apply to every request from this instance
- Multiple apps can have different Axios instances with different configs

**`import.meta.env.VITE_BACKEND_URL`** — Vite's way of reading `.env` file variables. Must be prefixed with `VITE_` to be exposed to the browser.

### 📌 `checkAuth` — Session Restoration

```jsx
const checkAuth = async () => {
  try {
    const { data } = await api.get("/api/auth/check");
    if (data.success) {
      setAuthUser(data.user);
      connectSocket(data.user);
    }
  } catch (error) {
    toast.error(error.message);
  }
}
```

Called when the app loads (if token exists). Validates the token with the server and gets fresh user data. This handles the case where user data changed since last session.

### 📌 `login` function — Handles Both Login AND Signup

```jsx
const login = async (state, credentials) => {
  // state = "signup" or "login"
  const { data } = await api.post(`/api/auth/${state}`, credentials);
  if (data.success) {
    setAuthUser(data.userData);
    connectSocket(data.userData);
    setToken(data.token);
    localStorage.setItem("token", data.token);  // Persist for future page loads
    toast.success(data.message);
  } else {
    toast.error(data.message);
  }
}
```

One function handles both because the backend endpoints are similar and the response structure is the same.

### 📌 `logout` — Clean State Reset

```jsx
const logout = async () => {
  localStorage.removeItem("token");   // Clear persisted token
  setToken(null);
  setAuthUser(null);
  setOnlineUsers([]);
  delete api.defaults.headers.common["token"];  // Remove auth header from future requests
  toast.success("Logged out Successfully");
  socket?.disconnect();  // Close WebSocket connection
}
```

**`socket?.disconnect()`** — The `?.` is optional chaining. If `socket` is null, this does nothing (no crash).

### 📌 The `useEffect` — Token Watcher

```jsx
useEffect(() => {
  if (token) {
    api.defaults.headers.common["token"] = token;  // Set token on ALL future requests
    checkAuth();
  }
}, [token])
```

This runs whenever `token` changes. If token exists:
1. Set it as a default header on the Axios instance (so every request sends it)
2. Call `checkAuth` to validate and load user data

**`api.defaults.headers.common["token"] = token`** — This is the magic line. After this, every single `api.get()` or `api.post()` automatically sends `token: <jwt>` in the headers. The middleware on the backend reads it.

### 📌 What Goes Into `value`

```jsx
const value = {
  axios: api,     // The configured Axios instance (ChatContext uses this)
  authUser,       // Current user object
  onlineUsers,    // Array of online user IDs
  socket,         // Socket.io client instance
  login,          // Login/signup function
  logout,         // Logout function
  updateProfile   // Update profile function
}
```

This is everything the entire app needs to know about authentication. Any component can grab any of these by calling `useContext(AuthContext)`.

---

## 🚀 6. `context/chatContent.jsx` — Chat State

```jsx
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setunseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);
```

**It consumes `AuthContext`** — gets `socket` (for real-time) and `axios` (the pre-configured HTTP client with token already set).

### 📌 `getUsers` — Load Sidebar

```jsx
const getUsers = async () => {
  const { data } = await axios.get("/api/messages/users");
  if (data.success) {
    setUsers(data.users);
    setunseenMessages(data.unseenMessages);
  }
}
```

Simple GET request. Backend returns all users (except you) + unseen message counts.

### 📌 `sendMessage` — Send a Message

```jsx
const sendMessage = async (messageData) => {
  const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
  if (data.success) {
    setMessages((prevMessages) => [...prevMessages, data.newMessage])
  }
}
```

**`[...prevMessages, data.newMessage]`** — Spread operator creates a new array with the new message appended. React requires immutable state updates (never mutate the existing array directly).

### 📌 `subscribeToMessages` — Real-Time Reception

```jsx
const subscribetoMessages = async () => {
  if (!socket) return;
  
  socket.on("newMessage", (newMessage) => {
    if (selectedUser && newMessage.senderId === selectedUser._id) {
      // Message from the currently open chat → show it
      newMessage.seen = true;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      axios.get(`/api/messages/mark/${newMessage._id}`);  // Mark as seen on server
    } else {
      // Message from someone else → increment unseen count
      setunseenMessages((prevUnseenMessages) => ({
        ...prevUnseenMessages,
        [newMessage.senderId]: (prevUnseenMessages[newMessage.senderId] || 0) + 1
      }))
    }
  })
}
```

This is the heart of real-time chat. When a `newMessage` socket event arrives:
- If it's from the person you're currently chatting with → add to messages array
- If it's from someone else → update the unseen badge count for them

```jsx
useEffect(() => {
  subscribetoMessages();
  return () => unsubscribeFromMessages();   // Cleanup
}, [socket, selectedUser])
```

Re-subscribes whenever `socket` or `selectedUser` changes. The cleanup (return function) removes the old listener before adding a new one — prevents duplicate handlers.

---

## 🚀 7. Pages

### 📌 `pages/LoginPage.jsx` — Multi-Step Form

```jsx
const [currState, setCurrState] = useState("Sign up")  // "Sign up" or "Login"
const [isDataSubmitted, setisDataSubmitted] = useState(false)  // Step tracker
```

The signup has **2 steps**:
1. Step 1: Enter name, email, password + accept terms → click "Next"
2. Step 2: Enter bio → click "Create Account"

`isDataSubmitted` tracks which step we're on.

```jsx
const onSubmitHandler = async (event) => {
  event.preventDefault();  // Prevent default form HTML submission (page reload)
  
  if (currState === "Sign up" && !isDataSubmitted) {
    if (!acceptedTerms) return;
    setisDataSubmitted(true);
    return;  // Don't submit yet — show step 2
  }
  
  await login(currState === "Sign up" ? "signup" : "login", {
    fullName, email, password, bio,
  });
}
```

**`event.preventDefault()`** — Without this, submitting an HTML form causes a full page reload. React handles form submission differently — in JS, not HTML.

### 📌 `pages/ProfilePage.jsx` — FileReader API

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!selectedImg) {
    await updateProfile({ fullName: name, bio });
    navigate('/');
    return;
  }
  
  const reader = new FileReader();
  reader.readAsDataURL(selectedImg);  // Convert File object to base64 data URL
  reader.onload = async () => {
    const base64Image = reader.result;  // "data:image/jpeg;base64,/9j/4AAQ..."
    await updateProfile({ profilePic: base64Image, fullName: name, bio });
    navigate('/');
  }
}
```

**FileReader** is a browser API that reads files. `readAsDataURL` converts a binary file into a base64 string (prefix: `data:image/jpeg;base64,...`). This string can be sent over HTTP as text in a JSON body.

**`useNavigate()`** — React Router's hook for programmatic navigation. `navigate('/')` = go to homepage.

### 📌 `pages/HomePage.jsx` — Responsive Layout

```jsx
const { selectedUser } = useContext(ChatContext)

return (
  <div className={`... grid grid-cols-1 gap-0 relative 
    ${selectedUser ? 'grid-cols-[300px_1fr_300px]' : 'grid-cols-[300px_1fr]'}`}>
    <Sidebar />
    <ChatContainer />
    <RightSidebar />
  </div>
)
```

The grid layout changes dynamically:
- No user selected: 2 columns (sidebar + empty chat area)
- User selected: 3 columns (sidebar + chat + right sidebar with user info)

---

## 🚀 8. Components

### 📌 `components/Sidebar.jsx`

```jsx
const filteredUsers = input ? 
  users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) 
  : users;
```

Client-side search filtering. When `input` is truthy (not empty), filter the users array. Case-insensitive via `.toLowerCase()`. No API call needed — all users are already in state.

```jsx
useEffect(() => {
  getUsers();
}, [onlineUsers])
```

Re-fetches the user list **whenever the list of online users changes**. This keeps unseen counts fresh when new people come online/offline.

```jsx
onClick={() => {
  setSelectedUser(user);
  setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))  // Clear badge
}}
```

When you click a user: select them AND clear their unseen message badge.

### 📌 `components/ChatContainer.jsx` — The Main Chat

**Typing Indicator — Sending:**

```jsx
const handleInputChange = (e) => {
  const value = e.target.value;
  setInput(value);
  
  if (value.trim() !== '') {
    socket.emit("typing", { receiverId: selectedUser._id });  // Tell server I'm typing
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });  // Auto-stop after 1.5s
    }, 1500);
  } else {
    socket.emit("stopTyping", { receiverId: selectedUser._id });  // Cleared input
  }
};
```

**Debouncing pattern**: Every keystroke emits "typing". But rather than emitting "stopTyping" on every keystroke, a 1500ms timer is set and reset on each keystroke. Only fires when user stops for 1.5 seconds.

**`useRef` for the timeout:**
```jsx
const typingTimeoutRef = useRef(null);
```
`useRef` stores a mutable value that **doesn't cause re-renders** when changed. Perfect for timers — you need to clear/reset the timeout without triggering a render.

**Auto-scroll to bottom:**
```jsx
const scrollEnd = useRef();

useEffect(() => {
  if (scrollEnd.current) {
    scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages, isTyping]);  // Scroll on new message OR typing indicator

// In JSX:
<div ref={scrollEnd}></div>  // This invisible div is at the bottom
```

`useRef` attached to a DOM element gives direct access to that element. `scrollIntoView` scrolls to make it visible.

**Rendering Messages:**
```jsx
messages.map((msg, index) => (
  <div key={index} className={`flex items-end gap-2 justify-end 
    ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
```

The `flex-row-reverse` trick: My messages are right-aligned (default flex-end), other person's messages are left-aligned (reversed). One CSS class handles both directions.

### 📌 `components/RightSidebar.jsx`

```jsx
const msgImages = messages.filter(msg => msg.image).map(msg => msg.image)
```

Method chaining:
1. `.filter()` — keep only messages that have an image field
2. `.map()` — extract just the image URLs

Result: array of image URLs for the media gallery.

---

## 🚀 9. React Hooks Used in This Project

| Hook | Used In | Purpose |
|------|---------|---------|
| `useState` | Everywhere | Local state that triggers re-renders |
| `useEffect` | AuthContext, ChatContext, Sidebar, ChatContainer | Side effects: API calls, subscriptions, timers |
| `useContext` | All components | Read from AuthContext or ChatContext |
| `useRef` | ChatContainer | Hold timer ref + scroll-to-bottom ref (no re-render) |
| `useNavigate` | ProfilePage | Programmatic navigation |
| `createContext` | AuthContext, ChatContext | Create the context objects |

### 📌 `useState` vs `useRef`

| | useState | useRef |
|--|---------|--------|
| Triggers re-render on change? | YES | NO |
| Use for | UI data (user sees it) | Internal refs, timers, DOM refs |
| Access value | `value` | `ref.current` |

---

## 🚀 10. Axios Deep Dive

### 📌 Why Axios Instead of `fetch`?

| Feature | fetch | axios |
|---------|-------|-------|
| Auto JSON parse | No (need `res.json()`) | Yes |
| Request timeout | Manual | Built-in |
| Interceptors | No | Yes |
| Base URL config | No | Yes |
| Default headers | Manual | Yes |

### 📌 How It's Used Here

```jsx
// AuthContext.jsx
const api = axios.create({ baseURL: backendUrl });
// Now every call uses backendUrl automatically

api.defaults.headers.common["token"] = token;
// Now every call sends this header automatically

// ChatContext.jsx - gets this 'api' as 'axios'
const { socket, axios } = useContext(AuthContext);
const { data } = await axios.get("/api/messages/users");
// Full URL: backendUrl + "/api/messages/users" + Header: token: <jwt>
```

**Destructuring the response:**
```jsx
const { data } = await axios.get("...");
// Same as:
const response = await axios.get("...");
const data = response.data;
```

Axios wraps the response in an object. The actual JSON is in `.data`.

---

## 🚀 11. TailwindCSS in This Project

Used for all styling. Key patterns:

```jsx
// Conditional classes
className={`base-classes ${condition ? 'class-if-true' : 'class-if-false'}`}

// Example from Sidebar:
className={`relative flex items-center gap-2 p-5
  ${selectedUser?._id === user._id ? 'bg-[#1c1a27]' : 'hover:bg-[#584f9a]/50'}`}
```

**Arbitrary values** — `bg-[#1c1a27]` uses exact hex color. `bg-[#584f9a]/50` means 50% opacity of that color.

**`max-md:hidden`** — Hide on screens smaller than md (768px). Responsive design in one class.

---

*Next: `04_REALTIME_SOCKETIO.md` — WebSockets and the complete real-time flow.*
