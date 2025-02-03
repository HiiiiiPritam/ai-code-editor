import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import { app, server } from "./socket/initsocket.js";
import userRoutes from './routes/userRoutes.js'
import workspaceRouters from './routes/workspaceRoutes.js'
import connectDB from "./db/dbconn.js";
import aiRoutes from './routes/aiRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
dotenv.config()
app.use(express.json())
app.use(cors({
  credentials:true
}))

const PORT =process.env.PORT  || 8000 ;
// console.log(process.env.MONGODB_URI)
app.use('/api/user',userRoutes);
app.use('/api/workspace',workspaceRouters)
app.use('/api/ai',aiRoutes)
app.use('/api/notifications',notificationRoutes)

console.log("mongodb uri", process.env.MONGODB_URI);

connectDB(process.env.MONGODB_URI);

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Node.js!");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
