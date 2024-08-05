import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
    },
    email:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
    fullname:{
            type:String,
            require:true,
            lowercase:true,
            trim:true,
            index:true
        },
    password:{
        type:String,
        require:[true , 'Password is required']
    },
    phonenumber:{
            type:Number,
            require:true,
            lowercase:true,
            trim:true,
            index:true
    },
    refreshToken : {
        type : String
    }    

},{timestamps: true});

// This pre method is used to encrypt data 
userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

// this method is is used check user password is equl to crpted password 
userSchema.methods.isPasswordCorrect = async function 
(password){
   return await bcrypt.compare(password , this.password)  
} 

// THIS METHOD IS USED TO CREATE ACCESS TOKEN 
userSchema.methods.generateAccessToken = function(){
   return  jwt.sign(
        {
            _id : this._id ,
            email : this.email,
            username :this.username,
            fullname:this.fullname, 
            phonenumber:this.phonenumber
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
// THIS METHOD IS USED TO CREATE REFRESH TOKEN 
userSchema.methods.generateRefreshToken = function(){
    return  jwt.sign(
        {
            _id : this._id ,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User =mongoose.model("User",userSchema)
