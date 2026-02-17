import { ToolPageLayout } from '@/components/admin/tool-page-layout'
import { getAllBookings } from '@/lib/firebase-db'

export default async function BookingsPage() {
  let bookings: any[] = []

  try {
    bookings = await getAllBookings()
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
  }

  return (
    <ToolPageLayout
      title="Booking Manager"
      description="Manage all service bookings and appointments"
      backHref="/admin"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <p className="text-sm font-medium text-blue-600 mb-2">Total Bookings</p>
            <p className="text-3xl font-bold text-blue-900">{bookings.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <p className="text-sm font-medium text-green-600 mb-2">Confirmed</p>
            <p className="text-3xl font-bold text-green-900">
              {bookings.filter(b => b.status === 'CONFIRMED').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
            <p className="text-sm font-medium text-yellow-600 mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-900">
              {bookings.filter(b => b.status === 'PENDING').length}
            </p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Booking ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {booking.id?.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {booking.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {booking.brand}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(booking.bookingDate?.toDate?.() || booking.bookingDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ToolPageLayout>
  )
}
