const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const accountRoute = require('./routes/account.route');
const chatRoute = require('./routes/chat.route');
const Message = require('./models/message.model');

const app = express()
const port = 5000
const http = require("http").Server(app);
const io = require("socket.io")(http);

//connect mongoDB
mongoose.connect('mongodb+srv://Linhkeo:PkCKifOarK85NHqy@cluster0.femwd.mongodb.net/tiko-realtime', 
    {useNewUrlParser: true, useUnifiedTopology: true}
);
mongoose.connection.on('connected', () => {
        console.log('connected to mongo yeahh!');
    });
mongoose.connection.on('error', (err) => {
    console.log('error connecting:', err);
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});

app.use(bodyParser.json()) // for parsing application/json
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true })) 

io.on("connection", function(socket) {
  socket.on("send-message", async function({mess, time, channelId, user}) {
    let newMessage = new Message({
      content: mess,
      channelId,
      time,
      user: JSON.parse(user)
    });

    let messages = await Message.find({channelId});

    newMessage.save((err, newMessage) => {
      if (err) {
          console.log(err);
      }
      console.log('Saved successfully');
    });

    return io.sockets.emit("message-res", [...messages, newMessage]);
  });
});

app.use('/account', accountRoute);
app.use('/chat', chatRoute);

http.listen(port, function() {
  console.log("Listening on *:" + port);
})

