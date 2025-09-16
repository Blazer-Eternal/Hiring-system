import { InputUserInterface, UserInterface } from "../interfaces/userInterface";
import Models from "../models";
import { Model } from "sequelize";


export class UserServices {
    public async findone(email:string):Promise<UserInterface | null>{
        const data =await Models.Users.findOne({
            where:{
                email:email,
            }
        });
        return data;
    }

    public async create(data: InputUserInterface): Promise<UserInterface> {
        const user = await Models.Users.create(data);
        return user;
      }
    

}
 


