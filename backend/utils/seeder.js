// utils/seeder.js

const dotenv = require('dotenv'); // <-- MOVED TO THE TOP
dotenv.config(); // <-- MOVED TO THE TOP

const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Load modelss
const Role = require('../models/roleModel');
const User = require('../models/userModel');
const Subject = require('../models/subjectModel');
const Grade = require('../models/gradeModel');
const Mark = require('../models/markModel');

// ADDING THIS LINE FOR DEBUGGING
// It will show us exactly what the script is trying to use.
console.log('Attempting to connect with URI:', process.env.MONGO_URI);

// Connect to database
connectDB();

const importData = async () => {
    try {
        await Role.deleteMany();
        await User.deleteMany();
        await Subject.deleteMany();
        await Grade.deleteMany();
        await Mark.deleteMany();

        const createdRoles = await Role.insertMany([
            { name: 'Admin' },
            { name: 'Teacher' },
            { name: 'Student' }
        ]);

        const adminRole = createdRoles.find(role => role.name === 'Admin')._id;

        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'Lidiyaaberha',
            role: adminRole
        });

        await adminUser.save();

        console.log('Data Imported!');
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();