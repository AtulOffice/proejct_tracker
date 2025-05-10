import mongoose from 'mongoose';


export const ConnDB = async ({str}) => {
    try {
        await mongoose.connect(str);
        console.log('MongoDB Connected...');
    } catch (e) {
        console.log(e)
    }
}
