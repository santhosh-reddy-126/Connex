import mongoose,{Schema} from "mongoose";

const Chat = new Schema({
    username:{
        type: Array,
        required: true
    },
    Chathistory:{
        type: Array,
        required: true
    },iden:{
        type:String,
        unique: true,
        required: true
    },time:{
        type: String,
        required: true
    },date:{
        type: Date,
        required: true
    }
})

Chat.index({ iden: 1 }, { unique: true });


const chat = mongoose.model('Chat', Chat);
export default chat;