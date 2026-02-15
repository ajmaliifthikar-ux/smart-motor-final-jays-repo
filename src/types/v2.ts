
export interface Brand {
    id: string
    name: string
    logo: string // Path to logo image
    description: string
    heroImage: string
    specialties: string[]
    models: string[]
    services: string[] // List of specific services for this brand
    commonIssues?: string[]
}

export interface BrandCategory {
    id: string
    name: string
    slug: string // e.g., 'german-brands'
    description: string
    brands: Brand[]
}

export interface ServicePackage {
    id: string
    title: string
    subtitle?: string
    price?: string
    discount?: string
    features: string[]
    isPromotional?: boolean
    bestFor: string
    validity?: string
}

export interface BlogPost {
    id: string
    title: string
    excerpt: string
    content: string // HTML or Markdown
    date: string
    author: string
    category: string
    image: string
    slug: string
}

export interface AboutContent {
    mission: string
    values: string[]
    story: string
    stats: { label: string; value: string }[]
    features: string[]
}
