const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: '7d'});
}

exports.registerUser = async (req,res) =>{

    try {
       const {name,email,password} = req.body;
       
       if(!name ||!email ||!password){
        return res.status(400).json({
            success: false,message: 'Please fill all the fields'});
       };

       const userExists = await User.findOne({email});

       if(userExists){
        return res.status(400).json({
            success: false,message: 'User already exists'});
       }
       const user = await User.create({name,email,password});

       const token = generateToken(user._id);

       res.cookie('token',token,{
        httpOnly: true,
        secure : process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
       });

       res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
       });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.loginUser = async (req,res) => {
    try {
        const {email,password} = req.body; 
        
        if(!email ||!password){
            return res.status(400).json({
                success: false,message: 'Please fill all the fields'});
           };
        
           const user = await User.findOne({email}).select('+password');

           const isMatch = await user.comparePassword(password);
           
           if(!isMatch){
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
           }
           const token = generateToken(user._id);

              res.cookie('token',token,{
                httpOnly: true,
                secure : process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
               });

              res.status(200).json({    
                success: true,
                message: 'User logged in successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.getMe = async (req,res) => {
    res.json({
        success: true,
        data : req.user
    });
};

exports.logoutUser = async (req,res) => {
   res.cookie('token','',{
    httpOnly: true,
    expires: new Date(0)
   });
   res.json({
    success: true,
    message: 'User logged out successfully'
   });
};