const express = require('express');
//person
const router = express.Router();
const User = require("./../models/user");
const {jwtAuthMiddleware, generateToken} = require('./../jwt');
const { json } = require('body-parser');
router.post('/signup',async(req, res) =>{
  try {
    const data  = req.body;
    const newUser = new User(data);
    const response = await newUser.save();
    console.log("data saved");
    const payload = {
      id: response.id,
    }
    // console.log(json.s(payload));
    const token = generateToken(payload);
    console.log("token is: ", token);
    res.status(200).json({response: response, token: token });

    
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({error: 'internal error occured'});
  }
    
})
// Login Route
router.post('/login', async(req, res) => {
  try{
    const {adharCardNumber, password} = req.body;
    const user = await User.findOne({adharCardNumber: adharCardNumber});
    if( !user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid username or password'});
    }
    // generate Token 
    const payload = {
      id: user.id,
    }
    const token = generateToken(payload);
    // return token as response
    res.json({token})
  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try{
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({user});
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

  router.put('/profile/password',jwtAuthMiddleware, async(req, res)=>{
    try {
      const userId = req.user.id;
      const {currentPassword, newPassword} = req.body;
      const user = await User.findById(userId);
      console.log("data updated");
      res.status(200).json(response);
      if( !user || !(await user.comparePassword(currentPassword))){
        return res.status(401).json({error: 'Invalid username or password'});
      }
      user.password = newPassword;
      user.save();
      console.log("password updated");
      res.status(200).json({message:"password updated"});
    }
    catch (error) {
      console.log(error);
      res.status(500).json({error: 'internal error occured'});
    }
  })

  module.exports = router;