import { describe, it, expect, vi, beforeEach } from 'vitest'
import BrandPage from '../app/brand/[slug]/page'
import { getAllBrands } from '../lib/firebase-db'
import { notFound } from 'next/navigation'

vi.mock('../lib/firebase-db', () => ({
  getAllBrands: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => { throw new Error('NEXT_NOT_FOUND') }),
}))

// Mock components used in BrandPage
vi.mock('@/components/v2/layout/navbar', () => ({
  Navbar: () => 'navbar',
}))

vi.mock('@/components/v2/layout/footer', () => ({
  Footer: () => 'footer',
}))

describe('BrandPage Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('destructures and awaits params correctly', async () => {
    const mockBrands = [
      { name: 'Ferrari', slug: 'ferrari', description: 'F8, SF90', logoUrl: '/ferrari.png' }
    ]
    vi.mocked(getAllBrands).mockResolvedValue(mockBrands as any)

    const params = Promise.resolve({ slug: 'ferrari' })
    const result = await BrandPage({ params })

    expect(getAllBrands).toHaveBeenCalled()
    expect(result).toBeDefined()
  })

  it('calls notFound when brand is missing', async () => {
    vi.mocked(getAllBrands).mockResolvedValue([])

    const params = Promise.resolve({ slug: 'unknown' })
    await expect(BrandPage({ params })).rejects.toThrow('NEXT_NOT_FOUND')

    expect(notFound).toHaveBeenCalled()
  })
})
