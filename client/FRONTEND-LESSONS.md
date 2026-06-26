# ChatApp Frontend Lessons

## Lesson 1: React ka basic structure

React app ek tree hota hai.

- `main.jsx` — app ka starting point
- `App.jsx` — page routing
- `pages/` — actual screens
- `components/` — chote reusable UI parts
- `assets/` — static data aur images
- `index.css` — global styling

React folder structure ka matlab simple hai: logic aur UI ko alag-alag organize karna.

---

## Lesson 2: JSX aur components

### JSX hota kya hai?
JSX ek mix hai JavaScript aur HTML ka. Example:

```js
return (
  <div className="app">
    <p>Hello</p>
  </div>
)
```

### Component kya hota hai?
Component ek function hai jo UI return karta hai.

```js
const Button = () => {
  return <button>Click</button>
}
```

React ka UI components ke through build hota hai.

---

## Lesson 3: State aur props

### State
`useState` se component me data store karte hain.
Example:

```js
const [selectedUser, setSelectedUser] = useState(false)
```

Jab state change hoti hai, React automatically UI ko update karta hai.

### Props
Parent component data child me pass karta hai.

```js
<Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
```

Child me use karoge:

```js
const Sidebar = ({ selectedUser, setSelectedUser }) => { ... }
```

Is se data flow simple aur modular hota hai.

---

## Lesson 4: Routing + navigation

React Router app me pages ko routes se map karta hai.

```js
<Routes>
  <Route path='/' element={<HomePage/>}/>
  <Route path='/login' element={<LoginPage/>}/>
  <Route path='/profile' element={<ProfilePage/>}/>
</Routes>
```

`useNavigate()` se code se page change kar sakte ho:

```js
const navigate = useNavigate();
navigate('/profile')
```

Jab route change hota hai, React naya component dikha deta hai.

---

## Lesson 5: Form handling

`LoginPage` me form bana hua hai.

Inputs controlled hain:

```js
<input value={email} onChange={(e) => setEmail(e.target.value)} />
```

Form submit:

```js
const onSubmitHandler = (event) => {
  event.preventDefault();
}
```

`preventDefault()` browser ka default submit page reload rokta hai.

---

## Lesson 6: List rendering

`Sidebar` aur `ChatContainer` arrays ko map karte hain.

```js
{userDummyData.map((user, index) => (
  <div key={index}>{user.fullName}</div>
))}
```

React me `key` important hota hai list items ke sath.

---

## Lesson 7: Conditional rendering

React me condition ke basis pe alag UI show hota hai.

```js
return selectedUser ? <Chat /> : <Empty />
```

Yahi logic `ChatContainer` me hai.

---

## Lesson 8: Styling

Yeh project Tailwind use karta hai.

Example:

```js
<div className='bg-[#584f9a] rounded-full flex items-center gap-2'>
```

Aur custom global CSS `index.css` me hai:
- `.glass-panel`
- background gradients
- scrollbar hide

---

## Lesson 9: Data sources

Static data `assets/assets.js` me hai.

- `userDummyData` = users
- `messagesDummyData` = chat messages
- `imagesDummyData` = gallery images

Real app me yeh backend se aata, lekin abhi demo me local file use ho rahi hai.

---

## Lesson 10: Project ko kaise samjho

1. `main.jsx` se start karo
2. `App.jsx` me routes dekho
3. `HomePage` me state aur components dekho
4. `Sidebar` interaction samjho
5. `ChatContainer` me message rendering dekho
6. `ProfilePage` me form + navigation dekho

Yeh simple sequence project ko clear karega.
