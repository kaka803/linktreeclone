import mongoose from "mongoose";
export const connectDb = () => {
    try {
        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        )
    } catch (e) {
        console.log('mongodb connection failed', e)
    }
}