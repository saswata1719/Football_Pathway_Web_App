import { model, models, Schema, type InferSchemaType, type Types } from "mongoose"

const PostLikeSchema = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

PostLikeSchema.index({ post: 1, user: 1 }, { unique: true })

type PostLike = Omit<InferSchemaType<typeof PostLikeSchema>, "post" | "user"> & {
    post: Types.ObjectId
    user: Types.ObjectId
}

export const PostLikeModel = models.PostLike || model<PostLike>("PostLike", PostLikeSchema)
