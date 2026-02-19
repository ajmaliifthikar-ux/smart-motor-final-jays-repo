'use client'

import { GoogleMapView } from './google-map-view'

interface EmirateData {
    emirate: string
    count: number
}

interface UAEHeatmapProps {
    data: EmirateData[]
}

export function UAEHeatmap({ data }: UAEHeatmapProps) {
    return <GoogleMapView data={data} />
}
