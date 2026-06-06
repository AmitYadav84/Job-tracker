const { required } = require('joi');
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    company : {
        type : String,
        required : [true, 'Please provide company name'],
        trim : true
    },
    position : {
        type : String,
        required : [true, 'Please provide position'],
        trim : true
    },
    status : {
        type : String,
        enum : ['pending', 'interview', 'offer', 'rejected'],
        default : 'pending'
    },
    jobType : {
        type : String,
        enum : ['full-time', 'part-time', 'remote', 'internship'],
        default : 'full-time'
    },
    jobLocation : {
        type : String,
        default : 'Remote',
        trim : true,
    },
    applicationLink : {
        type : String,
        trim : true,
    },
    notes : {
        type : String,
        maxlength : 1000
    },
    appliedDate : {
        type : Date,
        default : Date.now
    }
},{
    timestamps : true
});

jobSchema.index({user : 1, company : 1});
jobSchema.index({status : 1});

module.exports = mongoose.model('Job',jobSchema);