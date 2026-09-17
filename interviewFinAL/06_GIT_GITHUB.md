# 🌟 Git & GitHub - Comprehensive Interview Question Bank

*Note: This curriculum is designed to test fundamentals first, moving into architecture, and finally testing your knowledge against project-specific implementations. Answers are omitted to allow for self-testing and curriculum review.*

---

## 🚀 LEVEL 1: Version Control Fundamentals
1. What is Version Control, and why is it necessary for software development?
2. What is Git, and how is it fundamentally different from centralized systems like SVN? (Distributed Version Control).
3. What is the difference between Git and GitHub?
4. Explain the three main states that a file can reside in within Git: Working Directory, Staging Area, and Repository.
5. What does `git clone` actually do?
6. What is the purpose of the `.git` hidden folder inside a project?
7. What does `git status` tell you?
8. Explain the basic workflow: `git add` -> `git commit` -> `git push`.

## 🚀 LEVEL 2: Branching & Merging
9. What is a Git Branch? Why do we use them?
10. What does the `HEAD` pointer mean in Git?
11. How do you create a new branch and switch to it in one command?
12. What happens when you execute a `git merge`?
13. What is a "Merge Conflict"? How and why does it occur?
14. Explain the steps to manually resolve a Merge Conflict.
15. What is a "Fast-Forward" merge?
16. What is the difference between `git merge` and `git rebase`?
17. Why is it highly dangerous to `git rebase` commits that have already been pushed to a public remote branch?

## 🚀 LEVEL 3: Advanced Git Operations
18. You just made a commit, but you realized you forgot to include a file. How do you add it to the previous commit without creating a new one? (`git commit --amend`).
19. What is the difference between `git reset --soft`, `git reset --mixed`, and `git reset --hard`?
20. You accidentally pushed a commit containing a hardcoded database password to GitHub. What is the exact sequence of commands you need to run to remove it from the history?
21. What does `git revert` do, and how is it different from `git reset`?
22. What is `git stash`? When would you use it?
23. What does `git fetch` do, and how is it different from `git pull`?
24. What is a "Detached HEAD" state?
25. How do you view the commit history? (`git log`).

## 🚀 LEVEL 4: GitHub & Collaboration
26. What is a "Remote" in Git? (e.g., `origin`).
27. What is a Pull Request (PR) in GitHub?
28. Explain the difference between Forking a repository and Branching within a repository.
29. What is a `.gitignore` file? How does it work?
30. If a file is already being tracked by Git, and you add it to `.gitignore`, will Git stop tracking it? How do you fix this?
31. What are GitHub Actions (CI/CD)? Give a basic example of what you might use them for.

## 🚀 LEVEL 5: Cross-Question Chains
**Chain 1: The Undo Drill**
- 32a: You made a terrible mistake in your code, but you haven't committed it yet. How do you discard all changes in your working directory?
- 32b: → You staged the files (`git add`), but realize they are wrong. How do you unstage them?
- 32c: → You actually committed the files locally. How do you undo the commit but keep the code changes?
- 32d: → You pushed the bad commit to `main` on GitHub. How do you safely undo it without rewriting public history?

**Chain 2: The Collaboration Drill**
- 33a: You and your coworker both pull from `main` on Monday morning. You both edit line 15 of `server.js`.
- 33b: → Your coworker pushes their code to `main` at 2 PM. You try to push your code at 3 PM. What does Git tell you?
- 33c: → You run `git pull`. What happens to your local files?
- 33d: → How do you finalize this process so you can successfully push?

## 🚀 LEVEL 6: Project-Specific Implementation (ChatApp)
34. In your ChatApp, you have a `.env` file containing your MongoDB URI and JWT Secret. Walk me through exactly how you ensured this file was never pushed to GitHub.
35. Suppose you are working on the ChatApp with a friend. You are building the WebSocket logic on a branch called `feature/socket-io`, and your friend is building the UI on `feature/chat-ui`. Explain the exact Git/GitHub workflow of how these two branches will eventually be combined into `main`.
36. You recently made massive changes to `server.js` to implement Socket.IO. Mid-way through, you find a critical bug in production that needs an immediate fix on `main`. How do you use Git to safely pause your Socket.IO work, fix the bug on `main`, and then resume your Socket.IO work?
37. When you run `git push origin main` for your ChatApp, what exactly is Git calculating and transferring over the network to GitHub?
