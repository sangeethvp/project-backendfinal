const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');



exports.registerUser = async (req, res) => {
    try {
   
      const { username, email, password, role } = req.body;
   
      if (!username.trim()) {
        return res.json({ error: "Name is required" });
      }
      if (!email) {
        return res.json({ error: "Email is taken" });
      }
      if (!password || password.length < 6) {
        return res.json({ error: "Password must be at least 6 characters long" });
     }
      //  check if email is taken
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(201).json({ error: "Email is taken" });
      }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password,salt);
 
  const user = await new User({
    username,
    email,
    password: hashedpassword,
    role:role
  }).save();
  
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
    expiresIn: "1hr",
  });
  // send response
  res.json({
    user: {
      name: user.username,
      email: user.email,
      role: user.role
     
    },
    token,
  });
  } catch (err) {
  console.log(err);
  }
};


exports.loginUser = async(req,res) => {
    const{email,password} = req.body;
    try{
        const user = await User.findOne({email})
        if(!user){ return res.status(401).json({message:'User not found, try wiith correct credential or register before login'})}

        const passwordmatch = await bcrypt.compare(password,user.password);
        if(!passwordmatch){ return res.status(401).json({message:'Please enter the correct password'})}
        const payload = { id: user.id, role: user.role };

        const token = jwt.sign(payload,process.env.JWT_SECRETKEY,{expiresIn:'1h'});
        res.json({
          user : {
            userId:user.id,
            name : user.username,
            email:user.email,
            role:user.role
          },
          token,
        });
    }catch(error){
        res.status(401).json({message:'error logging in,try again after sometimes'})
    }
};


