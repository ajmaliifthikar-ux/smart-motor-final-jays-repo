import { LucideIcon } from 'lucide-react'

interface ToolPlaceholderProps {
  title: string
  description: string
  icon: LucideIcon
  status?: 'coming-soon' | 'beta' | 'disabled'
  comingSoonDate?: string
}

const statusConfig = {
  'coming-soon': {
    label: 'Coming Soon',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300'
  },
  'beta': {
    label: 'Beta',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-400'
  },
  'disabled': {
    label: 'Disabled',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300'
  }
}

export function ToolPlaceholder({
  title,
  description,
  icon: Icon,
  status = 'coming-soon',
  comingSoonDate
}: ToolPlaceholderProps) {
  const config = statusConfig[status]

  return (
    <div className="min-h-screen bg-[#FAFAF9] p-8">
      <div className="max-w-2xl mx-auto">
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor} border ${config.borderColor} mb-8`}>
          <div className="w-2 h-2 rounded-full bg-current" />
          <span className={`text-sm font-semibold ${config.textColor}`}>
            {config.label}
            {comingSoonDate && ` - ${comingSoonDate}`}
          </span>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-[#E62329]/20 to-[#E62329]/5 p-6 rounded-2xl">
              <Icon className="w-16 h-16 text-[#E62329]" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
            {description}
          </p>

          {/* Message */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-700 font-medium">
              🔨 This tool is being actively developed
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Check back soon for updates and new features
            </p>
          </div>

          {/* Feature List (Optional) */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Expected Features
            </h3>
            <ul className="text-left max-w-sm mx-auto space-y-3">
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-[#E62329] font-bold mt-1">✓</span>
                <span>Comprehensive tool suite for {title.toLowerCase()}</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-[#E62329] font-bold mt-1">✓</span>
                <span>Seamless integration with other admin tools</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-[#E62329] font-bold mt-1">✓</span>
                <span>Real-time analytics and reporting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
