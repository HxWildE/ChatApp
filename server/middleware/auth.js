


export const protectRoute = async (req ,res , next) =>{

    try{
        const token = req.headers.token;

        const decode = JsonWebTokenError.verify(token , process.env.JWT_SECRET)
        const user = await User.findById()
    }catch (error){
let x = 4;
    }
}
