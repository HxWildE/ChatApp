# 🌟 Axios & Zod - Comprehensive Interview Question Bank

*Note: This curriculum is designed to test fundamentals first, moving into architecture, and finally testing your knowledge against project-specific implementations. Answers are omitted to allow for self-testing and curriculum review.*

---

## 🚀 LEVEL 1: HTTP & Axios Fundamentals
1. What is Axios, and what does it do?
2. How is Axios different from the native browser `fetch()` API?
3. What are the standard HTTP methods (GET, POST, PUT, DELETE, PATCH) and what is their semantic meaning?
4. What is a JavaScript Promise, and how does Axios utilize Promises?
5. How does Axios automatically transform JSON data for requests and responses?
6. Does an Axios request block the main thread in the browser while waiting for a response? Why or why not?
7. How do you send query parameters in an Axios GET request?
8. How do you send a payload body in an Axios POST request?
9. What happens if an Axios request returns a `404 Not Found` or `500 Internal Server Error`? Does the Promise resolve or reject? (Compare this to `fetch()`).

## 🚀 LEVEL 2: Axios Advanced Features
10. What is an Axios Interceptor?
11. Give an example of a Request Interceptor. Why would you use one?
12. Give an example of a Response Interceptor. How could it be used to handle expired authentication tokens?
13. How do you set global default configurations in Axios (like a Base URL or default Headers)?
14. How do you cancel an ongoing Axios request?
15. How does Axios handle Cross-Origin Resource Sharing (CORS) preflight requests?
16. How do you handle network timeouts in Axios?

## 🚀 LEVEL 3: Zod Fundamentals (Data Validation)
17. What is Zod, and what specific problem does it solve?
18. Why is backend data validation critical? Why can't we just rely on frontend React form validation?
19. What is the difference between compile-time type checking (TypeScript) and runtime validation (Zod)?
20. How do you define a basic string schema with constraints (e.g., minimum length, email format) in Zod?
21. How do you make a field optional in a Zod schema?
22. Explain the difference between `zodSchema.parse()` and `zodSchema.safeParse()`.
23. What happens to the Node.js process if `zodSchema.parse()` encounters invalid data and it is not wrapped in a `try/catch` block?

## 🚀 LEVEL 4: Zod Advanced Usage
24. How do you infer a TypeScript type directly from a Zod schema?
25. How do you customize error messages in Zod?
26. What is `z.object().refine()` used for? (e.g., cross-field validation like ensuring `password` matches `confirmPassword`).
27. How does Zod interact with Express middleware?

## 🚀 LEVEL 5: Cross-Question Chains
**Chain 1: The Request Lifecycle Drill**
- 28a: You click "Submit" on a React form. Explain exactly how Axios turns that object into a network request.
- 28b: → What happens to the JavaScript Event Loop while waiting for the response?
- 28c: → When the response arrives, how does Axios process it?
- 28d: → How does the Microtask Queue handle the `.then()` or `await` resolution?

**Chain 2: The Validation Security Drill**
- 29a: A malicious user bypasses your React app and uses Postman to send an empty POST request to your signup route. What happens?
- 29b: → If you didn't have Zod, what error would Mongoose throw?
- 29c: → Why is it better to catch this error at the Zod layer rather than the Database layer?

## 🚀 LEVEL 6: Project-Specific Implementation (ChatApp)
30. In your `AuthContext`, you do `api.defaults.headers.common['token'] = token`. Why do you do this globally instead of passing it into every single request?
31. What is the danger of setting default headers globally if you were dealing with requests to multiple different external domains?
32. Walk me through exactly how you extract the error message from a failed Axios request in your React `catch (error)` block. (`error.response.data.message`).
33. Why did you choose Zod over alternatives like Joi or Yup?
34. In your controller, if `safeParse` returns `{ success: false }`, how do you extract and format the Zod errors to send a clean `400 Bad Request` back to the frontend?
35. How does Zod protect your MongoDB database from NoSQL Injection attacks or unexpected data types?
