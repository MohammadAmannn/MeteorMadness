// Fixed impact calculations with proper exports

export function calculateImpactEnergy(diameter, velocity, density = 3000) {
  const radius = diameter / 2;
  const volume = (4/3) * Math.PI * Math.pow(radius, 3);
  const mass = density * volume;
  const velocityMs = velocity * 1000;
  const energyJoules = 0.5 * mass * Math.pow(velocityMs, 2);
  const energyMegatons = energyJoules / (4.184 * Math.pow(10, 15));
  
  const hiroshimaEquivalent = energyMegatons / 0.015;
  
  return {
    energyJoules,
    energyMegatons: Math.round(energyMegatons * 10) / 10,
    hiroshimaEquivalent: Math.round(hiroshimaEquivalent)
  };
}

export function calculateCraterSize(energyMegatons) {
  const diameterKm = 0.15 * Math.pow(energyMegatons, 0.33);
  return {
    diameter: Math.round(diameterKm * 1000),
    depth: Math.round(diameterKm * 1000 * 0.2)
  };
}

export function calculateEarthquakeMagnitude(energyMegatons) {
  if (energyMegatons < 1) return 4.5;
  if (energyMegatons < 10) return 5.5;
  if (energyMegatons < 100) return 6.5;
  if (energyMegatons < 1000) return 7.5;
  return 8.5;
}

export function calculateTsunamiEffects(energyMegatons) {
  const waveHeight = 2 + (energyMegatons / 50);
  const inundationDistance = waveHeight * 100;
  
  return {
    waveHeight: Math.round(waveHeight),
    inundationDistance: Math.round(inundationDistance / 1000),
    warningTime: 15 + (energyMegatons / 10)
  };
}

export function calculateCasualties(energyMegatons, populationDensity = 'medium') {
  const densityMultiplier = { low: 0.5, medium: 1, high: 2, urban: 5 };
  const multiplier = densityMultiplier[populationDensity] || 1;
  
  return Math.round(energyMegatons * 1000 * multiplier);
}

// FIXED: Proper mitigation effect function
export function calculateMitigationEffect(originalVelocity, mitigationType, timeBeforeImpact) {
  const effects = {
    kinetic: { velocityChange: 0.5, effectiveness: 0.8 },
    gravity: { velocityChange: 0.1, effectiveness: 0.6 },
    nuclear: { velocityChange: 1.0, effectiveness: 0.9 },
    none: { velocityChange: 0, effectiveness: 0 }
  };
  
  const effect = effects[mitigationType] || effects.none;
  const timeFactor = Math.max(0.1, Math.min(1, timeBeforeImpact / 365));
  
  const velocityChange = effect.velocityChange * effect.effectiveness * timeFactor;
  return Math.max(0.1, originalVelocity - velocityChange);
}