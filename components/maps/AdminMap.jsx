"use client";

import { useMemo } from "react";
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = { width: "100%", height: "100%" };
const BANYUWANGI_CENTER = { lat: -8.2192, lng: 114.3691 };

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#e6f1e7" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#3a453d" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9dde6" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#b7c8b9" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
];

/**
 * Peta Google Maps sungguhan — dipakai di Dashboard, Smart Green Route, dan
 * Geofencing. Selama NEXT_PUBLIC_GOOGLE_MAPS_API_KEY kosong, komponen ini
 * menampilkan placeholder statis (lihat lib/config.js HAS_GOOGLE_MAPS_KEY)
 * supaya halaman tidak error saat dev/build tanpa API key.
 */
export default function AdminMap({ markers = [], height = 280, zoom = 13, center = BANYUWANGI_CENTER }) {
  const [active, setActive] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const style = useMemo(() => ({ ...containerStyle, height }), [height]);

  if (!apiKey) {
    return (
      <div
        className="rounded-xl bg-gradient-to-br from-info-100 via-canopy-100 to-canopy-200 flex items-center justify-center relative overflow-hidden"
        style={{ height }}
      >
        <p className="text-xs text-ink-500 text-center max-w-[220px]">
          Peta Google Maps belum aktif — isi <code className="font-data">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> di
          .env untuk menampilkan peta asli.
        </p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={style}
        center={center}
        zoom={zoom}
        options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }}
      >
        {markers.map((m) => (
          <MarkerF key={m.id} position={{ lat: m.lat, lng: m.lng }} onClick={() => setActive(m)} />
        ))}
        {active && (
          <InfoWindowF position={{ lat: active.lat, lng: active.lng }} onCloseClick={() => setActive(null)}>
            <div className="text-sm">
              <p className="font-medium text-ink-900">{active.label}</p>
              {active.note && <p className="text-xs text-ink-500 mt-0.5">{active.note}</p>}
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
