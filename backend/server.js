const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { pageNotFound, errorHandler } = require("./handler/errorHandler");
const path = require("path");

const app = express();
dotenv.config();
connectDB();
// allow app to accept json
app.use(express.json());

// api endpoint
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// deployment
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.use(pageNotFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// use socket.io for real time chat
const server = app.listen(PORT);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

// create an io connection
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  // create a room for particular user
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User join room: " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  // handle send messages in real time
  socket.on("new message", (message) => {
    var chat = message.chat;
    if (!chat.users) {
      console.log("Chat user is not defined");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === message.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", message);
    });
  });

  // clean up socket
  socket.off("setup", () => {
    console.log("User disconnected");
    socket.leave(userData._id);
  });
});
