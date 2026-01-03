import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 force dotenv to read from project root
dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

const MONGODB_URI = process.env.MONGODB_URI;

console.log("MONGO URI =", MONGODB_URI);

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI not defined");
}

let cached = global.mongoose || { conn: null, promise: null };

export default async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI);
    }

    cached.conn = await cached.promise;
    global.mongoose = cached;

    return cached.conn;
}
