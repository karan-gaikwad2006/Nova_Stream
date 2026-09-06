// const asyncHandler =(fn) =>async(req , res, next) =>{ // this is basicaaly a wrapper function jo hum bahot jageh istmal kr skte hai jaha hume async function ka use krna hai aur error handling krna hai. Ye function ek async function ko accept krta hai aur ek naya async function return krta hai jo ki req, res aur next ko accept krta hai. Ye naya function try catch block me fn ko call krta hai aur agar koi error aata hai to usko catch block me handle krta hai aur res me error message bhejta hai.
//     try{
//         await fn(req, res, next);
//     }catch(err){
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message || "Internal Server Error"
//         })
//     }

// }

const asyncHandler = (requestHandler)=>{
    (req, res, next)=>{
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err));
    }
}
                       
export {asyncHandler};