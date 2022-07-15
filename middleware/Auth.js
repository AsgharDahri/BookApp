const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if(token)
  {
    jwt.verify(token,'Asghar',(err,decodedToken)=>{
      if(err)
      {
        console.log('error');
        res.redirect('login')
      }
      else
      {
        // console.log(decodedToken);
        next();
      }
    })
  }
  else
  {
    res.redirect('login')
    
  }
};

module.exports = verifyToken;