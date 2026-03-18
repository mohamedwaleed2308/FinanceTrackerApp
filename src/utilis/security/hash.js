import { compareSync, hashSync } from "bcrypt"

export const hashing=({plainText='',salt=parseInt(process.env.SALT) || 10}={})=>{
    const hash= hashSync(plainText,salt);
    return hash
}
export const comparing=({plainText='',hashValue=''}={})=>{
    const compare= compareSync(plainText,hashValue);
    return compare
}