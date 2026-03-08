'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

export default function Earth3D({
  orbitalData,
  hazardous,
  impactPoint,
  isImpact,
  timelineProgress,
  isPlaying,
  onProgressUpdate
}) {

  const mountRef = useRef(null);

  const earthRef = useRef(null);
  const cloudsRef = useRef(null);
  const asteroidRef = useRef(null);
  const impactRef = useRef(null);
  const shockwaveRef = useRef(null);
  const explosionRef = useRef(null);

  const animationRef = useRef(null);
  const timeRef = useRef(0);

  const isImpactRef = useRef(isImpact);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isImpactRef.current = isImpact;
    isPlayingRef.current = isPlaying;

    if (!isPlaying && Math.abs(timeRef.current - timelineProgress) > 0.05) {
      timeRef.current = timelineProgress;
    }

    if (!isImpact) {
      timeRef.current = 0;
      if (explosionRef.current) explosionRef.current.material.opacity = 0;
      if (shockwaveRef.current) shockwaveRef.current.material.opacity = 0;
      if (impactRef.current) impactRef.current.visible = false;
    }
  }, [isImpact, isPlaying, timelineProgress]);

  useEffect(() => {

    if (!mountRef.current) return;
    mountRef.current.innerHTML = ''; // Ensure canvas is fully cleared on mount to prevent duplicates.

    /* ---------------- SCENE ---------------- */

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    camera.position.set(15, 5, 25);

    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );

    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;

    /* ---------------- LIGHTS ---------------- */

    const ambient = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(20, 10, -20);
    scene.add(sunLight);

    /* ---------------- STARS ---------------- */

    const starGeo = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < 4000; i++) {
      starVertices.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );
    }

    starGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starVertices, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12
    });

    const stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);

    /* ---------------- EARTH ---------------- */

    const earthRadius = 5;

    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);

    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x2266ff,
      roughness: 0.8,
      metalness: 0.1
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthRef.current = earth;

    scene.add(earth);

    /* ---------------- CLOUDS ---------------- */

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(earthRadius + 0.1, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
      })
    );

    cloudsRef.current = clouds;
    earth.add(clouds);

    /* ---------------- ASTEROID ---------------- */

    const asteroidGeo = new THREE.IcosahedronGeometry(0.6, 2);

    const asteroidMaterial = new THREE.MeshStandardMaterial({
      color: hazardous ? 0xff4422 : 0x888888,
      roughness: 0.9,
      metalness: 0.2
    });

    const asteroid = new THREE.Mesh(asteroidGeo, asteroidMaterial);
    asteroid.position.set(0, 0, 50);

    asteroidRef.current = asteroid;
    scene.add(asteroid);

    /* ---------------- IMPACT MARK ---------------- */

    const impactCircle = new THREE.Mesh(
      new THREE.CircleGeometry(0.4, 32),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.9
      })
    );

    impactCircle.visible = false;
    impactCircle.renderOrder = 10;

    impactRef.current = impactCircle;

    earth.add(impactCircle);

    /* ---------------- EXPLOSION ---------------- */

    const explosion = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0
      })
    );

    explosionRef.current = explosion;

    scene.add(explosion);

    /* ---------------- FIRE EXPLOSION ---------------- */

    const shockwave = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xff3300,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      })
    );

    shockwaveRef.current = shockwave;

    scene.add(shockwave);

    /* ---------------- ANIMATION ---------------- */

    const animate = (time) => {

      animationRef.current = requestAnimationFrame(animate);

      controls.update();

      /* Earth rotation fix */
      if (earthRef.current)
        earthRef.current.rotation.y += 0.002;

      if (cloudsRef.current)
        cloudsRef.current.rotation.y += 0.0025;

      if (isImpactRef.current) {

        /* timeline progress */
        if (isPlayingRef.current && timeRef.current < 4) {
          timeRef.current += 0.02;
          // Throttle updates to parent
          if (Math.random() < 0.1 && onProgressUpdate) onProgressUpdate(timeRef.current);
        }

        const t = timeRef.current;

        const target = new THREE.Vector3(0, 0, earthRadius);

        if (impactPoint) {

          const lat = impactPoint.lat * Math.PI / 180;
          const lon = impactPoint.lng * Math.PI / 180;

          target.set(
            earthRadius * Math.cos(lat) * Math.sin(lon),
            earthRadius * Math.sin(lat),
            earthRadius * Math.cos(lat) * Math.cos(lon)
          );
        }

        if (t < 3) {

          /* asteroid approach */

          const start = target.clone()
            .normalize()
            .multiplyScalar(50);

          const pos = new THREE.Vector3()
            .lerpVectors(start, target, t / 3);

          asteroid.position.copy(pos);

        } else {

          /* IMPACT */

          asteroid.visible = false;

          impactCircle.visible = true;

          const worldTarget = target.clone()
            .applyMatrix4(earth.matrixWorld);

          explosion.position.copy(worldTarget);
          shockwave.position.copy(worldTarget);

          const impactTime = t - 3;

          if (impactTime < 1) {

            explosion.material.opacity = 1 - impactTime;

            explosion.scale.setScalar(
              1 + impactTime * 8
            );

          } else {

            explosion.material.opacity = 0;

          }

          if (impactTime < 2.5) {

            shockwave.material.opacity =
              (1 - impactTime / 2.5) * 0.8;

            const scale = 1 + impactTime * 15;

            shockwave.scale.set(scale, scale, scale);

          }

        }

      } else {

        /* ORBITAL MODE */

        asteroid.visible = true;

        if (orbitalData) {

          const t = time * 0.00005;

          const a = Math.min(
            orbitalData.semi_major_axis * 12,
            18
          );

          const e = orbitalData.eccentricity;
          const i = orbitalData.inclination * Math.PI / 180;

          const r = a * (1 - e * e) /
            (1 + e * Math.cos(t));

          const x = r * Math.cos(t);
          const z = r * Math.sin(t);
          const y = Math.sin(i) * z;

          asteroid.position.set(x, y, z);
        }

      }

      renderer.render(scene, camera);
    };

    animate(0);

    const resize = () => {

      if (!mountRef.current) return;

      camera.aspect =
        mountRef.current.clientWidth /
        mountRef.current.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener('resize', resize);

    return () => {

      window.removeEventListener('resize', resize);

      if (animationRef.current)
        cancelAnimationFrame(animationRef.current);

      renderer.dispose();
      controls.dispose();

      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };

  }, [orbitalData, hazardous, impactPoint]); // Removed isImpact to avoid full teardown of 3D context on button click.

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
    />
  );
}