# 🌟 Express.js - Comprehensive Interview Question Bank

*Note: This curriculum is designed to test fundamentals first, moving into architecture, and finally testing your knowledge against project-specific implementations. Answers are omitted to allow for self-testing and curriculum review.*

---

## 🚀 LEVEL 1: Express Fundamentals
1. What is Express.js, and why do we use it instead of the native Node.js `http` module?
2. Is Express an opinionated or unopinionated framework? What does that mean?
3. What is the basic structure of an Express route? (`app.METHOD(PATH, HANDLER)`)
4. What is the difference between `app.use()` and `app.get()`?
5. What is the `req` (Request) object? Name 3 important properties on it.
6. What is the `res` (Response) object? Name 3 important methods on it.
7. How do you extract data from the URL path? (e.g., `/users/123`)
8. How do you extract data from the URL query string? (e.g., `/search?query=hello`)
9. How do you extract data from the HTTP request body?
10. What does `res.send()` do compared to `res.json()`?

## 🚀 LEVEL 2: Middleware Architecture
11. What exactly is Middleware in Express?
12. Explain the Request/Response Pipeline in Express.
13. What is the `next()` function, and what happens if you forget to call it?
14. What happens if you call `res.json()` but still call `next()` afterwards?
15. What are the different types of middleware? (Application-level, Router-level, Built-in, Third-party, Error-handling).
16. How does Express know a middleware is meant for Error Handling?
17. What is `express.json()` and how does it work under the hood?
18. What is `express.urlencoded()` and when is it used?
19. What is CORS? Why is the `cors()` middleware necessary for frontend-backend communication?
20. In what order does Express execute middleware and routes?

## 🚀 LEVEL 3: Routing & Architecture
21. What is `express.Router()` and why is it used?
22. How does modular routing help in scaling a codebase?
23. What happens if an incoming request doesn't match any of your defined routes?
24. How do you implement a global "404 Not Found" handler in Express?
25. Explain the concept of Route Parameters vs Query Parameters. When should you use which?
26. Does Express parse JSON bodies by default? Why or why not?

## 🚀 LEVEL 4: Security & Performance
27. What is the "Cannot set headers after they are sent to the client" error, and what causes it?
28. How do you protect Express headers from revealing the server technology? (e.g., Helmet).
29. How do you prevent Denial of Service (DoS) attacks involving huge JSON payloads in Express?
30. How do you handle synchronous vs asynchronous errors inside an Express controller?
31. In Express 4.x, what happens if an `async` route handler throws an error and you don't use a `try/catch` block?

## 🚀 LEVEL 5: Cross-Question Chains
**Chain 1: The Middleware Pipeline**
- 32a: How does a request travel from the client to the database?
- 32b: → What role does middleware play before the controller?
- 32c: → If middleware throws an error, how do you stop the pipeline?
- 32d: → How do you catch that error centrally?

**Chain 2: Data Parsing**
- 33a: Why is `req.body` undefined by default?
- 33b: → What does `express.json()` actually do with the incoming TCP stream?
- 33c: → What is the difference between parsing `application/json` and `multipart/form-data`?

## 🚀 LEVEL 6: Project-Specific Implementation (ChatApp)
34. Walk me through the exact pipeline of your `POST /api/messages/send/:id` route, from the moment the request hits the server to the final response.
35. In your `protectRoute` middleware, you attach `req.user = user`. Why do we mutate the `req` object instead of passing it as a variable to the next function?
36. What is the trap of writing `res.status(401).json({ error: "Unauthorized" })` without using the `return` keyword in your `protectRoute` middleware?
37. You used `express.json({ limit: "15mb" })`. Why did you change the default limit?
38. What are the security implications of increasing the JSON payload limit to 15mb for your chat application?
39. You grouped your routes into `userRoutes.js` and `messageRoutes.js`. How does Express mount these inside `server.js` using the Router pattern?
40. If a frontend React user sends a request to `/api/messages/fakeEndpoint`, what exact response does your Express server send back right now, and how would you improve it?
