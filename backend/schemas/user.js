import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    posts:{
        type: Number,
        default: 0
    },
    Connects:{
        type: Number,
        default: 0
    },
    profilePhoto:{
        type:String,
        default: "https://img.icons8.com/?size=100&id=98957&format=png&color=FFFFFF"
    }
})

const User = mongoose.model('User', userSchema);
export default User;