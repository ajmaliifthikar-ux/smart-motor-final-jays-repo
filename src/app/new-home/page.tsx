import { redirect } from 'next/navigation'

// 301 redirect: /new-home → / (canonical homepage is now at /)
export default function NewHomePage() {
    redirect('/')
}
