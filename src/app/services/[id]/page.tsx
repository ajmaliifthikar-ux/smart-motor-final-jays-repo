import { redirect } from 'next/navigation'

export default async function ServicePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    redirect(`/new-home/services/${params.id}`)
}
