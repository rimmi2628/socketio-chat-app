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

  const usp=io.of('/user-namespace');

    usp.on('connection', async function(socket){

    console.log("User Connected");

    const user_id=socket.handshake.auth.token;
 
      await User.findByIdAndUpdate({_id:user_id},{$set:{is_online:'1'}});

      socket.broadcast.emit('onlineuser',{userid:user_id})

      socket.on('disconnect', async function(){

        console.log("User disconnect")

        const user_id=socket.handshake.auth.token;

        await User.findByIdAndUpdate({_id:user_id},{$set:{is_online:'0'}});

        socket.broadcast.emit('offlineuser',{userid:user_id})

        socket.on('newchat',function(data){
    
          socket.broadcast.emit('loadnewchat', data)
          console.log("HUNJ",data)

        })
    })
})

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
    console.log("server is listen on port 3000");
})