
import mongoose from 'mongoose'

// Direct connection to MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://dassatyam300:fYg74wKbtERMBcXd@cluster0.jjlawdr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Frontend connected to MongoDB Atlas');
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
