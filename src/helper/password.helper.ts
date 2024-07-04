import {hashSync, compareSync} from "bcrypt"

export class PasswordHelper {
    static async hashPassword(password: string){
        return hashSync(password, 10)
    }

    static async comparePassword(hashPass: string, password: string){
        return compareSync(password, hashPass);
    }
}