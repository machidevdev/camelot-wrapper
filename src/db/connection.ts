import { MongoClientOptions } from 'mongodb';
import mongoose, { MongooseOptions } from 'mongoose';

// Define a variable to hold the connection
let connection: mongoose.Connection | null = null;



export const connectToDatabase = async (): Promise<void> => {
    try {
        // Check if we have a connection to the database or if it's still active
        if (connection && mongoose.connection.readyState === 1) {
            console.log("Reusing existing database connection.");
            return;
        } else {
            // Establish a new connection
            console.log("Connecting to the database...");
            const db = await mongoose.connect(process.env.MONGODB_URI!, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as MongooseOptions);
            connection = db.connection;
            console.log("Database connected successfully.");
        }
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw error; // Re-throw the error for higher-level error handling (if needed)
    }
};
