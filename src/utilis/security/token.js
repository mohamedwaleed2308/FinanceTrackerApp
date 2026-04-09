import jwt from 'jsonwebtoken'

export const generateToken=({payload={},signature='',expiresIn})=>{
    const token = jwt.sign(payload,signature,{expiresIn:parseInt(expiresIn)})
    return token
}
export const verifyToken=({token='',signature=''})=>{
    const verifiedToken = jwt.verify(token,signature)
    return verifiedToken 
}