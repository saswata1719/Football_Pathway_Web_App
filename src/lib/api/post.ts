import axios from "axios"

export type CreatePostPayload = {
    position: "striker" | "midfielder" | "defender" | "goalkeeper" | "winger"
    age: number
    location: string
    strongFoot: "left" | "right" | "both"
    matchType: "match" | "practice" | "trial"
    caption: string
    tags: string[]
    videoUrl: string
    thumbnailUrl: string
}

export type PostCommentItem = {
    id: string
    name: string
    image?: string | null
    text: string
    time: string
}

export async function createPost(payload: CreatePostPayload) {
    const res = await axios.post("/api/post", payload)

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create post")
    }

    return res.data.post
}

export async function getPosts() {
    const res = await axios.get("/api/post")

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch posts")
    }

    return res.data.posts
}

export async function getPostById(postId: string) {
    const res = await axios.get(`/api/post/${postId}`)

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch post")
    }

    return res.data.post
}

export async function getPostComments(postId: string) {
    const res = await axios.get(`/api/post/${postId}/comments`)

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch comments")
    }

    return res.data.comments as PostCommentItem[]
}

export async function addPostComment(postId: string, text: string) {
    const res = await axios.post(`/api/post/${postId}/comments`, { text })

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to add comment")
    }

    return res.data.comment as PostCommentItem
}

export async function togglePostLike(postId: string) {
    const res = await axios.post(`/api/post/${postId}/like`)

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update like")
    }

    return {
        liked: res.data.liked as boolean,
        likes: res.data.likes as number,
    }
}

export async function sharePost(postId: string) {
    const res = await axios.post(`/api/post/${postId}/share`)

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to share post")
    }

    return {
        shareUrl: res.data.shareUrl as string,
        shares: res.data.shares as number,
        targets: res.data.targets as {
            whatsapp: string
            telegram: string
            facebook: string
        },
    }
}

export async function deletePost(postId: string) {
    const res = await axios.delete(`/api/post/${postId}`)

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to delete post")
    }

    return res.data
}

export async function trackPostView(postId: string) {
    const res = await axios.post(`/api/post/${postId}/view`)

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update view")
    }

    return {
        views: res.data.views as number,
    }
}
