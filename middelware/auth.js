const islogin=async(req,res,next)=>{
    try {
      if(req.session.user){}
      else{
       return res.redirect('/');
      } 
      next(); 
    } catch (error) {
        console.log(error);
    }
}
const islogout=async(req,res,next)=>{
    try {
      if(req.session.user){
       return res.redirect('/dashboard');
      }
      next();
       
    } catch (error) {
        console.log(error);
    }
}

module.exports={islogin,islogout}