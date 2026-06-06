const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const cookieParser = require('cookie-parser');


dotenv.config();
connectDB();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.get("/health",(req,res) =>{
    res.send("Server is healthy");
});

app.use('/api/jobs', jobRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});
