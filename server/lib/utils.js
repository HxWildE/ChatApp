import jwt from "jsonwebtoken"

export const generateToken = (userId) =>{
    const token = jwt.sign({UserID} , processs.env.JWT_SECRET);
}

