import { 
  adminGetAllServices, 
  adminGetAllBrands 
} from '@/lib/firebase-admin'
import { StudioClient } from '@/components/admin/studio/studio-client'

export const dynamic = 'force-dynamic'

export default async function StudioPage() {
  const [services, brands] = await Promise.all([
    adminGetAllServices(),
    adminGetAllBrands()
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-[#121212] uppercase italic">
          Management <span className="text-[#E62329]">Studio</span>
        </h1>
        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Advanced Catalog & Asset Control
        </p>
      </div>

      <StudioClient 
        initialServices={services} 
        initialBrands={brands} 
      />
    </div>
  )
}
