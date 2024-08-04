import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

const userSchema = new Schema({
    fullname: {
        type: String,
        require: true,
        lowecase: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        require: true,
        lowecase: true,
        unique: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowecase: true,
        trim: true,
        index: true
    },
    phoneNumber: {
        type: Number,
        require: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        require: [true, 'Password is required']
    }
}, { timestamps: true })

// This Method is used to encrypt data  ||| using pre method 
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next()
})

// this is method is used to check user password is equl to crpted password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// this method is used to create Access token

userSchema.method.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            usernaem: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_SECRET
        }
    )
}

userSchema.method.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        }
        ,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_SECRET
        }
    )
}

export const User = mongoose.model("User", userSchema);