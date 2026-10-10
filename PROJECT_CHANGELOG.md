# 📝 Project Upgrade Logger & Changelog

This document tracks all major architectural upgrades, structural changes, and system design improvements implemented in this project over time. It serves as a historical record of all problems solved.

## 🛠️ Complete Upgrade History

| Date | Feature / Problem Solved | Implementation / Core Tech Used | Status | Impact / Defense Level |
| :--- | :--- | :--- | :--- | :--- |
| **Pre-Oct** | **Baseline Setup** | MERN Stack setup, Socket.IO basic real-time messaging, JWT in standard headers/local storage. | Legacy | Junior |
| **2026-10-07** | **Git & Workspace Cleanup** | Added `.agents/` and `repomix-output.xml` to `.gitignore`. Deleted tracking for unnecessary agent logs. | ✅ Done | Maintenance |
| **2026-10-07** | **Auth Security Hardening** | Shifted JWTs to `HttpOnly`, `secure`, and `sameSite` cookies to completely block XSS attacks. Integrated Socket.IO middleware to parse cookies during the HTTP upgrade handshake. | ✅ Done | Senior / Security |
| **2026-10-07** | **MongoDB Internals Deep Dive** | Documented WiredTiger mechanics, Write-Ahead Logs (WAL), connection pooling, and the timestamp embedded inside MongoDB's `ObjectId` (first 4 bytes). | ✅ Done | Staff (Theoretical) |
| **2026-10-10** | **The N+1 Query Bottleneck** | Refactored `getUsersForSidebar` in `messageController`. Replaced `Promise.all` loop with a single MongoDB `$match` and `$group` **Aggregation Pipeline**. | ✅ Done | Senior (Performance) |
| **2026-10-10** | **Message States (WhatsApp-style)** | Replaced `seen: boolean` with `status: enum`. Added `messageDelivered` and `markAsSeen` Socket.IO Acknowledgment loops. | ✅ Done | Senior (Real-time architecture) |
| **2026-10-10** | **Friendship System (Normalized)** | Deprecated global user sidebar. Implemented `FriendRequest` and `Friendship` models. Used **MongoDB ACID Transactions** for atomic acceptance logic. | ✅ Done | Senior (DB Design) |
| **2026-10-10** | **Media Messaging Architecture** | Documented the shift from Base64 parsing (which blocks the Node.js event loop) to Direct-to-Cloud (Presigned URLs via Cloudinary). | 🚧 Planning | Staff (Scalability) |

---
*Note: For detailed implementation and interview defenses for each of these upgrades, refer to the `interviewFinAL/` directory.*
