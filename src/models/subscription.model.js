import mongoose, {Schema} from "mongoose";
import { User } from "./user.model";

const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId, //the one who is subscribing
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId, //the channel is basically the user only with the email who the user has subsribed
        ref:"User"
    }
},{timestamps: true})


export const Subscription = mongoose.model("Subscription", subscriptionSchema)