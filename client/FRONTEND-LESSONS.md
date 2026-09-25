# NEXUS Frontend Lessons (Full Stack Updates)

## Lesson 1: Real-World Architecture
React app ka structure ab scalable ban gaya hai.
- **Context:** `client/context/` me global states rakhi gayi hain.
- **Components:** `client/src/components/` me UI logic hai jo Context se data read karta hai.
- **Backend Sync:** Data ab hardcoded nahi hai, API endpoints se aata hai.

## Lesson 2: Context API (Global State)
Jab app bada hota hai, `useState` har jagah pass karna (prop-drilling) problem ban jata hai. 
Isliye **Context API** use hoti hai:

```js
// AuthContext.jsx me data define hota hai
export const AuthContext = createContext();

// Aur kisi bhi component me easily mil jata hai
const { onlineUsers, logout } = useContext(AuthContext);
```

## Lesson 3: Backend APIs calling (Axios)
Local dummy arrays (e.g., `userDummyData`) hata diye gaye hain. Uski jagah HTTP requests use hoti hain:

```js
import axios from 'axios';

// Users fetch karne ka function
const getUsers = async () => {
  const response = await axios.get('/api/users');
  setUsers(response.data);
}
```

## Lesson 4: WebSockets (Socket.io)
HTTP requests hamesha Client-to-Server hoti hain. Chat ke liye hume Server-to-Client data instantly chahiye. 
Iske liye **Socket.io** use hota hai.

```js
// Socket par message sunna
socket.on("receiveMessage", (newMessage) => {
  setMessages((prev) => [...prev, newMessage]);
});
```
Yeh line ensure karti hai ki jaise hi backend naya message bheje, UI turant update ho.

## Lesson 5: Authentication Flow
Login form ab dummy submit nahi karta, actual backend auth check karta hai.
1. Form submit hota hai.
2. Axios API call karta hai (e.g. `/api/auth/login`).
3. Backend verify karke JWT (JSON Web Token) bhejta hai.
4. Token store hota hai aur `AuthContext` user ko "logged in" mark karta hai.
5. Socket connect hota hai (authenticated user ke liye).

## Lesson 6: Conditional UI & Loading States
Kyunki data backend se network ke through aata hai (isme time lagta hai), UI ko smart banna padta hai:
- API call ke dauran Spinner/Loading dikhana.
- Agar data empty hai (koi chats nahi), toh fallback/placeholder UI dikhana.

```js
if (isLoading) return <LoadingSpinner />
if (!selectedUser) return <NoChatSelected />
return <ChatContainer />
```

## Lesson 7: Best Practices Seekhein
1. **Separation of Concerns:** API calls aur complex logic Context/Hooks me rakhein, UI components ko sirf render karne ka kaam dein.
2. **Cleanup Effects:** `useEffect` me jab socket listener lagate hain, toh un-mount hone par unhe hata dena (cleanup) chahiye taki memory leak na ho.

```js
useEffect(() => {
  socket.on("event", handler);
  return () => socket.off("event", handler); // Cleanup
}, [])
```

---
**Final Note:** Ab yeh project ek proper Full Stack application hai, static UI demo nahi. Yaha API integration aur Real-time handling seekhne ke sabse main lessons hain!
