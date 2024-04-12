import mongoose  from "mongoose";

type ConnectionObject = {
     isConnected?: number 
}

const connection : ConnectionObject ={}

async function dbConnect() :Promise<void>{
    // check if we have connection to our databse
    if(connection.isConnected){
        return
    }
    try {
        const db  = await mongoose.connect(process.env.MONGODB_URI || "",{ })
        connection.isConnected= db.connections[0].readyState

        console.log("DB connected successfully.")
    } catch (error) {
        console.log("Db connection failed.",error);
        process.exit(1);
        
    }
    
}

export default dbConnect;