# 📝 Project Upgrade Logger & Changelog

This document strictly tracks all major architectural upgrades, structural changes, and system design improvements implemented in this project over time.

## Log Entries

### [2026-10-07] Auth & MongoDB Deep Dives 
- **Time:** ~18:05 IST
- **Action:** Created massive interview-defense documentation for JWT, HttpOnly Cookies, and Socket.IO Authentication.
- **Action:** Created detailed docs on MongoDB's `_id` timestamps and WiredTiger engine mechanics.
- **Status:** Documentation finalized in `PROJECTREAD` and `docs`.

### [2026-10-10] The N+1 Problem Fix (Aggregation Pipeline)
- **Time:** ~12:05 IST
- **Action:** Refactored `getUsersForSidebar` in `server/controllers/messageController.js`.
- **Details:** Removed the extremely unscalable `Promise.all` `.map` loop that queried the DB `N` times. Replaced it with a single MongoDB Aggregation Pipeline (`$match` and `$group`).
- **Status:** Implemented & Documented in `interviewFinAL`.

### [2026-10-10] Architectural Masterclasses Initiated
- **Time:** ~12:05 IST
- **Action:** Generated highly detailed Interview Final Dossiers for 3 major upgrades:
  1. Friendship System (MongoDB Transactions & Normalized Collections)
  2. Message States (Client-Server-Socket Acknowledgment Flow)
  3. Media Messaging (Direct-to-Cloud Uploads bypassing Node.js Event Loop)
- **Status:** Documentation finalized in `interviewFinAL`.
