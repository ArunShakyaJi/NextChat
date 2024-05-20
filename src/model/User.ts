import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createAt: Date;
}

const MessageSchema: Schema<Message> = new Schema ({
    content : {
        type : String ,
        required : true 
    },
    createAt : {
        type : Date ,
        required : true ,
        default : Date.now
    }
})

export interface User extends Document { 
    username : string,
    password : string,
    email : string,
    messages : Message[] ,
    isAcceptingMessages : boolean,
    verifyCode : string,
    isVerified : boolean,
    verifyCodeExpire : Date ;

}

const UserSchema : Schema<User> = new Schema ({
    username : {
        type : String ,
        required : [true , 'Username is required'] ,
        trim : true ,
        unique : true
    },
    password : {
        type : String ,
        required : [true , 'Password is required']
    },
    email : {
        type : String ,
        required : [true , 'Email is required'] ,
        unique : true,
        match : [/.+\@.+\..+/ , 'Please fill a valid email address']
    },
    verifyCode : {
        type : String ,
        required : [true , 'Verify code is required']
    },
    verifyCodeExpire : {
        type : Date ,
        required : [true , 'Verify code expire is required']
    },  
    isVerified : {
        type : Boolean ,
        default : false
    },
    isAcceptingMessages : {
        type : Boolean ,
        default : true
    },
    messages : [MessageSchema]  
    
})

 const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User' , UserSchema)

 export default UserModel ;