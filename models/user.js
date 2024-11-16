const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the person schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    mobile: {
        type: String,
        required: true
    },
    adharCardNumber: {
        required:true,
        unique:true,
        type: Number
    },
    password:{
        required:true,
        type: String
    },
    role:{
        type:String,
        enum:['voter', 'admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false,

    }
    
});
userSchema.pre('save', async function (next) {
    const person = this;

    // Only hash if the password is new or modified
    if (!person.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(person.password, salt);
        person.password = hashedPassword; // Store hashed password
        next();
    } catch (error) {
        return next(error);
    }
});

// Method to compare provided password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password); // Compare with stored hashed password
        return isMatch;
    } catch (err) {
        throw err;
    }
};
const user = mongoose.model('Person', userSchema);
module.exports = user;