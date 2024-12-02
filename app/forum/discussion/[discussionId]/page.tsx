import ClientPage from './ClientPage'

export async function generateMetadata({ params }: { params: { discussionId: string } }) {
  try {
    const response = await fetch(`https://thelinuxcommunityhub.org/api/discussions/${params.discussionId}`)
    const discussion = await response.json()
    return {
      title: discussion.title,
      description: discussion.content.substring(0, 160)
    }
  } catch (error) {
    return {
      title: 'Discussion',
      description: 'View discussion details'
    }
  }
}

export default async function DiscussionPage({ params }: { params: { discussionId: string } }) {
  try {
    const response = await fetch(`https://thelinuxcommunityhub.org/api/discussions/${params.discussionId}`)
    const discussion = await response.json()
    return <ClientPage initialDiscussion={discussion} params={params} />
  } catch (error) {
    return <div>Error loading discussion</div>
  }
}
