const express = require('express');

const {getJobs, getJob, createJob, updateJob, deleteJob,getStats} = require('../controller/jobController');
const {protect} = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/stats').get(getStats);
router.route('/').get(getJobs).post(createJob);
router.route('/:id').get(getJob).put(updateJob).delete(deleteJob);

module.exports = router;