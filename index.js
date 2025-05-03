const express = require('express'); // Import Express
const http = require('http'); // Import HTTP module
const { Server } = require('socket.io'); // Import Socket.IO
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express(); // Create an Express app
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server,{
   cors: {
      origin: '*',
      methods: ['GET', 'POST'],
  },
}); // Attach Socket.IO to the server
const cors = require('cors');

// Middleware for parsing application/json
app.use(bodyParser.json());

// Enable CORS
app.use(cors({
   origin: '*', // Replace with your client URL
   methods: ['GET', 'POST'],
   credentials: true,
}));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/Index.html'));
});

// Listen for connection events
io.on('connection', (socket) => {
   socket.on("RequestConnection",({UserID,AnotherID})=>{
      // console.table({UserID,AnotherID})
      socket.broadcast.emit("Requestanother",{UserID,AnotherID})
   })
   socket.on("Requestanotheraccept",({msg,UserID,AnotherID})=>{
      // console.table({msg,UserID,AnotherID})
      if(msg == "Success"){
         socket.broadcast.emit("RequestUsercallback",{UserID,AnotherID})
      }
   })
   socket.on("CHATLEAVECODE",({AnotherID})=>{
      socket.broadcast.emit("CHATLEAVECODEAnother",{AnotherID})
   })
   socket.on("CHATMESSAGES",({Message,MessageType,datetime,loginID,AnotherID})=>{
      socket.broadcast.emit("CHATMESSAGESAnother",{Message,MessageType,datetime,loginID,AnotherID})
   })
   socket.on("startFileTransfer",({type,name,size,AnotherID})=>{
      socket.broadcast.emit("startFileTransferAnother",{type,name,size,AnotherID})
   })
   socket.on("chunkFileTransfer",({type,name,size,data,offset,AnotherID})=>{
      socket.broadcast.emit("chunkFileTransferAnother",{type,name,size,data,offset,AnotherID})
   })
   socket.on("endFileTransfer",({type,name,AnotherID})=>{
      socket.broadcast.emit("endFileTransferAnother",{type,name,AnotherID})
   })
   socket.on("endFileTransferAnotherCALLBACK",({msg,UserID,AnotherID})=>{
      socket.broadcast.emit("endFileTransferUserCALLBACK",{msg,UserID,AnotherID})
   })
})

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running...`);
});
