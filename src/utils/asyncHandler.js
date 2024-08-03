const asyncHandler = (requestHandler) => {
    (req , res , next ) => {
        Promise.resolve(requestHandler(req,res,next)).
        catch((err) => next(err))
        //catch (() => ())
    }
}

export {asyncHandler}















// this is wrapper function
// const  asyncHandler = (fn) => async (req , res , next ) => {
    //     try {
    //         await fn(res, req , next)
    //     } catch (error) {
    //         res.status(err.code ||500).json({
    //             success:false,
    //             message: err.message
    //         })
    //     }
    // }