import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcryptjs from "bcryptjs"

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

userSchema.pre("save", async function(next){
    const user = this
    
    if(!user.isModified('password')) return next()

    try {
       const salt = await bcryptjs.genSalt(10)
       const hashPassword = await bcryptjs.hash(user.password, salt)
       user.password = hashPassword;
       next()
    } catch (error) {
        console.log(error)
        throw new Error('Fallo el hash de contraseña')
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcryptjs.compare(candidatePassword, this.password);
}

export const User = mongoose.model('User', userSchema);
