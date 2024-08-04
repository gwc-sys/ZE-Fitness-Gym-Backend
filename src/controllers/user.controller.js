import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req, res) => {
    //user register 
    // get details from Frontend 
    // validation -  not empty 
    // check if user already exists : username , email 
    //  create user object -- upload data on db
    // remove password and refresh token field from response 
    // check for user creation 
    // return response 

    const { fullname, username, email, phoneNumber, password } = req.body
    if (
        [fullname, username, email, phoneNumber, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, " all filed are required ")
    }


    const existsUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existsUser) {
        throw new ApiError(400, "username or email already exists ")
    }

    const user = await User.create({
        fullname, username, email, phoneNumber, password
    })

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (createUser) {
        throw new ApiError(500, " Something went wring while registering the user ")
    }

    return res.status(201).json(
        ApiResponse.success("User created successfully", createUser)
    )

})

export { registerUser }