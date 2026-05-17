require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { Project, Lead, User } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Database Connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected to: ' + process.env.MONGO_URI))
  .catch(err => console.error('MongoDB Connection Error:', err));

// =======================
// PROJECT ROUTES
// =======================

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new project
app.post('/api/projects', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a project
app.put('/api/projects/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =======================
// LEAD ROUTES
// =======================

// Get all leads (Admin only, ideally)
app.get('/api/leads', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get leads for a specific user by email
app.get('/api/leads/user/:email', async (req, res) => {
    try {
        if(!req.params.email) return res.status(400).json({ error: "Email required" });
        const userLeads = await Lead.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.json(userLeads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit a new lead
app.post('/api/leads', async (req, res) => {
    try {
        const newLead = new Lead(req.body);
        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// =======================
// USER ROUTES
// =======================

// Get user profile by email
app.get('/api/users/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        res.json(user || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create or update user profile
app.put('/api/users/:email', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: req.params.email },
            req.body,
            { new: true, upsert: true }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add a downloaded project to user profile
app.post('/api/users/:email/downloads', async (req, res) => {
    try {
        const { projectId, projectName } = req.body;
        if (!projectName) return res.status(400).json({ error: "Project name required" });
        
        const user = await User.findOne({ email: req.params.email });
        if (user) {
            // We can store downloads in user schema, but we don't have it defined in models.js
            // To be safe without changing schema again, we will save this as a lead!
        }
        
        // Let's also save it as a lead so the admin sees it
        const newLead = new Lead({
            name: req.body.name || "Unknown",
            phone: req.body.phone || "Unknown",
            email: req.params.email,
            visitType: 'Brochure Download',
            project: projectName
        });
        await newLead.save();
        
        res.status(201).json({ message: "Download tracked" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Fallback for Single Page Applications (SPA)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
