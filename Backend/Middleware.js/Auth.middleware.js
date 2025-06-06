import jwt from "jsonwebtoken";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.headers['authorization']?.split(" ")[1];
    
    if(token === undefined){
      
        return res.json(new ApiError(205,"Access Error"));
    }
    try{
      const decode = jwt.verify(token,process.env.TOKEN);
      req.body._id = decode._id;
      req.body.Username = decode.Username;
      return next();
    }
    catch(error){ 
        return res.json( new ApiError(205,"Invaild Token","Access Error"));
    }
});
