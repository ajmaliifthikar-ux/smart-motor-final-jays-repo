'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Smartphone, Monitor, Laptop, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Device {
  id: string
  name: string
  ipAddress: string
  lastUsedAt: Date
  createdAt: Date
}

interface TrustedDevicesProps {
  devices: Device[]
  onDevicesChanged: () => void
}

export default function TrustedDevices({ devices, onDevicesChanged }: TrustedDevicesProps) {
  const [isLoading, setIsLoading] = useState(false)

  const getDeviceIcon = (name: string) => {
    if (name.toLowerCase().includes('mobile') || name.toLowerCase().includes('phone')) {
      return <Smartphone className="w-5 h-5" />
    }
    if (name.toLowerCase().includes('tablet')) {
      return <Smartphone className="w-5 h-5" />
    }
    if (name.toLowerCase().includes('desktop') || name.toLowerCase().includes('windows')) {
      return <Monitor className="w-5 h-5" />
    }
    return <Laptop className="w-5 h-5" />
  }

  async function handleRemoveDevice(deviceId: string) {
    if (!confirm('Are you sure you want to remove this device?')) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/security/devices/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || 'Failed to remove device')
        return
      }

      toast.success('Device removed successfully')
      onDevicesChanged()
    } catch (error) {
      toast.error('An error occurred while removing device')
      console.error('Remove device error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Trusted Devices</h2>
        <p className="text-gray-600 mt-2">
          Manage devices that have been verified for your account
        </p>
      </div>

      {devices.length === 0 ? (
        <Card className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900">No trusted devices</h3>
          <p className="text-sm text-gray-600 mt-1">
            Devices you verify will appear here for quick authentication
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {devices.map((device) => (
            <Card key={device.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-gray-400 mt-1">{getDeviceIcon(device.name)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{device.name}</h3>
                      {new Date(device.lastUsedAt) > new Date(Date.now() - 3600000) && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">IP: {device.ipAddress}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Added on {new Date(device.createdAt).toLocaleDateString()}{' '}
                      {new Date(device.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      Last used{' '}
                      {new Date(device.lastUsedAt).toLocaleDateString(undefined, {
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleRemoveDevice(device.id)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold text-blue-900 mb-1">Device Management</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Remove any devices you don't recognize</li>
              <li>Keep only devices you actively use</li>
              <li>If compromised, remove device immediately</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
