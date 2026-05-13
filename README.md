PencilDraw ✏️

PencilDraw is a real-time collaborative drawing application inspired by Excalidraw.
It allows users to draw, sketch, and collaborate on a shared canvas using WebSockets for real-time synchronization.

Built with modern full-stack technologies including Next.js, Node.js, PostgreSQL, WebSockets, and managed using Turborepo.


🚀 Features
. ✏️ Freehand drawing tool
. 🧽 Eraser tool
. 🎨 Color picker support
. 📏 Brush size customization
. ⚡ Real-time collaboration using WebSockets
. 🖼 Infinite canvas-like experience
. 🔄 Live synchronization between users
. 🗑 Clear/reset canvas
. 🧠 Optimized monorepo architecture using Turborepo


🛠 Tech Stack
➡️ Frontend

Next.js
TypeScript
HTML Canvas API
Tailwind CSS

➡️ Backend
Node.js
WebSocket Server
Database
PostgreSQL
Monorepo
Turborepo

📂 Project Structure
apps/
 ├── client          # Next.js frontend
 ├── ws-server    # WebSocket backend server
 |--- server      # node.js backend

packages/
 ├── ui           # Shared UI components
 ├── db           # Database configuration
 |-- common-data  # stored common data across application
 |-- Backend-common # user schema


⚡ How It Works
1. Login
2. Click on startDrawing Btn
3. create Drawing room 
4. Users join the drawing board.
5. Canvas events are captured in real time.
6. Drawing data is sent through WebSockets.
7. Backend broadcasts updates to connected users.
8. All users see synchronized drawings instantly.


