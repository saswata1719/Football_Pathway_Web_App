import { model, models, Schema, type InferSchemaType, type Types } from "mongoose"

const PostSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        position: {
            type: String,
            enum: ["striker", "midfielder", "defender", "goalkeeper", "winger"],
            required: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        strongFoot: {
            type: String,
            enum: ["left", "right", "both"],
            required: true,
        },
        matchType: {
            type: String,
            enum: ["match", "practice", "trial"],
            required: true,
        },
        caption: {
            type: String,
            required: true,
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        videoUrl: {
            type: String,
            required: true,
            trim: true,
        },
        thumbnailUrl: {
            type: String,
            required: true,
            trim: true,
        },
        stats: {
            views: {
                type: Number,
                default: 0,
            },
            likes: {
                type: Number,
                default: 0,
            },
            comments: {
                type: Number,
                default: 0,
            },
            shares: {
                type: Number,
                default: 0,
            },
        },
    },
    {
        timestamps: true,
    }
)

type Post = Omit<InferSchemaType<typeof PostSchema>, "user"> & {
    user: Types.ObjectId
}

export const PostModel = models.Post || model<Post>("Post", PostSchema)
