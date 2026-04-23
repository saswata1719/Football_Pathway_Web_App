import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables.")
}

let globalMongoClient: MongoClient | undefined

const client = globalMongoClient ?? new MongoClient(uri)
const clientPromise = client.connect()

if (process.env.NODE_ENV !== "production") {
    globalMongoClient = client
}

export { client, clientPromise }
