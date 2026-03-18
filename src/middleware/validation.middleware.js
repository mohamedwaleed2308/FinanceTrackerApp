
export const validation=(schema)=>{
    return(req , res ,next)=>{
        const {error,value}= schema.validate({body:req.body,params:req.params,query:req.query},{
            abortEarly:false,
            stripUnknown: true,// to remove any additional field or fields not required
        });
        if (error) {
            return res.status(400).json({message:'validation Error',details:error.details})
        }
        req.validatedData=value // this is correct
        // req.body=value.body
        // req.params=value.params
        // req.query = value.query this getter only so you can not make req.query = value.query
        return next();
    }
    
}