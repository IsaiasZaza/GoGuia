import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

export default function Mapa() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapLibreMap | null>(null);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://tiles.openfreemap.org/styles/liberty",
            center: [-46.6333, -23.5505],
            zoom: 12,
        });

        mapRef.current = map;

        map.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );

        map.on("load", async () => {

            // origem -> parada -> parada -> destino
            const waypoints: [number, number][] = [
                [-47.8825, -15.7975],
                [-47.8895, -15.7908], 
                [-47.9124, -15.7835], 
            ];

            // markers
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
                        new maplibregl.Popup().setText(
                            `Parada ${index + 1}`
                        )
                    )
                    .addTo(map);
            });

            // =========================
            // OSRM ROUTE (SEM CORS)
            // =========================

            const coordinates = waypoints
                .map((coord) => coord.join(","))
                .join(";");

            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
            );

            const data = await response.json();

            console.log(data);

            // transformar em GeoJSON
            const geojson = {
                type: "Feature" as const,
                properties: {},
                geometry: data.routes[0].geometry,
            };

            // adicionar rota
            map.addSource("route", {
                type: "geojson",
                data: geojson,
            });

            map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#F47B2A",
                    "line-width": 6,
                    "line-opacity": 0.8,
                },
            });

            // ajustar câmera automaticamente
            const bounds = new maplibregl.LngLatBounds();

            waypoints.forEach((point) => {
                bounds.extend(point);
            });

            map.fitBounds(bounds, {
                padding: 60,
            });

            // distância e duração
            const route = data.routes[0];

            console.log(
                "Distância:",
                (route.distance / 1000).toFixed(2),
                "km"
            );

            console.log(
                "Tempo:",
                (route.duration / 60).toFixed(0),
                "min"
            );
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div
            ref={mapContainer}
            style={{
                width: "100%",
                height: "50vh",
            }}
        />
    );
}