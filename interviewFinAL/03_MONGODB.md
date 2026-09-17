# 🌟 MongoDB & Mongoose - Comprehensive Interview Question Bank

*Note: This curriculum is designed to test fundamentals first, moving into architecture, and finally testing your knowledge against project-specific implementations. Answers are omitted to allow for self-testing and curriculum review.*

---

## 🚀 LEVEL 1: MongoDB Fundamentals
1. What is MongoDB, and how does it differ from a relational database like PostgreSQL or MySQL?
2. What are Collections and Documents in MongoDB? What do they map to in a SQL database?
3. What is BSON? How is it different from JSON?
4. Why does MongoDB use BSON internally instead of standard JSON?
5. What is an `_id` field in MongoDB?
6. Explain the exact structure of an `ObjectId` (Timestamp, Machine ID, Process ID, Counter).
7. If you have an `ObjectId`, do you need a separate `createdAt` field to know when a document was created?
8. What does "Schema-less" (or flexible schema) mean in MongoDB?
9. When should you use a NoSQL database over a SQL database?

## 🚀 LEVEL 2: Mongoose (ODM) Basics
10. What is Mongoose, and why do we use it on top of MongoDB?
11. What is an ODM (Object Data Modeling) library? How is it different from an ORM?
12. What is a Schema in Mongoose?
13. What is a Model in Mongoose? How is it different from a Schema?
14. How do you define default values in a Mongoose Schema?
15. What are Mongoose Virtuals?
16. Explain Mongoose Middleware (Pre and Post hooks). Give an example of when to use them.

## 🚀 LEVEL 3: Querying & Operations
17. Explain the difference between `Model.find()`, `Model.findOne()`, and `Model.findById()`.
18. What is the difference between `Model.updateOne()` and `Model.updateMany()`?
19. What does the `$ne` operator do in a MongoDB query?
20. How do you use the `$or` operator?
21. What is the difference between `Model.create()` and `new Model().save()`?
22. How do you delete a document in Mongoose?
23. What is query projection in MongoDB? How do you exclude a specific field from a result? (e.g., excluding the password).
24. How do you sort results in MongoDB?

## 🚀 LEVEL 4: Performance & Advanced Concepts
25. What is an Index in MongoDB, and why is it crucial for performance?
26. What happens if you run a `.find()` query on a field that is not indexed in a collection of 10 million documents? (Collection Scan vs Index Scan).
27. How does a Compound Index work?
28. What is the Aggregation Pipeline in MongoDB? Name 3 common aggregation stages (`$match`, `$group`, `$lookup`).
29. How does MongoDB handle relationships between data? (Referencing vs Embedding).
30. What is `populate()` in Mongoose, and how does it mimic a SQL JOIN?
31. What is a Connection Pool in MongoDB? Why doesn't Node.js open a new connection for every single HTTP request?

## 🚀 LEVEL 5: Cross-Question Chains
**Chain 1: Data Modeling Drill**
- 32a: How would you store a user's address in MongoDB?
- 32b: → Should you embed the address inside the User document or create a separate Address collection?
- 32c: → What are the performance implications if the address array grows to 10,000 items? (Document Size Limit).
- 32d: → What is the maximum size of a BSON document?

**Chain 2: Query Performance Drill**
- 33a: You need to find all messages between User A and User B. How do you query this?
- 33b: → As the database grows, this query becomes extremely slow. Why?
- 33c: → How do you fix it using Indexes?
- 33d: → What is the tradeoff of adding too many indexes to a collection?

## 🚀 LEVEL 6: Project-Specific Implementation (ChatApp)
34. In your `User` model, you set `email: { type: String, unique: true }`. Is `unique: true` a Mongoose validator? How does MongoDB enforce it under the hood?
35. You used `User.find({ _id: { $ne: userId } })` for the sidebar. What is the performance trap of using exclusion operators like `$ne` on massive datasets?
36. Walk me through the MongoDB query you used to fetch the conversation history between two users in `getMessages`.
37. In `getMessages`, you run `Message.updateMany({ ... }, { seen: true })`. Why is this more efficient than fetching the messages, modifying them in Node.js, and saving them back?
38. You chained `.select('-password')` when fetching users. Why is this better than fetching the whole document and deleting the password property in JavaScript?
39. You enabled `timestamps: true` in your Schemas. How does Mongoose automatically handle this, and what fields does it inject?
40. In `getUsersForSidebar`, you used `Promise.all()` to run multiple `Message.find()` queries concurrently. How does the MongoDB driver handle these concurrent requests over the Connection Pool?
