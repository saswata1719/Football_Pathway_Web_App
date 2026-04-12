import { model, models, Schema, type InferSchemaType, type Types } from "mongoose"

const ProfileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            default: null,
        },
        age: {
            type: Number,
            min: 0,
            default: null,
        },
        position: {
            type: String,
            enum: ["striker", "midfielder", "defender", "goalkeeper", "winger"],
            default: null,
        },
        strongFoot: {
            type: String,
            enum: ["left", "right", "both"],
            default: null,
        },
        location: {
            type: String,
            trim: true,
            default: null,
        },
        club: {
            type: String,
            trim: true,
            default: null,
        },
        bio: {
            type: String,
            trim: true,
            default: "",
        },
        topSkill: {
            type: String,
            trim: true,
            default: null,
        },
        profileType: {
            type: String,
            default: "Player Profile",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        stats: {
            totalVideos: {
                type: Number,
                default: 0,
            },
            highlights: {
                type: Number,
                default: 0,
            },
            matchClips: {
                type: Number,
                default: 0,
            },
        },
    },
    {
        timestamps: true,
    }
)

type Profile = Omit<InferSchemaType<typeof ProfileSchema>, "user"> & {
    user: Types.ObjectId
}

export const ProfileModel =
    models.Profile || model<Profile>("Profile", ProfileSchema)
