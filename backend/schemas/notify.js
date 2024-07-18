import mongoose,{Schema} from "mongoose";

const notify = new Schema({
    message:{
        type: String
    },
    seen:{
        type: Boolean,
        required: true
    },
    messageType:{
        type: Boolean,
        required: true      
    },
    towhom:{
        type:String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },fromwhom:{
        type: String
    }
})

const Notify = mongoose.model('Notify', notify);
export default Notify;