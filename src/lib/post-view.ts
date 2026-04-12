const VIEWED_POST_KEY_PREFIX = "viewed_post_"

function getViewedPostKey(postId: string) {
    return `${VIEWED_POST_KEY_PREFIX}${postId}`
}

export function hasViewedPostInSession(postId: string) {
    if (typeof window === "undefined") {
        return false
    }

    return window.sessionStorage.getItem(getViewedPostKey(postId)) === "true"
}

export function markPostAsViewedInSession(postId: string) {
    if (typeof window === "undefined") {
        return
    }

    window.sessionStorage.setItem(getViewedPostKey(postId), "true")
}
