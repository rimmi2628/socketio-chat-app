const express = require('express');
const router = express.Router();
const upload=require('../middelware/multer')

const usercontroller=require('../controller/Usercontroller');
const auth=require('../middelware/auth');
router.get('/getreg',auth.islogout,usercontroller.getregister);

router.post('/register',upload.single('image'),usercontroller.register);

router.get('/',auth.islogout,usercontroller.getlogin);

router.post('/',usercontroller.login);

router.get('/logout',auth.islogin,usercontroller.logout);

router.get('/dashboard',auth.islogin,usercontroller.getdashboard);

router.post('/savechat',auth.islogin,usercontroller.chat);

router.post('/deletechat',auth.islogin,usercontroller.deletechat);

router.get('*',function(req,res){
    res.redirect('/');
})

module.exports=router;