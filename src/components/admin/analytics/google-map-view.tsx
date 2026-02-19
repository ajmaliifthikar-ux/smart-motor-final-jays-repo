'use client'

import { useState } from 'react'
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps'
import { motion } from 'framer-motion'

interface Location {
    key: string
    location: { lat: number; lng: number }
    name: string
    count: number
}

// Abu Dhabi Center
const ABU_DHABI_CENTER = { lat: 24.4539, lng: 54.3773 }

export function GoogleMapView({ data }: { data: any[] }) {
    // Transform your emirate data to approximate lat/lng for visualization
    // In a real app, you'd use actual branch coordinates
    const locations: Location[] = [
        { key: 'abudhabi', location: { lat: 24.4539, lng: 54.3773 }, name: 'Abu Dhabi HQ', count: data.find(d => d.emirate === 'Abu Dhabi')?.count || 0 },
        { key: 'dubai', location: { lat: 25.2048, lng: 55.2708 }, name: 'Dubai Branch', count: data.find(d => d.emirate === 'Dubai')?.count || 0 },
        { key: 'sharjah', location: { lat: 25.3463, lng: 55.4209 }, name: 'Sharjah Hub', count: data.find(d => d.emirate === 'Sharjah')?.count || 0 },
    ]

    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

    return (
        <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-inner">
             <div className="absolute top-6 left-6 z-10">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#121212] flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#E62329] animate-pulse" />
                    Live Operations Map
                </h3>
            </div>

            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                <Map
                    defaultCenter={ABU_DHABI_CENTER}
                    defaultZoom={9}
                    mapId="smart-motor-admin-map" // Required for Advanced Markers
                    gestureHandling={'cooperative'}
                    disableDefaultUI={true}
                    className="w-full h-full"
                >
                    {locations.map((loc) => (
                        <AdvancedMarker
                            key={loc.key}
                            position={loc.location}
                            onClick={() => setSelectedLocation(loc)}
                        >
                            <div className="relative group cursor-pointer">
                                <Pin background={'#E62329'} glyphColor={'#FFF'} borderColor={'#FFF'} />
                                {loc.count > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                                        {loc.count}
                                    </span>
                                )}
                            </div>
                        </AdvancedMarker>
                    ))}

                    {selectedLocation && (
                        <InfoWindow
                            position={selectedLocation.location}
                            onCloseClick={() => setSelectedLocation(null)}
                        >
                            <div className="p-2 min-w-[150px]">
                                <h4 className="font-bold text-gray-900">{selectedLocation.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Active Visitors: <span className="font-bold text-[#E62329]">{selectedLocation.count}</span>
                                </p>
                                <button className="mt-2 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700 w-full transition-colors">
                                    View Details
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>

            {/* Overlay Gradient for seamless dashboard integration */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
        </div>
    )
}
