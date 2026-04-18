import { MongoClient } from "mongodb"
import { appEnv, env } from "@/lib/env"

const uri = env.MONGODB_URI

let globalMongoClient: MongoClient | undefined

const client = globalMongoClient ?? new MongoClient(uri)
const clientPromise = client.connect()

if (!appEnv.isProduction) {
    globalMongoClient = client
}

export { client, clientPromise }
