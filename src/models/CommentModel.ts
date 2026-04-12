import { model, models, Schema, type InferSchemaType, type Types } from "mongoose"

const CommentSchema = new Schema(
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
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
)

type Comment = Omit<InferSchemaType<typeof CommentSchema>, "post" | "user"> & {
    post: Types.ObjectId
    user: Types.ObjectId
}

export const CommentModel = models.Comment || model<Comment>("Comment", CommentSchema)
