import { model, models, Schema, type InferSchemaType } from "mongoose"

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            default: null,
        },
        image: {
            type: String,
            default: null,
        },
        provider: {
            type: String,
            enum: ["credentials", "google"],
            default: "credentials",
        },
    },
    {
        timestamps: true,
    }
)

type User = InferSchemaType<typeof UserSchema>

export const USerModel = models.User || model<User>("User", UserSchema)
