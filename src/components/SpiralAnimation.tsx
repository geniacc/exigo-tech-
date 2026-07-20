import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

class Vector2D {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  static random(min: number, max: number): number { return min + Math.random() * (max - min) }
}

class Vector3D {
  public x: number;
  public y: number;
  public z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class AnimationController {
  private timeline: gsap.core.Timeline; 
  public time = 0; 
  public ctx: CanvasRenderingContext2D; 
  public size: number; 
  private stars: Star[] = [];
  
  private readonly changeEventTime = 0.32; 
  public readonly cameraZ = -400; 
  private readonly cameraTravelDistance = 3400; 
  private readonly startDotYOffset = 28; 
  public readonly viewZoom = 100; 
  private readonly numberOfStars = 3500;
  private readonly trailLength = 80;

  public mouseX: number = 9999;
  public mouseY: number = 9999;

  constructor(ctx: CanvasRenderingContext2D, size: number) {
    this.ctx = ctx; 
    this.size = size; 
    this.timeline = gsap.timeline({ repeat: -1 });
    this.setupRandomGenerator(); 
    this.createStars(); 
    this.setupTimeline();
  }

  private setupRandomGenerator() {
    const originalRandom = Math.random;
    const customRandom = () => { 
      let seed = 1234; 
      return () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    };
    Math.random = customRandom(); 
    this.createStars(); 
    Math.random = originalRandom;
  }

  private createStars() { 
    this.stars = [];
    for (let i = 0; i < this.numberOfStars; i++) { 
      this.stars.push(new Star(this.cameraTravelDistance));
    } 
  }

  private setupTimeline() { 
    this.timeline.to(this, { time: 1, duration: 15, repeat: -1, ease: "none", onUpdate: () => this.render() });
  }

  public ease(p: number, g: number): number { return (p < 0.5) ? 0.5 * Math.pow(2 * p, g) : 1 - 0.5 * Math.pow(2 * (1 - p), g); }

  public easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 4.5; if (x <= 0) return 0; if (x >= 1) return 1;
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1;
  }

