import mongoose from 'mongoose';
import colors from 'colors'

export const connectDB = async () =>{
    try {
        const url = process.env.MONGO_URI;
        const {connection} = await mongoose.connect(`${url}`);
        const url2 = colors.cyan.bold(`${connection.host}:${connection.port}`);
        console.log(`running on ${url2}`);
    } catch (error) {
        console.error(colors.bgRed.white.bold(error.message));
    }
}