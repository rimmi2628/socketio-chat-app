const express=require('express');

const app=express();

const mongoose=require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/dynamicchat')

const bodyParser = require('body-parser');

const path = require('path');
const http=require('http').Server(app);

const io=require('socket.io')(http)

const session = require('express-session');

require('dotenv').config();

const userroute=require('./routes/Userroutes');

const User=require('./models/UserModel');

const Chat=require('./models/Chatmodel')

  // ... Other code ...

const usp = io.of('/user-namespace');

usp.on('connection', async function (socket) {
    console.log("User Connected");

    const user_id = socket.handshake.auth.token;

    await User.findByIdAndUpdate({ _id: user_id }, { $set: { is_online: '1' } });

    socket.broadcast.emit('onlineuser', { userid: user_id });

    socket.on('disconnect', async function () {
        console.log("User disconnect");

        const user_id = socket.handshake.auth.token;

        await User.findByIdAndUpdate({ _id: user_id }, { $set: { is_online: '0' } });

        socket.broadcast.emit('offlineuser', { userid: user_id });
    });

    socket.on('newchat', function (data) {
        // Emit the event within the /user-namespace
        usp.emit('loadnewchat', data);
    });

    socket.on('existchat',async function(data){
      var chats=await Chat.find({$or:[{
        sender_id:data.sender_id,
        receiver_id:data.receiver_id},
        {sender_id:data.receiver_id,receiver_id:data.sender_id}
      ]})
      socket.emit('loadchat',{chats: chats})
    })

    socket.on('chatdeleted',function(id){
      usp.emit('messagedeleted',id)
    })
   
});

// ... Other code ...


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(session({
    secret:process.env.Session_Secret,
    resave: false,
    saveUninitialized: true
}));


app.use(express.json());

app.use(userroute)

http.listen(2000,function(){
    console.log("server is listen on port 2000");
})