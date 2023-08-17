const User = require('../models/UserModel');
const Chat=require('../models/Chatmodel')
const bcrypt=require('bcryptjs')




exports.getregister=async(req,res)=>{

    try {

        res.render('register')
     
    } catch (error) {
        console.log(error)
      
    }
}
exports.register=async(req,res)=>{

    try {
 console.log("IJjm00",req.body)
 const email=req.body.email
console.log("JHUNJJ",email)

 const usersd=await User.findOne({email:email});
 console.log("BJHBHBH")

    if(usersd){
        console.log("HNJJNJNKM")
       return res.render('register',{message:"email already exist please use another email"})
    }
console.log("JBHHHJHJNUJNKKJK")
        const hashpass = await bcrypt.hash(req.body.password,11);

        const user= new User({

           
            name:req.body.name,
            email:email,
            password:hashpass,
            image:'images/'+req.file.filename
        })
        await user.save()
        console.log("jkjkkj",user)
       res.render('register',{messa:"Registration Suceesfully...."})
     
       

        
    } catch (error) {
        console.log(error)
       
    }
}


exports.getlogin=async(req,res)=>{

    try {

        res.render('login')
     
    } catch (error) {
        console.log(error)
      
    }
}


exports.login=async(req,res)=>{

    try {
   const {email,password}=req.body;

   

  const userdata=await User.findOne({email:email});

  if(userdata){
    const passwordmatch=await bcrypt.compare(password,userdata.password);
    if(passwordmatch){

       req.session.user=userdata;
       res.redirect('/dashboard');
    }
    else{
        res.render('login',{message:"your email and password are incorrect"});
    }
  }
     
    } catch (error) {
        console.log(error)
      
    }
}

exports.logout=async(req,res)=>{

    try {
//   console.log("UJMJMK")
        req.session.destroy();
        res.redirect('/')
     
    } catch (error) {
        console.log(error)
      
    }
}

exports.getdashboard=async(req,res)=>{

    try {
        const users=await User.find({ _id:{$nin:[req.session.user._id]}})
      
        res.render('dashboard',{user:req.session.user,users:users});
        
     
    } catch (error) {
        console.log(error)
      
    }
}


exports.chat=async(req,res)=>{
    try {
        const message= new Chat({
            sender_id:req.body.sender_id,
            receiver_id:req.body.receiver_id,
            message:req.body.message
        });
       const chat= await message.save();
       console.log(chat)
        res.status(200).send({success:true,msg:"chat inserted",data:chat})
    } catch (error) {
        console.log(error)
        res.status(500).send({success:false,msg:error.mesage})
    }
}

exports.deletechat=async(req,res)=>{
    try {

        await Chat.deleteOne({_id:req.body.id});
        res.status(200).json({success:true,msg:"Chat delete successfully"});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,msg:error.message})
    }
}