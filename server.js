require("dotenv").config();
const Msg = require("./models/messages");
const mongoose = require("mongoose");
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
mongoose
  .connect(mongoDB, { useNewUrlParser: true }, { useUnifiedTopology: true })
  .then(() => {
    console.log("Mongo connected");
  })
  .catch((err) => console.log(err));

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  Msg.find().then((result) => {
    socket.emit("output-messages", result);
  });

  sendStatus = function (s) {
    socket.emit("status", s);
  };

  socket.on("delete_message", function (messageId) {
    Msg.findByIdAndDelete(messageId)
      .then((result) => {
        console.log(result);
        socket.emit("delete_message", messageId);
      })
      .catch((err) => console.log(err));
  });

  socket.on("chat message", (data) => {
    let name = data.name;
    let message = data.message;

    if (name == "" || message == "") {
      // Send error status
      sendStatus("Please enter a name and message");
    } else {
      // Insert message
      Msg.create({
        name: data.name,
        msg: data.msg,
      }).then((result) => {
        io.emit("chat message", result);
      });

      // Send status object
      sendStatus({
        message: "Message sent",
        clear: true,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on Port ${PORT}`);
});
