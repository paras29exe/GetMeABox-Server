import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true
    },
    avatar: {
        type: String,
    },
    subscription: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscriptions'
    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transactions'
    }]
}, {timestamps: true});


userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function (userPassword){
    return await bcrypt.compare(userPassword, this.password);
}

userSchema.methods.generateToken = function (){
    return jwt.sign({
        _id: this._id,
        email: this.email
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

const User = mongoose.model('users', userSchema);

export default User;