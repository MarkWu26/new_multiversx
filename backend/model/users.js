import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    discord_id: {
        type: String,
        required: true,
        min: 5,
    },
    multiversx_address: {
        type:String,
        required:true,
        min: 3
    },
   
})

const User = mongoose.model("users", userSchema);
export default User;