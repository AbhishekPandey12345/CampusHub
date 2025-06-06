import express from "express";
import mongoose from "mongoose";
import { DB_NAME } from "./Constant.js";
import dotenv from "dotenv"
import { app } from "./App.js";


dotenv.config({
    path:'./env'
});
const connection = async  ()=>{
    try{
         await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
         app.on("error",(error)=>{
            console.log("ERROR: ", error)
            throw error;
         })      
    }
    catch(error){
        console.log("App Listen At Port", `${process.env.PORT}`)
            console.log("ERROR: ", error);
            throw error
    }
};
connection();

import http, { ServerResponse } from 'http';
import { Server } from 'socket.io'
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods:['GET','POST' , 'PUT' , 'DELETE']
  },
  pingTimeout: 60000
});

io.on('connection', (socket) => {
  socket.on('setup', (userdata) => {
    socket.join(userdata);
    socket.emit("connected");
  });

  socket.on("join chat" , (room)=>{
    socket.join(room);
    // console.log("user the join the room" , room);
  })

  socket.on('new message' , (newMessage)=>{
    var chat = newMessage.chat;
    if(!chat.users)return ;
    chat.users.forEach(user => {
        socket.in(user).emit("message recieved" , newMessage)
    });
  })

  socket.off('setup',()=>{
     socket.leave(userdata)
  })
});
server.listen( (process.env.PORT || 3000) , () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});