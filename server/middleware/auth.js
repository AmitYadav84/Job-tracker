const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req,res,next) => {
    try {
        const token = req.cookies.token;
        
        if(!token){
            return res.status(401).json({
                success : false,
                message : 'Not authorized, no token'
            });
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        if(!req.user){
            return res.status(401).json({
                success : false,
                message : 'User not found'
            });
        }
        next();
    } catch (error) {
        res.status(401).json({
            success : false,
            message : error.message
        });
    }
};