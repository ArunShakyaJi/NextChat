import mongoose from 'mongoose'
import { number } from 'zod'

type ConnectionObject = {

    isConnected?: number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if (connection.isConnected) {
        console.log('Already connected');
        return
        
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '' , {})
        console.log(db)

        connection.isConnected =  db.connections[0].readyState

        console.log('DB connected Successfully');
        
    } catch (error) {
        console.log('Database connection failed')
        process.exit(1)
    }
}

export default dbConnect ;