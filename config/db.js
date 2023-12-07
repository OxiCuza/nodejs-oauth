import mongoose from "mongoose";

export const initializeDB = (mongoString) => {
    return mongoose.connect(mongoString)
}