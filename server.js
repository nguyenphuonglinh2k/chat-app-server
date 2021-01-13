const port = process.env.PORT || 5000 
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const accountRoute = require('./routes/account.route');
const chatRoute = require('./routes/chat.route');
const Message = require('./models/message.model');

const app = express()
const http = require("http").Server(app);
const io = require("socket.io")(http);

//connect mongoDB
mongoose.connect('mongodb+srv://Linhkeo:PkCKifOarK85NHqy@cluster0.femwd.mongodb.net/tiko-realtime', 
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
);
mongoose.connection.on('connected', () => {
        console.log('connected to mongo yeahh!');
    });
mongoose.connection.on('error', (err) => {
    console.log('error connecting:', err);
});

//cors
app.use(cors())
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});

//socket
io.on("connection", function(socket) {
  socket.on("send-message", async function({content, upload, time, channelId, user}) {
    let newMessage = new Message({
      content,
      upload,
      channelId,
      time,
      user: user._id
    });

    newMessage.save((err, newMessage) => {
      if (err) {
          console.log(err);
      }
      console.log('Saved successfully');
    });

    let messages = await Message
                    .find({ channelId })
                    .populate("user", "_id username email userImageUrl"); 

    // sending to all clients except sender
    return socket.broadcast.emit("message-res", messages);
    // return io.sockets.emit("message-res", messages);
  });
});

//routes
app.use('/account', accountRoute);
app.use('/chat', chatRoute);

http.listen(port, function() {
  console.log("Listening on *:" + port);
})

