import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

const Login = () => {
    const { login, register: registerUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [mode, setMode] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // 3D Canvas ref
    const canvasContainerRef = useRef(null);

    const switchMode = (m) => { setMode(m); setError(''); reset(); };

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            if (mode === 'login') {
                await login(data.email, data.password);
            } else {
                await registerUser(data.name, data.email, data.password, data.phone);
            }
            navigate('/');
        } catch (e) {
            console.error('Auth Error:', e);
            setError(e.response?.data?.message || 'Something went wrong. Please try again.');
        } finally { setLoading(false); }
    };

    // 3D Hearts Background Effect
    useEffect(() => {
        if (!canvasContainerRef.current) return;

        // Dynamically import Three.js
        const initThree = async () => {
            const THREE = await import('three');
            const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');

            const container = canvasContainerRef.current;
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            const envGenerator = new THREE.PMREMGenerator(renderer);
            const roomEnv = new RoomEnvironment();
            scene.environment = envGenerator.fromScene(roomEnv).texture;
            scene.background = null;
            scene.fog = new THREE.FogExp2(0xfbf9f5, 0.012);

            const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 40);
            camera.position.set(0, 2.6, 14);
            camera.lookAt(0, 2, 0);

            // Custom Heart Shape Geometry
            function createHeartGeometry(scale = 0.6, depth = 0.7) {
                const shape = new THREE.Shape();
                shape.moveTo(0, 0.35);
                shape.bezierCurveTo(0.35, 0.35, 0.55, 0.15, 0.55, -0.05);
                shape.bezierCurveTo(0.55, -0.25, 0.35, -0.45, 0, -0.3);
                shape.bezierCurveTo(-0.35, -0.45, -0.55, -0.25, -0.55, -0.05);
                shape.bezierCurveTo(-0.55, 0.15, -0.35, 0.35, 0, 0.35);

                const extrudeSettings = {
                    steps: 1,
                    depth: depth,
                    bevelEnabled: true,
                    bevelThickness: 0.05,
                    bevelSize: 0.04,
                    bevelSegments: 6
                };
                const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                geometry.computeVertexNormals();
                geometry.center();
                geometry.scale(scale, scale, scale);
                geometry.rotateX(-0.2);
                geometry.rotateZ(0.1);
                return geometry;
            }

            // Physics world for floating hearts
            class HeartPhysicsWorld {
                constructor(config) {
                    this.config = config;
                    this.count = config.count || 158;
                    this.positionData = new Float32Array(3 * this.count);
                    this.velocityData = new Float32Array(3 * this.count);
                    this.sizeData = new Float32Array(this.count);
                    this.rotationData = new Float32Array(3 * this.count);
                    this.center = new THREE.Vector3(0, 0.5, 0);
                    this.init();
                }

                init() {
                    const { maxX = 7.5, maxY = 5.8, maxZ = 4.5, minSize = 0.68, maxSize = 1.1 } = this.config;
                    for (let i = 0; i < this.count; i++) {
                        this.positionData[3 * i] = THREE.MathUtils.randFloatSpread(2 * maxX);
                        this.positionData[3 * i + 1] = THREE.MathUtils.randFloat(0.8, maxY - 0.8);
                        this.positionData[3 * i + 2] = THREE.MathUtils.randFloatSpread(2 * maxZ);
                        const sz = THREE.MathUtils.lerp(minSize, maxSize, Math.random());
                        this.sizeData[i] = sz;
                        this.rotationData[3 * i] = Math.random() * Math.PI * 2;
                        this.rotationData[3 * i + 1] = Math.random() * Math.PI * 2;
                        this.rotationData[3 * i + 2] = Math.random() * Math.PI * 2;
                        this.velocityData[3 * i] = (Math.random() - 0.5) * 0.08;
                        this.velocityData[3 * i + 1] = (Math.random() - 0.5) * 0.07 + 0.02;
                        this.velocityData[3 * i + 2] = (Math.random() - 0.5) * 0.08;
                    }
                }

                update(delta, followCursor = true, cursorTarget = null) {
                    const { gravity = 0.32, friction = 0.993, wallBounce = 0.94, maxVelocity = 0.21, maxX = 7.2, maxY = 5.5, maxZ = 4.8 } = this.config;
                    const count = this.count;
                    let startIdx = 0;
                    if (followCursor && cursorTarget) {
                        const leadPos = new THREE.Vector3().fromArray(this.positionData, 0);
                        leadPos.lerp(cursorTarget, 0.14);
                        leadPos.toArray(this.positionData, 0);
                        this.velocityData[0] *= 0.95;
                        this.velocityData[1] *= 0.95;
                        this.velocityData[2] *= 0.95;
                        startIdx = 1;
                    } else {
                        startIdx = 0;
                    }

                    const dt = Math.min(delta, 0.033);
                    for (let i = startIdx; i < count; i++) {
                        const base = 3 * i;
                        let px = this.positionData[base];
                        let py = this.positionData[base + 1];
                        let pz = this.positionData[base + 2];
                        let vx = this.velocityData[base];
                        let vy = this.velocityData[base + 1];
                        let vz = this.velocityData[base + 2];
                        const sz = this.sizeData[i] * 0.55;

                        vy -= dt * gravity * (0.7 + sz * 0.3);
                        vx *= friction;
                        vy *= friction;
                        vz *= friction;

                        let speed = Math.hypot(vx, vy, vz);
                        if (speed > maxVelocity) {
                            const scaleLim = maxVelocity / speed;
                            vx *= scaleLim;
                            vy *= scaleLim;
                            vz *= scaleLim;
                        }

                        px += vx * dt;
                        py += vy * dt;
                        pz += vz * dt;

                        // Heart-to-heart collisions
                        for (let j = i + 1; j < count; j++) {
                            const jBase = 3 * j;
                            const ox = this.positionData[jBase];
                            const oy = this.positionData[jBase + 1];
                            const oz = this.positionData[jBase + 2];
                            const dx = px - ox, dy = py - oy, dz = pz - oz;
                            const dist = Math.hypot(dx, dy, dz);
                            const sumRad = sz + this.sizeData[j] * 0.55;
                            if (dist < sumRad && dist > 0.01) {
                                const overlap = sumRad - dist;
                                const nx = dx / dist, ny = dy / dist, nz = dz / dist;
                                const correction = 0.5 * overlap;
                                px += nx * correction;
                                py += ny * correction;
                                pz += nz * correction;
                                this.positionData[jBase] -= nx * correction;
                                this.positionData[jBase + 1] -= ny * correction;
                                this.positionData[jBase + 2] -= nz * correction;
                                const relVx = this.velocityData[jBase] - vx;
                                const relVy = this.velocityData[jBase + 1] - vy;
                                const relVz = this.velocityData[jBase + 2] - vz;
                                const dot = relVx * nx + relVy * ny + relVz * nz;
                                if (dot < 0) {
                                    const imp = dot * 0.45;
                                    vx += imp * nx;
                                    vy += imp * ny;
                                    vz += imp * nz;
                                    this.velocityData[jBase] -= imp * nx;
                                    this.velocityData[jBase + 1] -= imp * ny;
                                    this.velocityData[jBase + 2] -= imp * nz;
                                }
                            }
                        }

                        // Follower heart interaction
                        if (followCursor && startIdx === 1 && i > 0) {
                            const fx = this.positionData[0], fy = this.positionData[1], fz = this.positionData[2];
                            const fRad = this.sizeData[0] * 0.55;
                            const dx = px - fx, dy = py - fy, dz = pz - fz;
                            const dist = Math.hypot(dx, dy, dz);
                            const sumRad = sz + fRad;
                            if (dist < sumRad) {
                                const overlap = sumRad - dist;
                                const nx = dx / (dist + 0.001), ny = dy / (dist + 0.001), nz = dz / (dist + 0.001);
                                px += nx * overlap * 0.6;
                                py += ny * overlap * 0.6;
                                pz += nz * overlap * 0.6;
                                vx += nx * 0.12;
                                vy += ny * 0.12;
                                vz += nz * 0.12;
                            }
                        }

                        // Boundaries
                        if (px + sz > maxX) { px = maxX - sz; vx = -vx * wallBounce; }
                        if (px - sz < -maxX) { px = -maxX + sz; vx = -vx * wallBounce; }
                        if (py + sz > maxY) { py = maxY - sz; vy = -vy * wallBounce; }
                        if (py - sz < -maxY + 0.6) { py = -maxY + sz + 0.6; vy = -vy * wallBounce; }
                        if (pz + sz > maxZ) { pz = maxZ - sz; vz = -vz * wallBounce; }
                        if (pz - sz < -maxZ) { pz = -maxZ + sz; vz = -vz * wallBounce; }

                        this.positionData[base] = px;
                        this.positionData[base + 1] = py;
                        this.positionData[base + 2] = pz;
                        this.velocityData[base] = vx;
                        this.velocityData[base + 1] = vy;
                        this.velocityData[base + 2] = vz;

                        this.rotationData[base] += (vx * 0.8) * dt;
                        this.rotationData[base + 1] += (vy * 0.6) * dt;
                        this.rotationData[base + 2] += (vz * 0.7) * dt;
                    }
                }
            }

            const heartGeo = createHeartGeometry(0.6, 0.7);
            const heartMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xcc8899,
                emissive: 0x442233,
                emissiveIntensity: 0.18,
                metalness: 0.55,
                roughness: 0.28,
                clearcoat: 0.85,
                clearcoatRoughness: 0.2,
            });

            const HEART_COUNT = 158;
            const heartColors = [0xcc7b8c, 0xb85c6f, 0xdd9bb0, 0xc97e92, 0xaa5e72, 0xe6aabb, 0xffb7c5];
            const instances = new THREE.InstancedMesh(heartGeo, heartMaterial, HEART_COUNT);
            const dummyObj = new THREE.Object3D();

            for (let i = 0; i < HEART_COUNT; i++) {
                const color = heartColors[i % heartColors.length];
                instances.setColorAt(i, new THREE.Color(color));
            }
            instances.instanceColor.needsUpdate = true;
            scene.add(instances);

            const heartPhysics = new HeartPhysicsWorld({
                count: HEART_COUNT,
                maxX: 7.2,
                maxY: 5.5,
                maxZ: 4.8,
                minSize: 0.68,
                maxSize: 1.1,
                gravity: 0.32,
                friction: 0.993,
                wallBounce: 0.94,
                maxVelocity: 0.21
            });

            // Lights
            const ambientLight = new THREE.AmbientLight(0xffeef0, 0.65);
            scene.add(ambientLight);
            const keyLight = new THREE.PointLight(0xffaa99, 1.3);
            keyLight.position.set(3, 4, 4);
            scene.add(keyLight);
            const fillHeartLight = new THREE.PointLight(0xd47b8a, 0.9);
            fillHeartLight.position.set(-2, 3, 5);
            scene.add(fillHeartLight);
            const rimLight = new THREE.PointLight(0xffccdd, 0.7);
            rimLight.position.set(1, 2, -5);
            scene.add(rimLight);

            // Cursor interaction
            const raycaster = new THREE.Raycaster();
            const cursorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const cursorWorld = new THREE.Vector3(0, 2, 0);
            const mouseVec = new THREE.Vector2();

            const updateCursor = (clientX, clientY) => {
                const rect = renderer.domElement.getBoundingClientRect();
                mouseVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
                mouseVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;
                raycaster.setFromCamera(mouseVec, camera);
                const intersectPoint = new THREE.Vector3();
                if (raycaster.ray.intersectPlane(cursorPlane, intersectPoint)) {
                    cursorWorld.copy(intersectPoint);
                    cursorWorld.z = 0;
                    cursorWorld.x = Math.min(Math.max(cursorWorld.x, -6.2), 6.2);
                    cursorWorld.y = Math.min(Math.max(cursorWorld.y, 1.2), 5.2);
                }
            };

            const handleMouseMove = (e) => updateCursor(e.clientX, e.clientY);
            const handleTouchMove = (e) => { if (e.touches.length) updateCursor(e.touches[0].clientX, e.touches[0].clientY); };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchstart', handleTouchMove);

            let lastTimestamp = performance.now();
            let followEnabled = true;

            // Animation loop
            function animateHearts() {
                const now = performance.now();
                let delta = Math.min(0.033, (now - lastTimestamp) / 1000);
                lastTimestamp = now;
                if (delta < 0.008) delta = 0.016;

                heartPhysics.update(delta, followEnabled, followEnabled ? cursorWorld : null);

                for (let i = 0; i < HEART_COUNT; i++) {
                    const px = heartPhysics.positionData[3 * i];
                    const py = heartPhysics.positionData[3 * i + 1];
                    const pz = heartPhysics.positionData[3 * i + 2];
                    const scaleVal = heartPhysics.sizeData[i];
                    dummyObj.position.set(px, py, pz);
                    dummyObj.scale.set(scaleVal, scaleVal, scaleVal);
                    dummyObj.rotation.x = heartPhysics.rotationData[3 * i] * 0.5;
                    dummyObj.rotation.y = heartPhysics.rotationData[3 * i + 1] * 0.4;
                    dummyObj.rotation.z = heartPhysics.rotationData[3 * i + 2] * 0.6;
                    dummyObj.updateMatrix();
                    instances.setMatrixAt(i, dummyObj.matrix);
                }
                instances.instanceMatrix.needsUpdate = true;

                const breath = Math.sin(Date.now() * 0.002) * 0.03;
                camera.position.x += (0 - camera.position.x) * 0.04;
                camera.position.y += (2.4 + breath - camera.position.y) * 0.025;
                camera.lookAt(0, 2.3, 0);

                keyLight.intensity = 1.25 + Math.sin(Date.now() * 0.003) * 0.1;
                fillHeartLight.position.x = -2 + Math.sin(Date.now() * 0.007) * 0.3;

                renderer.render(scene, camera);
                requestAnimationFrame(animateHearts);
            }

            animateHearts();

            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                heartPhysics.config.maxX = 7.2;
                heartPhysics.config.maxY = 5.5;
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchstart', handleTouchMove);
                window.removeEventListener('resize', handleResize);
                renderer.dispose();
                if (container && renderer.domElement) {
                    container.removeChild(renderer.domElement);
                }
            };
        };

        initThree();
    }, []);

    const inp = (hasError, hasButton = false) => ({
        width: '100%',
        paddingLeft: 44,
        paddingRight: hasButton ? 46 : 42,
        paddingTop: 14,
        paddingBottom: 14,
        border: `1.5px solid ${hasError ? '#E85D75' : '#E8D0C4'}`,
        borderRadius: 12,
        fontSize: 14,
        color: '#3B2A25',
        fontFamily: "'DM Sans', sans-serif",
        background: 'rgba(255,252,250,0.85)',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
        backdropFilter: 'blur(4px)',
    });

    const Field = ({ icon: Icon, label, error: fieldError, optional, children }) => (
        <div style={{ marginBottom: 18 }}>
            <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#A07060',
                marginBottom: 8,
                fontFamily: "'DM Sans', sans-serif",
            }}>
                {label}
                {optional && <span style={{ color: '#C9A27E', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}> (optional)</span>}
            </label>
            <div style={{ position: 'relative' }}>
                <Icon size={16} color={fieldError ? '#E85D75' : '#C9A27E'} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                {children}
            </div>
            <AnimatePresence>
                {fieldError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ color: '#E85D75', fontSize: 11, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>
                        {fieldError}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif",
        }}>
            {/* 3D Floating Hearts Canvas Container */}
            <div ref={canvasContainerRef} style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'auto'
            }} />

            {/* Soft overlay for readability */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 1,
                background: 'radial-gradient(circle at 30% 20%, rgba(251,249,245,0.25) 0%, rgba(251,249,245,0.05) 100%)',
                pointerEvents: 'none',
            }} />

            {/* Floating emojis */}
            <div style={{
                position: 'absolute', top: '20%', right: '12%', zIndex: 1, pointerEvents: 'none',
                fontSize: 48, opacity: 0.6, animation: 'float 6s ease-in-out infinite'
            }}>💖</div>
            <div style={{
                position: 'absolute', bottom: '20%', left: '8%', zIndex: 1, pointerEvents: 'none',
                fontSize: 40, opacity: 0.6, animation: 'float 6s ease-in-out infinite 2s'
            }}>🍰</div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                input:focus { border-color: #D4785A !important; box-shadow: 0 0 0 3px rgba(212,120,90,0.13) !important; background: rgba(255,255,255,0.98) !important; }
                * { box-sizing: border-box; }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(8deg); }
                }
            `}</style>

            {/* Auth Card */}
            <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: 'relative', zIndex: 2,
                    width: '100%', maxWidth: 420,
                    background: 'rgba(255, 251, 248, 0.82)',
                    backdropFilter: 'blur(22px) saturate(1.4)',
                    WebkitBackdropFilter: 'blur(22px) saturate(1.4)',
                    borderRadius: 32,
                    boxShadow: '0 8px 48px rgba(160,100,70,0.13), 0 2px 12px rgba(160,100,70,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                    border: '1px solid rgba(255,235,220,0.7)',
                    padding: '36px 34px 32px',
                    margin: '20px',
                }}
            >
                {/* Logo & heading */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ fontSize: 42, display: 'inline-block', marginBottom: 8 }}
                    >🎂</motion.div>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 30, fontWeight: 700, color: '#3B2A25',
                        margin: '0 0 6px', letterSpacing: '-0.01em',
                    }}>
                        LoveBakes
                    </h1>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={mode}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                            style={{ fontSize: 13.5, color: '#B08070', margin: 0, fontStyle: 'italic' }}
                        >
                            {mode === 'login' ? 'Welcome back, sweet tooth 🍰' : 'Create your account & indulge'}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Tab Toggle */}
                <div style={{
                    display: 'flex', background: 'rgba(201,162,126,0.18)',
                    borderRadius: 50, padding: 4, marginBottom: 26, position: 'relative',
                }}>
                    {[['login', 'Login'], ['register', 'Sign Up']].map(([m, label]) => (
                        <button key={m} onClick={() => switchMode(m)} style={{
                            flex: 1, position: 'relative', zIndex: 1,
                            padding: '12px 0', background: 'none', border: 'none',
                            borderRadius: 50, fontSize: 13, fontWeight: 700,
                            cursor: 'pointer', color: mode === m ? 'white' : '#A07060',
                            transition: 'color 0.25s', fontFamily: "'DM Sans', sans-serif",
                        }}>
                            {mode === m && (
                                <motion.div
                                    layoutId="tab-bg"
                                    style={{
                                        position: 'absolute', inset: 0, borderRadius: 50,
                                        background: 'linear-gradient(135deg, #E8866A, #D4605A)',
                                        boxShadow: '0 3px 14px rgba(212,96,90,0.38)', zIndex: -1,
                                    }}
                                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                />
                            )}
                            {label}
                        </button>
                    ))}
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 18 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            style={{ background: '#FFF0EE', border: '1px solid #FCCACA', borderRadius: 12, padding: '12px 15px', fontSize: 13, color: '#C0392B' }}
                        >
                            ⚠️ {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AnimatePresence>
                        {mode === 'register' && (
                            <motion.div
                                key="extra"
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}
                            >
                                <Field icon={User} label="Full Name" error={errors.name && 'Name is required'}>
                                    <input {...register('name', { required: mode === 'register' })} placeholder="Your full name" style={inp(errors.name, false)} />
                                </Field>
                                <Field icon={Phone} label="Phone" optional>
                                    <input {...register('phone')} placeholder="+91 XXXXX XXXXX" style={inp(false, false)} />
                                </Field>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Field icon={Mail} label="Email" error={errors.email && 'Valid email required'}>
                        <input
                            {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                            type="email"
                            placeholder="you@email.com"
                            style={inp(errors.email, false)}
                        />
                    </Field>

                    <Field icon={Lock} label="Password" error={errors.password && 'Minimum 6 characters'}>
                        <input
                            {...register('password', { required: true, minLength: 6 })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min. 6 characters"
                            style={inp(errors.password, true)}
                        />
                        <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', padding: 4, zIndex: 2,
                        }}>
                            {showPassword ? <EyeOff size={16} color="#C9A27E" /> : <Eye size={16} color="#C9A27E" />}
                        </button>
                    </Field>

                    {mode === 'login' && (
                        <div style={{ textAlign: 'right', marginTop: -10, marginBottom: 18 }}>
                            <span style={{ fontSize: 12, color: '#D4705A', fontWeight: 600, cursor: 'pointer' }}>
                                Forgot password?
                            </span>
                        </div>
                    )}

                    {/* Submit */}
                    <motion.button
                        type="submit" disabled={loading}
                        whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!loading ? { scale: 0.97 } : {}}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            padding: '16px', borderRadius: 14, border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            background: loading
                                ? 'rgba(212,120,90,0.45)'
                                : 'linear-gradient(135deg, #E8866A 0%, #D4605A 100%)',
                            color: 'white', fontSize: 14.5, fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                            boxShadow: loading ? 'none' : '0 6px 24px rgba(212,96,90,0.38)',
                            transition: 'all 0.2s', marginTop: 8,
                            letterSpacing: '0.01em',
                        }}
                    >
                        {loading
                            ? <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                                Please wait...
                            </motion.span>
                            : <>{mode === 'login' ? 'Login to LoveBakes' : 'Create My Account'} <ArrowRight size={16} /></>
                        }
                    </motion.button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #E8CABB)' }} />
                    <span style={{ fontSize: 11, color: '#C9A27E', fontWeight: 600, letterSpacing: '0.12em' }}>OR</span>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, #E8CABB)' }} />
                </div>

                {/* Google */}
                <button
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '14px', borderRadius: 14,
                        border: '1.5px solid rgba(200,170,150,0.5)',
                        background: 'rgba(255,252,250,0.7)',
                        backdropFilter: 'blur(8px)',
                        cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
                        color: '#3B2A25', fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4705A'; e.currentTarget.style.background = 'rgba(255,252,250,0.95)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,170,150,0.5)'; e.currentTarget.style.background = 'rgba(255,252,250,0.7)'; }}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                {/* Switch mode */}
                <p style={{ textAlign: 'center', marginTop: 22, marginBottom: 0, fontSize: 13, color: '#B08878' }}>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <span
                        onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                        style={{ color: '#D4605A', fontWeight: 700, cursor: 'pointer' }}
                    >
                        {mode === 'login' ? 'Sign Up' : 'Login'}
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;