const router = require('express').Router();
const User = require('../model/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');


router.post('/register', async (req, res) => {

    // VALIDATE DATA
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // CHECK REGISTERED USER
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email already in used');

    // PASSWORD HASHING
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // CREATE NEW USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
        res.status(200)
    }catch(err){
        res.status(400).send(err);
    }

});



// LOGIN
router.post('/login', async (req, res) => {

    // VALIDATE DATA
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // CHECK REGISTERED USER
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email or password combination is invalid');
    
    //PASSWORD IS CORRECT
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return  res.status(400).send('Email or password combination is invalid');

    const token = jwt.sign({_id: user._id, name: user.name, email: user.email,}, process.env.TOKEN);
    res.header('auth-token', token).send(token);

});

module.exports = router;