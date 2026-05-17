require('dotenv').config();
const mongoose = require('mongoose');
const { Project } = require('./models');

const properties = [
    {
        title: "Dosti 604",
        price: "₹ 1.46 Cr - 2.40 Cr",
        location: "Wagle Estate, Thane",
        image: "assets/property_apartment_1778980947196.png",
        bhk: "2, 3",
        sqft: "Premium",
        status: "New Launch",
        type: "buy"
    },
    {
        title: "Raymond The Address By GS",
        price: "₹ 3.14 Cr - 11.06 Cr",
        location: "Sion, Mumbai",
        image: "assets/property_apartment_1778980947196.png",
        bhk: "3, 4, 5",
        sqft: "Luxury",
        status: "Under Construction",
        type: "project"
    },
    {
        title: "Raymond The Address By GS",
        price: "₹ 2.36 Cr - 4.48 Cr",
        location: "Wadala East, Mumbai",
        image: "assets/property_apartment_1778980947196.png",
        bhk: "2, 3",
        sqft: "1,200 sqft",
        status: "New Launch",
        type: "project"
    },
    {
        title: "Birla Taranya",
        price: "₹ 1.10 Cr - 2.59 Cr",
        location: "Kalwa, Thane",
        image: "assets/property_villa_1778980930980.png",
        bhk: "1, 2, 3",
        sqft: "Modern",
        status: "New Launch",
        type: "buy"
    },
    {
        title: "Purva Estrella",
        price: "₹ 2.5 Lacs/mo",
        location: "Andheri West, Mumbai",
        image: "assets/property_apartment_1778980947196.png",
        bhk: "3, 4",
        sqft: "1,800 sqft",
        status: "For Rent",
        type: "rent"
    },
    {
        title: "Sattva Sumera",
        price: "₹ 3.59 Cr - 7.10 Cr",
        location: "Parel, Mumbai",
        image: "assets/property_apartment_1778980947196.png",
        bhk: "3, 4",
        sqft: "1,600 sqft",
        status: "Under Construction",
        type: "project"
    },
    {
        title: "Shapoorji Pallonji Nine Arcs",
        price: "₹ 85,000/mo",
        location: "Santacruz East, Mumbai",
        image: "assets/property_villa_1778980930980.png",
        bhk: "2, 3",
        sqft: "1,100 sqft",
        status: "For Rent",
        type: "rent"
    },
    {
        title: "Godrej Varanya",
        price: "₹ 2.46 Cr - 4.66 Cr",
        location: "Kharghar, Navi Mumbai",
        image: "assets/property_apartment_1778980947196.png",
        bhk: "3, 4",
        sqft: "Spacious",
        status: "Under Construction",
        type: "project"
    },
    {
        title: "Adani Codename LIT",
        price: "₹ 2.43 Cr - 5.06 Cr",
        location: "Teen Hath Naka, Thane",
        image: "assets/property_apartment_1778980947196.png",
        bhk: "2, 3, 4",
        sqft: "Premium",
        status: "Ready to Move",
        type: "buy"
    },
    {
        title: "Rustomjee La Familia",
        price: "₹ 1.55 Cr - 2.95 Cr",
        location: "Majiwada, Thane",
        image: "assets/property_villa_1778980930980.png",
        bhk: "2, 3",
        sqft: "Family Sized",
        status: "Ready to Move",
        type: "buy"
    }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Connected to DB...');
    await Project.deleteMany({}); // clear existing
    await Project.insertMany(properties);
    console.log('Data seeded successfully!');
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
