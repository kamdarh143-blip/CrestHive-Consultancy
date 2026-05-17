const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    bhk: { type: String, required: true },
    sqft: { type: String, required: true },
    status: { type: String, required: true },
    type: { type: String, required: true } // 'buy', 'rent', or 'project'
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    date: { type: String },
    visitType: { type: String },
    project: { type: String },
    userId: { type: String }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    phone: { type: String },
    address: { type: String }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
const Lead = mongoose.model('Lead', leadSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Project, Lead, User };
