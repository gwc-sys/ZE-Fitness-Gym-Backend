import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    //user register 
    // get details from Frontend 
    // validation -  not empty 
    // check if user already exists : username , email 
    //  create user object -- upload data on 

    const { fullname, email, username, password } = req.body
    if (
        [fullname, email, username, password].some((field) =>
            field?.trim() === ""),
        console.log(fullname)
    ) {
        throw new ApiError(400, " all filed are required")}

    const{phonenumber} = req.body
    if(phonenumber === ""){
        throw new ApiError(400, "phone number is required")
    }    
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, " User with email or username already exists")
    }

    
    const user = await User.create({
        fullname,
        email,
        password,
        phonenumber,
        username: username
    })
    
    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wring while registering the user ")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, " User register Successfully")
    )
})

export { registerUser }