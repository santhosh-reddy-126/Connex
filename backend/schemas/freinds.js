import mongoose,{Schema} from "mongoose";

const frndSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    friends:{
        type: Array,
        required: true
    }
})

const frnd = mongoose.model('Friend', frndSchema);
export default frnd;