import Wrapper from "@/app/Wrapper"
import PublicProfileView from "@/components/PublicProfileView"

type PlayerProfilePageProps = {
    params: Promise<{
        userId: string
    }>
}

export default async function PlayerProfilePage({ params }: PlayerProfilePageProps) {
    const { userId } = await params

    return (
        <Wrapper>
            <PublicProfileView userId={userId} />
        </Wrapper>
    )
}
