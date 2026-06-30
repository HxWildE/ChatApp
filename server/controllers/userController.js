import User from "../models/User"
import bcrypt from "bcryptjs"

export const signup = async (req,res) =>{

    const {fullName ,email ,password ,bio} = req.body
}

//validation -- all fields have been filled
try{
        if(!fullName || !email || !password || !bio){
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.json({
                success:false , 
                message : "Account Already exists "
            })
        }

        //using bcrypt to get new password
        //hashes passwords are stored inside db

        const salt = await bcrypt.genSalt()     
        //salt arg = k = 10 ^k calacualtions
        //10^10 cacuations to encrypt
        const hashedPassword = await bcrypt.hash(password, salt);
        ///store this in db

        const newUser = User.create({
            fullName ,email , password : hashedPassword, bio
        })

}catch(error){

}