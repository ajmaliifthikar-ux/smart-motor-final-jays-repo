'use client'

import { ServiceSlotConfig } from '@/lib/booking-system'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2, Edit2 } from 'lucide-react'

interface ServiceConfigListProps {
  configs: (ServiceSlotConfig & { id: string })[]
  onEdit: (config: ServiceSlotConfig & { id: string }) => void
  onDelete: (id: string) => Promise<void>
  isLoading: boolean
}

const SERVICES: Record<string, string> = {
  mechanical: 'Mechanical Services',
  electrical: 'Electrical Services',
  painting: 'Painting Services',
  detailing: 'Detailing Services',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function ServiceConfigList({
  configs,
  onEdit,
  onDelete,
  isLoading,
}: ServiceConfigListProps) {
  if (configs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No service configurations yet.</p>
        <p className="text-sm text-gray-400 mt-1">Create one to get started.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {configs.map((config) => (
        <Card key={config.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {/* Service Name */}
              <h3 className="text-lg font-semibold text-gray-900">
                {SERVICES[config.serviceId] || config.serviceId}
              </h3>

              {/* Operating Days */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Days:</span>
                <div className="flex gap-1">
                  {DAYS.map((day, index) => (
                    <span
                      key={index}
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        config.daysOfWeek.includes(index)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Time & Slot Info */}
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Hours:</span>
                  <p className="font-medium text-gray-900">
                    {config.startTime} - {config.endTime}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Slot Duration:</span>
                  <p className="font-medium text-gray-900">{config.slotDuration} min</p>
                </div>
                <div>
                  <span className="text-gray-600">Capacity:</span>
                  <p className="font-medium text-gray-900">{config.capacity} per slot</p>
                </div>
                <div>
                  <span className="text-gray-600">Advance Booking:</span>
                  <p className="font-medium text-gray-900">{config.maxAdvanceBooking} days</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 ml-4">
              <Button
                onClick={() => onEdit(config)}
                className="gap-1 text-xs px-3 py-1"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </Button>
              <Button
                onClick={() => onDelete(config.id)}
                disabled={isLoading}
                className="gap-1 text-xs px-3 py-1 bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
