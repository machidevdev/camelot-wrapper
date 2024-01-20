import mongoose from 'mongoose';
import { config } from './config';

let conn: Promise<typeof mongoose> | null = null;


export const connect = async () => {
    if (conn == null) {
        conn = mongoose.connect(config.mongoDbUri, {
            serverSelectionTimeoutMS: 5000
        }).then(() => mongoose);

        // `await`ing connection after assigning to the `conn` variable
        // to avoid multiple function calls creating new connections
        await conn;
    }

    return conn;
};

export const disconnect = async () => {
    if (conn != null) {
        (await conn).connection.close();
        conn = null;        
    }   
}
