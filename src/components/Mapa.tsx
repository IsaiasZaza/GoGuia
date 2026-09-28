import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import type { Parada } from "@/services/dominio";

const PARADAS_PADRAO: Parada[] = [
    { nome: "Ponto de encontro", lat: -15.7975, lng: -47.8825 },
    { nome: "Parada intermediária", lat: -15.7908, lng: -47.8895 },
    { nome: "Destino", lat: -15.7835, lng: -47.9124 },
];

interface MapaProps {
    paradas?: Parada[];
    altura?: string;
}

export default function Mapa({ paradas, altura = "50vh" }: MapaProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapLibreMap | null>(null);
    const pontos = paradas && paradas.length >= 2 ? paradas : PARADAS_PADRAO;
    const chave = pontos.map((p) => `${p.lat},${p.lng}`).join("|");

    useEffect(() => {
        if (!mapContainer.current) return;

        let map: MapLibreMap | null = null;
        const waypoints: [number, number][] = pontos.map((parada) => [parada.lng, parada.lat]);

        const frame = requestAnimationFrame(() => {
            if (!mapContainer.current) return;

            map = new maplibregl.Map({
                container: mapContainer.current,
                style: "https://tiles.openfreemap.org/styles/liberty",
                center: waypoints[0],
                zoom: 12,
            });
            mapRef.current = map;

            map.addControl(new maplibregl.NavigationControl(), "top-right");

            map.on("error", (event) => {
                const status = (event.error as { status?: number } | undefined)?.status;
                if (status === 0) return;
                console.error(event.error);
            });

            map.on("load", async () => {
                if (!map) return;

                waypoints.forEach((point, index) => {
                    new maplibregl.Marker({
                        color:
                            index === 0
                                ? "green"
                                : index === waypoints.length - 1
                                    ? "red"
                                    : "blue",
                    })
                        .setLngLat(point)
                        .setPopup(
                            new maplibregl.Popup().setText(pontos[index]?.nome || `Parada ${index + 1}`)
                        )
                        .addTo(map);
                });

                const bounds = new maplibregl.LngLatBounds();
                waypoints.forEach((point) => bounds.extend(point));
                map.fitBounds(bounds, { padding: 60 });

                try {
                    const coordinates = waypoints.map((coord) => coord.join(",")).join(";");
                    const response = await fetch(
                        `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
                    );
                    const data = await response.json();
                    const rota = data?.routes?.[0];
                    if (!rota || !map.getStyle() || map.getSource("route")) return;

                    map.addSource("route", {
                        type: "geojson",
                        data: { type: "Feature", properties: {}, geometry: rota.geometry },
                    });

                    map.addLayer({
                        id: "route",
                        type: "line",
                        source: "route",
                        layout: { "line-join": "round", "line-cap": "round" },
                        paint: {
                            "line-color": "#F47B2A",
                            "line-width": 6,
                            "line-opacity": 0.8,
                        },
                    });
                } catch {
                    // sem rota traçada, os marcadores continuam no mapa
                }
            });
        });

        return () => {
            cancelAnimationFrame(frame);
            map?.remove();
            mapRef.current = null;
        };
    }, [chave]);

    return <div ref={mapContainer} style={{ width: "100%", height: altura }} />;
}
