# NEXUS Frontend Interview Summary

## Important points for interview

- Frontend **React, Vite aur Tailwind CSS** se bana hai.
- **Routing:** `react-router-dom` se manage ho rahi hai (Home, Login, Profile).
- **State Management:** **Context API** (`AuthContext` aur `ChatContext`) use kiya gaya hai taaki global state effectively manage ho sake aur prop-drilling na karni pade.
- **Backend Integration:** `axios` ka use karke REST APIs se data fetch kiya jata hai (User Auth, Fetching Messages, Fetching Users).
- **Real-time Chat:** **Socket.io-client** ka use karke WebSockets integrate kiya gaya hai, jisse instant messaging aur online/offline status live update hote hain.

## Key frontend concepts covered

- **Hooks:** `useState` (local state), `useEffect` (side effects aur API calls), `useContext` (global state).
- **Context API:** Global data (jaise user login info, chat list) store karne ka standard tarika.
- **Socket.io:** Client side event listeners (`socket.on`) aur emitters (`socket.emit`) handle kiye gaye hain.
- **Controlled Components:** Form handling (`LoginPage`) properly managed hai.
- **Conditional Rendering:** Active chats, empty states, aur loading states smoothly handle kiye gaye hain.

## Simple architecture summary

1. `main.jsx` -> Providers (`AuthContext`, `ChatContext`) app ko wrap karte hain.
2. `App.jsx` -> API ke through check karta hai ki user logged in hai ya nahi, uske hisaab se Routes protect hote hain.
3. User login karta hai -> token/session save hota hai -> Socket connection establish hota hai.
4. `HomePage` load hota hai -> Users ki list API se aati hai -> Sidebar update hota hai.
5. User select hota hai -> Uske past messages API se aate hain -> Socket us chat ke naye messages real-time me push karta hai.

## Bugs / limitations ya discuss karne layak

- Security ke liye JWT tokens aur unki storage (localStorage vs HTTP-only cookies) discuss kar sakte ho.
- Real-time messages ka scale badhne par pagination / infinite scrolling implement karna zaroori hoga.

## Presentable explanation

“Ye ek Full Stack NEXUS ka frontend hai jo React, Tailwind aur Vite par bana hai. Isme main focus state management aur real-time data handling par hai. Maine Context API ka use karke Auth aur Chat data ko globally manage kiya hai. Backend se communication ke liye Axios (REST APIs) aur real-time messaging/online-status ke liye Socket.io use kiya gaya hai. Components bohot modular hain aur UI fully responsive hai.”

## Quick cheat sheet

- `Context API` = Global data (user, chats)
- `Socket.io` = Real-time magic (live chat, online status)
- `Axios` = HTTP requests (Login, Get messages)
- `useContext` = Context se data read karna
- `useEffect` = API calls aur Socket event listeners setup karna
