const USGS_BASE_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query";

export async function getNearbyEarthquakes(lat, lng, radiusKm = 500) {
    try {
        const endtime = new Date().toISOString().split("T")[0];
        const start = new Date();
        start.setDate(start.getDate() - 30);
        const starttime = start.toISOString().split("T")[0];

        const url = `${USGS_BASE_URL}?format=geojson&latitude=${lat}&longitude=${lng}&maxradiuskm=${radiusKm}&starttime=${starttime}&endtime=${endtime}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("USGS API error");
        }

        const data = await response.json();

        return data.features.map(eq => ({
            magnitude: eq.properties.mag,
            place: eq.properties.place,
            lat: eq.geometry.coordinates[1],
            lng: eq.geometry.coordinates[0],
            depth: eq.geometry.coordinates[2]
        }));

    } catch (error) {
        console.error("USGS API Error:", error);
        return [];
    }
}