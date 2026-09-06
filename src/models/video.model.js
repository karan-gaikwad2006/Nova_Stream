import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const { Schema } = mongoose;

const videoSchema = new Schema({
    videoFile:{
        type: String, //cloudinary ka url use karenge
        required: true,
    },
    thumbnail:{
        type: String, //cloudinary ka url use karenge
        required: true,
    },
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    duration:{
        type:Number, // we will get this from cloudinary response
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    IsPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},
    {
        timestamps: true
    }
);


videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model('Video', videoSchema);