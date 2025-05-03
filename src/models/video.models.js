import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema=new Schema({
vedioFile:{
    type:String,
    required:true,

},
thiumbnail:{
    type:String,
    required:true,

},
title:{
    type:String,
    required:true,

},
duration:{
    type:Number,
    required:true,

},
views:{
    type:Number,
    default:0,

},
isPublished:{
    type:Boolean,
    default:true,

},
owner:{
    type:Schema.Types.ObjectID,
    ref:"User"
   

},


},{timeStamps:true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoSchema)