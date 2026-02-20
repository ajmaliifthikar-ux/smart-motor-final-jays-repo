'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Copy, Download, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface BackupCodesModalProps {
  isOpen: boolean
  onClose: () => void
  backupCodes?: string[]
}

export default function BackupCodesModal({
  isOpen,
  onClose,
  backupCodes = [],
}: BackupCodesModalProps) {
  const [copied, setCopied] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)

  const handleCopyAll = () => {
    const text = backupCodes.join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Codes copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const text = backupCodes.join('\n')
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', 'backup-codes.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Backup codes downloaded')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Save Your Backup Codes</DialogTitle>
          <DialogDescription>
            Keep these codes in a secure place. You can use them if you lose access to your
            authenticator app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">Important:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Each code can only be used once</li>
                <li>Store in a secure location (password manager, safe, etc.)</li>
                <li>Do not share these codes with anyone</li>
                <li>If lost, you won't be able to access your account</li>
              </ul>
            </div>
          </div>

          {/* Codes Display */}
          {backupCodes.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">Your Backup Codes:</p>
              <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white border rounded"
                  >
                    <span className="text-gray-700">{code}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(code)
                        toast.success('Code copied')
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">No backup codes generated yet</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleCopyAll}
              variant="outline"
              disabled={backupCodes.length === 0}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy All'}
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              disabled={backupCodes.length === 0}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Acknowledgement */}
          <div className="space-y-3 pt-4 border-t">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-4 h-4 mt-1 rounded"
              />
              <span className="text-sm text-gray-700">
                I have saved my backup codes in a secure location and understand I will lose access
                to my account if I lose both my authenticator and backup codes.
              </span>
            </label>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            disabled={!acknowledged}
            className="w-full"
          >
            {acknowledged ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Done
              </>
            ) : (
              'Acknowledge to Continue'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
