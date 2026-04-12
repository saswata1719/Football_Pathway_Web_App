import SharedVideoView from "@/components/SharedVideoView"

export default async function SharedVideoPage({
    params,
}: PageProps<"/video/[id]">) {
    const { id } = await params

    return <SharedVideoView postId={id} />
}
