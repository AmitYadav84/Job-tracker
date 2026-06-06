const Job = require('../models/Job');

exports.getJobs = async (req,res) => {
    try {
        const {status, jobType, sort, search} = req.query;

        const queryObject = {
            user : req.user._id
        }

        if(status && status !== 'all') {
            queryObject.status = status;
        }
        
        if(jobType && jobType !== 'all') {
            queryObject.jobType = jobType;
        }
        
        if(search) {
            queryObject.$or = [
                {company : {$regex : search, $options : 'i'}},
                {position : {$regex : search, $options : 'i'}}
            ];
        }

        let sortOption = '-createdAt';
        if(sort === 'oldest') {
            sortOption = 'createdAt';
        }
        if(sort === 'a-z') {
            sortOption = 'company';
        }
        if(sort === 'z-a') {
            sortOption = '-company';
        }

        const jobs = await Job.find(queryObject).sort(sortOption);
        res.json({
            success : true,
            count : jobs.length,
            data : jobs
        });
    } catch (error) {
       res.status(500).json({
        success: false,
        message: error.message
       }); 
    }
}

exports.getJob = async (req,res) => {
   try {
    const job = await Job.findById(req.params.id);

    if(!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        });
     }
    
     if(job.user.toString() !== req.user._id.toString()){
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this job'
        });  
     }

    res.json({
      success: true,
      data: job
    });
   } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
       });
   } 
} 

exports.createJob = async (req,res) => {
   try {
      req.body.user = req.user._id;
      
      const job = await Job.create(req.body);

      res.status(201).json({
      success: true,
      data: job
      });
   } catch (error) {
    res.status(400).json({
        success: false,
        message: error.message
       });
   } 
}

exports.updateJob = async (req,res) => {
    try {
     let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id , req.body , {
        new : true,
        runValidators : true
    });

    res.json({
      success: true,
      data: job
    });
   } catch (error) {
    res.status(400).json({
        success: false,
        message: error.message
       });
   } 
}

exports.deleteJob = async (req,res) => {
    try {
       const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Make sure user owns job
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

     res.json({
      success: true,
      message: 'Job deleted successfully'
    });
   } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
       });
   } 
}

exports.getStats = async (req,res) => {
    try {
    const stats = await Job.aggregate([
        {$match : {user : req.user._id}},
        {$group : {_id : '$status', count : {$sum : 1}}}
    ])
   const statsObject = stats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
    }, {});

    const defaultStats = {
        pending : statsObject.pending || 0,
        interview : statsObject.interview || 0,
        offer : statsObject.offer || 0,
        rejected : statsObject.rejected || 0
    }
    res.json({
      success: true,
      data: defaultStats
    });
   } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
       });
   } 
}