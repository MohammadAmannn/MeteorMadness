# ☄️ Meteor Madness

Meteor Madness is an interactive **asteroid impact simulation platform** that combines real NASA asteroid data with physics-based impact modeling and 3D visualization to help users understand asteroid threats and planetary defense strategies.

The platform allows users to explore real near-Earth asteroids, simulate asteroid collisions with Earth, visualize destruction zones, and experiment with asteroid deflection techniques.

---

# 🌍 Features

## Real-Time Asteroid Data
Meteor Madness integrates with **NASA's Near Earth Object (NEO) API** to fetch real asteroid information including:

- Asteroid diameter
- Velocity
- Distance from Earth
- Hazard classification

This allows users to explore **actual asteroids currently tracked by NASA**.

---

## Live Asteroid Feed
The platform displays asteroids that are **currently passing near Earth**.

Users can monitor:

- Size of the asteroid
- Speed
- Distance from Earth
- Potentially hazardous classification

---

## 3D Orbital Simulation
Using **Three.js**, the platform renders an interactive 3D simulation showing:

- Rotating Earth
- Incoming asteroid
- Orbital trajectory

Users can rotate and zoom the environment to observe asteroid movement.

---

## Asteroid Impact Simulation
When an asteroid reaches Earth, the system simulates a dynamic impact event including:

- Explosion flash
- Shockwave expansion
- Crater formation
- Destruction visualization

This helps demonstrate the scale and consequences of asteroid impacts.

---

## Impact Physics Calculations
The simulator estimates scientific consequences of an asteroid collision such as:

- Impact energy
- Crater diameter
- Earthquake magnitude
- Tsunami height
- Destruction radius

These calculations help users understand the **physics behind asteroid impacts**.

---

## Impact Map Visualization
The platform visualizes damage zones on a world map, including:

- Impact epicenter
- Crater zone
- Seismic damage zone
- Tsunami risk areas

This allows users to see how different regions could be affected.

---

## USGS Seismic Data Integration
Meteor Madness integrates **real earthquake data from USGS** so users can compare:

- Natural earthquakes
- Asteroid impact seismic effects

This provides real-world context to the simulation.

---

## Planetary Defense Simulator
Users can experiment with different asteroid deflection strategies:

- **Kinetic Impactor** – colliding spacecraft to change asteroid velocity
- **Gravity Tractor** – gradually altering asteroid trajectory
- **Nuclear Deflection** – explosive deflection approach

Each strategy adjusts the asteroid's path to attempt to **prevent Earth impact**.

---

## Custom Asteroid Simulation
Users can create their own asteroid scenario by entering:

- Diameter
- Velocity
- Density
- Impact location

The platform then simulates the impact and calculates the consequences.

---

## Simulation Timeline
The simulation includes a timeline that shows how an asteroid event unfolds:

Detection → Approach → Impact → Aftermath

---

## Classroom Mode (Premium Feature)
Meteor Madness also includes a **Classroom Mode** designed for educational use.

Teachers can:

- Create asteroid simulation assignments
- Allow students to run simulations
- Analyze results and reports

Students can submit reports including:

- Asteroid parameters
- Energy calculations
- Crater size
- Environmental impact

This makes the platform a **powerful interactive STEM learning tool**.

---

# 🛠 Tech Stack

Frontend  
- Next.js  
- React  
- Tailwind CSS  

Visualization  
- Three.js  

APIs  
- NASA NEO API  
- USGS Earthquake API  

Tools  
- JavaScript  
- Node.js  

---

# 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/MohammadAmannn/MeteorMadness.git


Install dependencies:

npm install

Run the development server:

npm run dev

Open in browser:

http://localhost:3000
