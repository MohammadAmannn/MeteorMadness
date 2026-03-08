const NASA_API_KEY =
  process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";

const BASE_URL = "https://api.nasa.gov/neo/rest/v1";

/* ---------------- DEMO ASTEROID ---------------- */

export const IMPACTOR_2025 = {
  id: "impactor-2025",
  name: "Impactor-2025",
  diameter: 150,
  velocity: 17,
  miss_distance: 50000,
  hazardous: true,
  orbital_data: {
    semi_major_axis: 1.2,
    eccentricity: 0.4,
    inclination: 5.2,
    period: 1.3
  }
};

/* ---------------- GET SINGLE ASTEROID DATA ---------------- */

export async function getAsteroidData(asteroidId) {
  if (asteroidId === "impactor-2025") {
    return IMPACTOR_2025;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/neo/${asteroidId}?api_key=${NASA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NASA API error ${response.status}`);
    }

    const data = await response.json();

    const closeApproach = data.close_approach_data?.[0];

    const diameter =
      data.estimated_diameter?.meters?.estimated_diameter_max || 0;

    return {
      id: data.id,
      name: data.name,
      diameter: Math.round(diameter),
      velocity: closeApproach
        ? parseFloat(closeApproach.relative_velocity.kilometers_per_second)
        : 0,
      miss_distance: closeApproach
        ? Math.round(parseFloat(closeApproach.miss_distance.kilometers))
        : 0,
      hazardous: data.is_potentially_hazardous_asteroid,
      orbital_data: {
        semi_major_axis: parseFloat(data.orbital_data?.semi_major_axis) || 1,
        eccentricity: parseFloat(data.orbital_data?.eccentricity) || 0.1,
        inclination: parseFloat(data.orbital_data?.inclination) || 5,
        period: parseFloat(data.orbital_data?.orbital_period) || 365
      },
      realData: true
    };
  } catch (error) {
    console.error("NASA asteroid error:", error);
    return IMPACTOR_2025;
  }
}

/* ---------------- GET LATEST ASTEROIDS (AUTO UPDATE) ---------------- */

export async function getLatestAsteroids() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const response = await fetch(
      `${BASE_URL}/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NASA Feed API error ${response.status}`);
    }

    const data = await response.json();

    const todayAsteroids =
      data.near_earth_objects[today] || [];

    return todayAsteroids.slice(0, 10).map((asteroid) => ({
      id: asteroid.id,
      name: asteroid.name,
      description: asteroid.is_potentially_hazardous_asteroid
        ? "Potentially Hazardous"
        : "Near Earth Object"
    }));

  } catch (error) {
    console.error("NASA asteroid list error:", error);
    return [];
  }
}

/* ---------------- LIVE ASTEROID FEED ---------------- */

export async function getCloseApproachAsteroids() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const response = await fetch(
      `${BASE_URL}/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NASA Feed API error ${response.status}`);
    }

    const data = await response.json();

    const todayAsteroids =
      data.near_earth_objects[today] || [];

    return todayAsteroids.slice(0, 5).map((asteroid) => ({
      id: asteroid.id,
      name: asteroid.name,
      diameter: Math.round(
        asteroid.estimated_diameter.meters.estimated_diameter_max
      ),
      velocity: parseFloat(
        asteroid.close_approach_data[0].relative_velocity.kilometers_per_second
      ),
      miss_distance: Math.round(
        parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers)
      ),
      hazardous: asteroid.is_potentially_hazardous_asteroid
    }));

  } catch (error) {
    console.error("NASA Feed API Error:", error);
    return [];
  }
}