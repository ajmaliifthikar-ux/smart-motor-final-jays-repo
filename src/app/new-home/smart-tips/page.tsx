import { redirect } from 'next/navigation'

// 301 redirect: /new-home/smart-tips → /smart-tips (canonical)
export default function SmartTipsRedirect() {
    redirect('/smart-tips')
}