  public map(value: number, start1: number, stop1: number, start2: number, stop2: number): number { return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)); }
  public constrain(value: number, min: number, max: number): number { return Math.min(Math.max(value, min), max); }
  public lerp(start: number, end: number, t: number): number { return start * (1 - t) + end * t; }

  public spiralPath(p: number): Vector2D {
    p = this.constrain(1.2 * p, 0, 1); 
    p = this.ease(p, 1.8);
    const numberOfSpiralTurns = 6; 
    const theta = 2 * Math.PI * numberOfSpiralTurns * Math.sqrt(p); 
    const r = 170 * Math.sqrt(p);
    return new Vector2D(r * Math.cos(theta), r * Math.sin(theta) + this.startDotYOffset);
  }

  public rotate(v1: Vector2D, v2: Vector2D, p: number, orientation: boolean): Vector2D {
    const middle = new Vector2D((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
    const dx = v1.x - middle.x; 
    const dy = v1.y - middle.y; 
    const angle = Math.atan2(dy, dx);
    const o = orientation ? -1 : 1; 
    const r = Math.sqrt(dx * dx + dy * dy); 
    const bounce = Math.sin(p * Math.PI) * 0.05 * (1 - p);
    return new Vector2D(
      middle.x + r * (1 + bounce) * Math.cos(angle + o * Math.PI * this.easeOutElastic(p)), 
      middle.y + r * (1 + bounce) * Math.sin(angle + o * Math.PI * this.easeOutElastic(p))
    );
  }

  public showProjectedDot(position: Vector3D, sizeFactor: number, customColor?: string) {
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1);
    const newCameraZ = this.cameraZ + this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance;
    
    if (position.z > newCameraZ) {
      const dotDepthFromCamera = position.z - newCameraZ; 
      let x = this.viewZoom * position.x / dotDepthFromCamera; 
      let y = this.viewZoom * position.y / dotDepthFromCamera;
      
      const distToMouse = Math.hypot(x - this.mouseX, y - this.mouseY);
      if (distToMouse < 140) {
        const force = (140 - distToMouse) / 140;
        x += (x - this.mouseX) * force * 0.25;
        y += (y - this.mouseY) * force * 0.25;
      }

      const sw = 400 * sizeFactor / dotDepthFromCamera;
      this.ctx.fillStyle = customColor || '#6b21a8';
      this.ctx.beginPath(); 
      this.ctx.arc(x, y, Math.max(0.2, sw / 2), 0, Math.PI * 2); 
      this.ctx.fill();
    }
  }

  private drawStartDot() {
    if (this.time > this.changeEventTime) {
      const dy = this.cameraZ * this.startDotYOffset / this.viewZoom;
      const position = new Vector3D(0, dy, this.cameraTravelDistance); 
      this.showProjectedDot(position, 2.5, '#06b6d4');
    }
  }

  public render() {
    const ctx = this.ctx; 
    if (!ctx) return;
  
    // Radial Vignette Fill
    const halfSize = this.size / 2;
    const bgGradient = ctx.createRadialGradient(
      halfSize, halfSize, 100, 
      halfSize, halfSize, halfSize * 0.95
    );
    
    bgGradient.addColorStop(0, '#ffffff');      
    bgGradient.addColorStop(0.65, '#f8fafc');   
    bgGradient.addColorStop(1, '#e2e8f0');      

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, this.size, this.size);
    
    ctx.save(); 
    ctx.translate(halfSize, halfSize);
  
    const t1 = this.constrain(this.map(this.time, 0, this.changeEventTime + 0.25, 0, 1), 0, 1);
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1);
  
    ctx.rotate(-Math.PI * this.ease(t2, 2.7)); 
  
    ctx.globalCompositeOperation = 'source-over';
    this.drawTrail(t1);
  
    for (const star of this.stars) { 
      star.render(t1, this); 
    }
  
    this.drawStartDot(); 
    ctx.restore();
  }

  private drawTrail(t1: number) {
    for (let i = 0; i < this.trailLength; i++) {
      const f = this.map(i, 0, this.trailLength, 1.1, 0.1);
      const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f;

      const pathTime = t1 - 0.00015 * i; 
      const position = this.spiralPath(pathTime); 
      const basePos = position; 
      const offset = new Vector2D(position.x + 5, position.y + 5);
      const rotated = this.rotate(basePos, offset, Math.sin(this.time * Math.PI * 2) * 0.5 + 0.5, i % 2 === 0);

      this.ctx.fillStyle = 'rgba(30, 58, 138, 0.25)';
      this.ctx.beginPath(); 
      this.ctx.arc(rotated.x, rotated.y, sw / 2, 0, Math.PI * 2); 
      this.ctx.fill();
    }
  }

  public pause() { this.timeline.pause(); }
  public resume() { this.timeline.play(); }
  public destroy() { this.timeline.kill(); }
}

class Star {
  private dx: number; 
  private dy: number; 
  private spiralLocation: number; 
  private strokeWeightFactor: number; 
  private z: number; 
  private angle: number; 
  private distance: number; 
  private rotationDirection: number; 
  private expansionRate: number; 
  private finalScale: number;

  constructor(cameraTravelDistance: number) {
    this.angle = Math.random() * Math.PI * 2; 
    this.distance = 4 * Math.random() + 2; 
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.expansionRate = 0.2 + Math.random() * 0.3; 
    this.finalScale = 0.7 + Math.random() * 0.6;
    this.dx = this.distance * Math.cos(this.angle); 
    this.dy = this.distance * Math.sin(this.angle);
    this.spiralLocation = (1 - Math.pow(1 - Math.random(), 3.0)) / 1.3;
    
    this.z = Vector2D.random(0.1 * cameraTravelDistance, 0.6 * cameraTravelDistance);
    const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
    this.z = lerp(this.z, cameraTravelDistance / 2, 0.8 * this.spiralLocation); 
    this.strokeWeightFactor = Math.pow(Math.random(), 2.0);
  }

