const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        max: 32
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: 'Passwords are not the same'
        }
    },
    roles: {
        type: String,
        default: 'user',
    },
    image: {
        type: String,
        default: 'user.jpg'
    }
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});

userSchema.methods.correctPassword = async function(clientPassword, serverPassword) {
    return await bcrypt.compare(clientPassword, serverPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;