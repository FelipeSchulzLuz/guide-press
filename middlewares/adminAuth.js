const User = require("../user/User");

function adminAuth(req,res,next){
   if(req.session.user != undefined) {
       next()
   }else {
       console.log("falha ao autenticar");
       res.redirect("/")
   }
}

module.exports = adminAuth