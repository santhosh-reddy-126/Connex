import mongoose,{Schema} from "mongoose";

const postSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    imgUrl:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    likes:{
        type: Array,
        required: true
    },
    comments:{
        type:Array,
        required:true
    },
    commentedBy:{
        type:Array,
        required:true
    },
    date:{
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    }
})

const Post = mongoose.model('Post', postSchema);
export default Post;