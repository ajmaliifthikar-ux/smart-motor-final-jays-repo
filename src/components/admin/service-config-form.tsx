'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { ServiceSlotConfig } from '@/lib/booking-system'

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SERVICES = [
  { id: 'mechanical', name: 'Mechanical Services' },
  { id: 'electrical', name: 'Electrical Services' },
  { id: 'painting', name: 'Painting Services' },
  { id: 'detailing', name: 'Detailing Services' },
]

interface ServiceConfigFormProps {
  config?: ServiceSlotConfig & { id?: string }
  onSubmit: (config: ServiceSlotConfig) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function ServiceConfigForm({
  config,
  onSubmit,
  onCancel,
  isLoading,
}: ServiceConfigFormProps) {
  const [formData, setFormData] = useState<ServiceSlotConfig>(
    config || {
      serviceId: '',
      daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri default
      slotsPerDay: 8,
      slotDuration: 60,
      startTime: '09:00',
      endTime: '17:00',
      capacity: 1,
      maxAdvanceBooking: 30,
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const toggleDay = (dayIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayIndex)
        ? prev.daysOfWeek.filter((d) => d !== dayIndex)
        : [...prev.daysOfWeek, dayIndex].sort(),
    }))
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Selection */}
        <div className="space-y-2">
          <Label htmlFor="serviceId">Service</Label>
          <select
            id="serviceId"
            value={formData.serviceId}
            onChange={(e) => setFormData((prev) => ({ ...prev, serviceId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={!!config}
            required
          >
            <option value="">Select a service</option>
            {SERVICES.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Days of Week */}
        <div className="space-y-2">
          <Label>Operating Days</Label>
          <div className="grid grid-cols-4 gap-2">
            {DAYS_OF_WEEK.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleDay(index)}
                className={`py-2 px-2 rounded text-sm font-medium transition ${
                  formData.daysOfWeek.includes(index)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Time Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Slot Configuration */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="slotDuration">
              Slot Duration (minutes)
            </Label>
            <Input
              id="slotDuration"
              type="number"
              min="15"
              max="480"
              step="15"
              value={formData.slotDuration}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slotDuration: parseInt(e.target.value) }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity per Slot</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="10"
              value={formData.capacity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, capacity: parseInt(e.target.value) }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxAdvanceBooking">
              Max Days in Advance
            </Label>
            <Input
              id="maxAdvanceBooking"
              type="number"
              min="1"
              max="365"
              value={formData.maxAdvanceBooking}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxAdvanceBooking: parseInt(e.target.value),
                }))
              }
              required
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-900">
            <strong>Slots per day:</strong> With {formData.startTime} - {formData.endTime} and{' '}
            {formData.slotDuration} minute slots, you'll have approximately{' '}
            <strong>
              {Math.ceil(
                ((parseInt(formData.endTime) * 60 + parseInt(formData.endTime.split(':')[1])) -
                  (parseInt(formData.startTime) * 60 + parseInt(formData.startTime.split(':')[1]))) /
                  formData.slotDuration
              )}
            </strong>{' '}
            slots per day with <strong>{formData.capacity}</strong> booking{formData.capacity > 1 ? 's' : ''}{' '}
            per slot.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading || !formData.serviceId}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Saving...' : config ? 'Update Configuration' : 'Create Configuration'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
