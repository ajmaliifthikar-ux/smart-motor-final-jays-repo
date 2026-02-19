import { redirect } from 'next/navigation'

type Props = {
    params: Promise<{ slug: string }>
}

// 301 redirect: /new-home/smart-tips/[slug] → /smart-tips/[slug] (canonical)
export default async function SmartTipsSlugRedirect(props: Props) {
    const params = await props.params
    redirect(`/smart-tips/${params.slug}`)
}
