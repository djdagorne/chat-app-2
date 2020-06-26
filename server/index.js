const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");

const PORT = process.env.PORT || 5000;

const router = require("./router.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

// we create  a socket on user connection
io.on("connection", (socket) => {
  console.log("we have a new connection");
  //we use callback for error handling
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) {
      return callback(error);
    }
    // admin messages are just message, users get sendMessage listeners
    // this emits a message to the joining user
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to ${user.room}`,
    });
    // this lets all other users in room know who joined.
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined the chat.`,
    });
    socket.join(user.room);

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("user has left the connection");
  });
});

app.use(router);

server.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});