  render(p: number, controller: AnimationController) {
    const spiralPos = controller.spiralPath(this.spiralLocation); 
    const q = p - this.spiralLocation;

    if (q > 0) {
      const displacementProgress = controller.constrain(4 * q, 0, 1);
      const linearEasing = displacementProgress; 
      const elasticEasing = controller.easeOutElastic(displacementProgress); 
      const powerEasing = Math.pow(displacementProgress, 2);
      
      let easing;
      if (displacementProgress < 0.3) { 
        easing = controller.lerp(linearEasing, powerEasing, displacementProgress / 0.3); 
      } else if (displacementProgress < 0.7) { 
        const t = (displacementProgress - 0.3) / 0.4; 
        easing = controller.lerp(powerEasing, elasticEasing, t); 
      } else { 
        easing = elasticEasing; 
      }

      let screenX, screenY;
      if (displacementProgress < 0.3) {
        screenX = controller.lerp(spiralPos.x, spiralPos.x + this.dx * 0.1, easing / 0.3); 
        screenY = controller.lerp(spiralPos.y, spiralPos.y + this.dy * 0.1, easing / 0.3);
      } else if (displacementProgress < 0.7) {
        const midProgress = (displacementProgress - 0.3) / 0.4; 
        const curveStrength = Math.sin(midProgress * Math.PI) * this.rotationDirection * 0.2;
        const baseX = spiralPos.x + this.dx * 0.1; 
        const baseY = spiralPos.y + this.dy * 0.1; 
        const targetX = spiralPos.x + this.dx * 0.3; 
        const targetY = spiralPos.y + this.dy * 0.3;
        const perpX = -this.dy * 0.1 * curveStrength; 
        const perpY = this.dx * 0.1 * curveStrength;
        screenX = controller.lerp(baseX, targetX, midProgress) + perpX * midProgress; 
        screenY = controller.lerp(baseY, targetY, midProgress) + perpY * midProgress;
      } else {
        const finalProgress = (displacementProgress - 0.7) / 0.3; 
        const baseX = spiralPos.x + this.dx * 0.3; 
        const baseY = spiralPos.y + this.dy * 0.3;
        
        const targetDistance = this.distance * this.expansionRate * 0.3; 
        const spiralTurns = 0.3 * this.rotationDirection; 
        const spiralAngle = this.angle + spiralTurns * finalProgress * Math.PI;
        const targetX = spiralPos.x + targetDistance * Math.cos(spiralAngle); 
        const targetY = spiralPos.y + targetDistance * Math.sin(spiralAngle);
        screenX = controller.lerp(baseX, targetX, finalProgress); 
        screenY = controller.lerp(baseY, targetY, finalProgress);
      }

      const vx = (this.z - controller.cameraZ) * screenX / controller.viewZoom; 
      const vy = (this.z - controller.cameraZ) * screenY / controller.viewZoom; 
      const position = new Vector3D(vx, vy, this.z);

      let sizeMultiplier = 1.0;
      if (displacementProgress < 0.6) { 
        sizeMultiplier = 1.0 + displacementProgress * 0.2; 
      } else { 
        const t = (displacementProgress - 0.6) / 0.4; 
        sizeMultiplier = 1.2 * (1.0 - t) + this.finalScale * t; 
      }

      const dotSize = 8.5 * this.strokeWeightFactor * sizeMultiplier;

      const depthRatio = controller.constrain((this.z - controller.cameraZ) / 3400, 0, 1);
      const hue = 210 + depthRatio * 25; 
      const lightness = 30 + (1 - depthRatio) * 20; 
      const particleColor = `hsla(${hue}, 95%, ${lightness}%, ${0.5 + (1 - depthRatio) * 0.45})`;

      controller.showProjectedDot(position, dotSize, particleColor);
    }
  }
}

export function SpiralAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<AnimationController | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current; 
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d'); 
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;

    const handleResize = () => {
      const width = window.innerWidth; 
      const height = window.innerHeight; 
      const size = Math.max(width, height);
      
      canvas.width = size * dpr; 
      canvas.height = size * dpr; 
      canvas.style.width = `${width}px`; 
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
      
      if (animationRef.current) animationRef.current.destroy();
      animationRef.current = new AnimationController(ctx, size);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!animationRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      animationRef.current.mouseX = e.clientX - rect.left - centerX;
      animationRef.current.mouseY = e.clientY - rect.top - centerY;
    };

    const handleScroll = () => {
      if (!animationRef.current) return;
      if (window.scrollY > window.innerHeight) {
        animationRef.current.pause();
      } else {
        animationRef.current.resume();
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => { 
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) animationRef.current.destroy();
    }
  }, [])

  return (
    <div className="hero-bg-grid" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  )
}