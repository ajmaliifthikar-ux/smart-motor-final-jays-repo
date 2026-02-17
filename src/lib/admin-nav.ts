// Admin Navigation Structure
// Defines all 10 sections with sub-tools for the new sidebar

import {
  LayoutDashboard,
  Brain,
  Palette,
  Zap,
  Share2,
  Search,
  FileText,
  Calendar,
  Wrench,
  Settings,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Cpu,
  Share,
  TrendingUp,
  LinkIcon,
  QrCode,
  DollarSign,
  Users,
  Lock,
  Bell,
  Palette as PaletteIcon,
  Type,
  FileCheck,
  Calculator,
  Hash,
  Globe,
  BookOpen,
  Layers,
  Smartphone,
  LineChart,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export interface NavSection {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  items: NavItem[]
}

export const adminNavigation: NavSection[] = [
  {
    id: 'performance',
    label: 'Performance Dashboard',
    icon: LayoutDashboard,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },

  // 🧠 BUSINESS INTELLIGENCE
  {
    id: 'intelligence',
    label: 'Business Intelligence',
    icon: Brain,
    items: [
      {
        id: 'market-research',
        label: 'Market Research',
        href: '/admin/intelligence/market-research',
        icon: BarChart3,
      },
      {
        id: 'competitor-analysis',
        label: 'Competitor Analysis',
        href: '/admin/intelligence/competitor-analysis',
        icon: TrendingUp,
      },
      {
        id: 'market-position',
        label: 'Market Position',
        href: '/admin/intelligence/market-position',
        icon: Globe,
      },
      {
        id: 'customer-personas',
        label: 'Customer Personas',
        href: '/admin/intelligence/customer-personas',
        icon: Users,
      },
      {
        id: 'trend-tracker',
        label: 'Trend Tracker',
        href: '/admin/intelligence/trend-tracker',
        icon: LineChart,
      },
      {
        id: 'swot-analysis',
        label: 'SWOT Analysis',
        href: '/admin/intelligence/swot-analysis',
        icon: Layers,
      },
      {
        id: 'opportunity-finder',
        label: 'Opportunity Finder',
        href: '/admin/intelligence/opportunity-finder',
        icon: Lightbulb,
      },
      {
        id: 'pricing-intelligence',
        label: 'Pricing Intelligence',
        href: '/admin/intelligence/pricing-intelligence',
        icon: DollarSign,
      },
    ],
  },

  // 🎨 AI STUDIO
  {
    id: 'studio',
    label: 'AI Studio',
    icon: Palette,
    items: [
      {
        id: 'content-calendar',
        label: 'Content Calendar',
        href: '/admin/studio/content-calendar',
        icon: Calendar,
      },
      {
        id: 'social-posts',
        label: 'Social Posts',
        href: '/admin/studio/social-posts',
        icon: Share,
      },
      {
        id: 'visuals',
        label: 'Artwork & Visuals',
        href: '/admin/studio/visuals',
        icon: PaletteIcon,
      },
      {
        id: 'video-script',
        label: 'Video Script',
        href: '/admin/studio/video-script',
        icon: FileText,
      },
      {
        id: 'blog-writer',
        label: 'Blog Writer',
        href: '/admin/studio/blog-writer',
        icon: BookOpen,
      },
      {
        id: 'captions',
        label: 'Captions & Hashtags',
        href: '/admin/studio/captions',
        icon: Hash,
      },
      {
        id: 'brainstormer',
        label: 'Content Brainstorm',
        href: '/admin/studio/brainstormer',
        icon: Lightbulb,
      },
      {
        id: 'documents',
        label: 'Documents',
        href: '/admin/studio/documents',
        icon: FileCheck,
      },
      {
        id: 'templates',
        label: 'Templates & Lists',
        href: '/admin/studio/templates',
        icon: Layers,
      },
      {
        id: 'brand-voice',
        label: 'Brand Voice',
        href: '/admin/studio/brand-voice',
        icon: Type,
      },
      {
        id: 'ad-copy',
        label: 'Ad Copy Generator',
        href: '/admin/studio/ad-copy',
        icon: Smartphone,
      },
    ],
  },

  // ⚙️ AI AUTOMATION
  {
    id: 'automation',
    label: 'AI Automation',
    icon: Zap,
    items: [
      {
        id: 'booking-auto',
        label: 'Booking Automation',
        href: '/admin/automation/booking-auto',
        icon: Calendar,
      },
      {
        id: 'whatsapp-bot',
        label: 'WhatsApp Bot',
        href: '/admin/automation/whatsapp-bot',
        icon: MessageSquare,
      },
      {
        id: 'auto-replies',
        label: 'Auto Reply Rules',
        href: '/admin/automation/auto-replies',
        icon: MessageSquare,
      },
      {
        id: 'lead-capture',
        label: 'Lead Capture',
        href: '/admin/automation/lead-capture',
        icon: Users,
      },
      {
        id: 'follow-ups',
        label: 'Follow-up Sequences',
        href: '/admin/automation/follow-ups',
        icon: Send,
      },
      {
        id: 'reminders',
        label: 'Appointment Reminders',
        href: '/admin/automation/reminders',
        icon: Bell,
      },
      {
        id: 'onboarding',
        label: 'Onboarding Flow',
        href: '/admin/automation/onboarding',
        icon: Layers,
      },
      {
        id: 'invoices',
        label: 'Invoice Automation',
        href: '/admin/automation/invoices',
        icon: FileCheck,
      },
      {
        id: 'command-center',
        label: 'Command Center',
        href: '/admin/automation/command-center',
        icon: Cpu,
      },
    ],
  },

  // 📱 SOCIAL MEDIA MANAGEMENT
  {
    id: 'social-media',
    label: 'Social Media',
    icon: Share2,
    items: [
      {
        id: 'post-scheduler',
        label: 'Post Scheduler',
        href: '/admin/social-media/post-scheduler',
        icon: Calendar,
      },
      {
        id: 'auto-responses',
        label: 'Auto Responses',
        href: '/admin/social-media/auto-responses',
        icon: MessageSquare,
      },
      {
        id: 'calendar-view',
        label: 'Calendar View',
        href: '/admin/social-media/calendar-view',
        icon: Calendar,
      },
      {
        id: 'engagement',
        label: 'Engagement Tracker',
        href: '/admin/social-media/engagement',
        icon: TrendingUp,
      },
      {
        id: 'hashtags',
        label: 'Hashtag Analyzer',
        href: '/admin/social-media/hashtags',
        icon: Hash,
      },
      {
        id: 'growth',
        label: 'Growth Monitor',
        href: '/admin/social-media/growth',
        icon: LineChart,
      },
      {
        id: 'inbox',
        label: 'Comment & DM Inbox',
        href: '/admin/social-media/inbox',
        icon: MessageSquare,
      },
      {
        id: 'platforms',
        label: 'Platform Manager',
        href: '/admin/social-media/platforms',
        icon: Globe,
      },
    ],
  },

  // 🔍 SEO RESEARCH & DEVELOPMENT
  {
    id: 'seo',
    label: 'SEO Research',
    icon: Search,
    items: [
      {
        id: 'keywords',
        label: 'Keyword Research',
        href: '/admin/seo/keywords',
        icon: Search,
      },
      {
        id: 'content-brief',
        label: 'Content Brief',
        href: '/admin/seo/content-brief',
        icon: FileText,
      },
      {
        id: 'knowledge-pages',
        label: 'Knowledge Pages',
        href: '/admin/seo/knowledge-pages',
        icon: BookOpen,
      },
      {
        id: 'on-page',
        label: 'On-Page Analyzer',
        href: '/admin/seo/on-page',
        icon: BarChart3,
      },
      {
        id: 'backlinks',
        label: 'Backlink Finder',
        href: '/admin/seo/backlinks',
        icon: LinkIcon,
      },
      {
        id: 'local-seo',
        label: 'Local SEO',
        href: '/admin/seo/local-seo',
        icon: Globe,
      },
      {
        id: 'rankings',
        label: 'Ranking Tracker',
        href: '/admin/seo/rankings',
        icon: LineChart,
      },
      {
        id: 'gap-analysis',
        label: 'Keyword Gap',
        href: '/admin/seo/gap-analysis',
        icon: BarChart3,
      },
      {
        id: 'pipeline',
        label: 'Content Pipeline',
        href: '/admin/seo/pipeline',
        icon: Layers,
      },
    ],
  },

  // 📝 BLOG MANAGER
  {
    id: 'blog',
    label: 'Blog Manager',
    icon: FileText,
    items: [
      {
        id: 'blog-home',
        label: 'All Posts',
        href: '/admin/blog',
        icon: FileText,
      },
      {
        id: 'blog-new',
        label: 'New Post',
        href: '/admin/blog/new',
        icon: FileText,
      },
      {
        id: 'blog-drafts',
        label: 'Drafts',
        href: '/admin/blog/drafts',
        icon: FileText,
      },
    ],
  },

  // 📅 BOOKING MANAGER
  {
    id: 'bookings',
    label: 'Booking Manager',
    icon: Calendar,
    items: [
      {
        id: 'bookings-home',
        label: 'All Bookings',
        href: '/admin/bookings',
        icon: Calendar,
      },
      {
        id: 'bookings-calendar',
        label: 'Calendar View',
        href: '/admin/bookings/calendar',
        icon: Calendar,
      },
      {
        id: 'bookings-history',
        label: 'History',
        href: '/admin/bookings/history',
        icon: FileText,
      },
    ],
  },

  // 🛠️ TOOLS & UTILITIES
  {
    id: 'tools',
    label: 'Tools & Utilities',
    icon: Wrench,
    items: [
      {
        id: 'url-shortener',
        label: 'URL Shortener',
        href: '/admin/tools/url-shortener',
        icon: LinkIcon,
      },
      {
        id: 'qr-code',
        label: 'QR Code Generator',
        href: '/admin/tools/qr-code',
        icon: QrCode,
      },
      {
        id: 'image-resizer',
        label: 'Image Resizer',
        href: '/admin/tools/image-resizer',
        icon: PaletteIcon,
      },
      {
        id: 'file-converter',
        label: 'File Converter',
        href: '/admin/tools/file-converter',
        icon: FileCheck,
      },
      {
        id: 'color-palette',
        label: 'Color Palette',
        href: '/admin/tools/color-palette',
        icon: PaletteIcon,
      },
      {
        id: 'fonts',
        label: 'Font Pairing',
        href: '/admin/tools/fonts',
        icon: Type,
      },
      {
        id: 'invoice-gen',
        label: 'Invoice Generator',
        href: '/admin/tools/invoice-gen',
        icon: FileCheck,
      },
      {
        id: 'calculator',
        label: 'Calculator',
        href: '/admin/tools/calculator',
        icon: Calculator,
      },
    ],
  },

  // ⚙️ SETTINGS & CONFIGURATION
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    items: [
      {
        id: 'users',
        label: 'Users & Roles',
        href: '/admin/settings/users',
        icon: Users,
      },
      {
        id: 'integrations',
        label: 'Integrations',
        href: '/admin/settings/integrations',
        icon: LinkIcon,
      },
      {
        id: 'platforms',
        label: 'Connected Platforms',
        href: '/admin/settings/platforms',
        icon: Globe,
      },
      {
        id: 'notifications',
        label: 'Notifications',
        href: '/admin/settings/notifications',
        icon: Bell,
      },
      {
        id: 'brand',
        label: 'Brand Profile',
        href: '/admin/settings/brand',
        icon: PaletteIcon,
      },
      {
        id: 'billing',
        label: 'Billing',
        href: '/admin/settings/billing',
        icon: DollarSign,
      },
      {
        id: 'audit-logs',
        label: 'Audit Logs',
        href: '/admin/settings/audit-logs',
        icon: FileCheck,
      },
    ],
  },
]

// Helper function to flatten all items for quick lookup
export function getAllNavItems(): NavItem[] {
  return adminNavigation.flatMap((section) => section.items)
}

// Helper function to find current section and item from href
export function getCurrentNavItem(href: string): {
  section?: NavSection
  item?: NavItem
} {
  for (const section of adminNavigation) {
    const item = section.items.find((i) => i.href === href)
    if (item) {
      return { section, item }
    }
  }
  return {}
}

// Icon imports that weren't available
import { Send } from 'lucide-react'
