const express = require('express')
const http = require("http")
const cors = require('cors')
const dotenv = require('dotenv/config')
const connectDB = require('./lib/db.js')

const app = express()
const server = http.createServer(app)

app.use(express.json({limit :"4mb"}))
app.use(cors())

app.use("/api/status",(req,res)=>res.send("Server is live !"))

const start = async () => {
  const p = await connectDB()
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, ()=> console.log("running on port : "+ PORT))
}

start()