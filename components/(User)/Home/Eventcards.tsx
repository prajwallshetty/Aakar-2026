"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ANIME_COLORS } from "@/components/(User)/AnimeTheme/AnimeThemeComponents";

type GL = Renderer["gl"];

/* ─── Event card data with routes ───────────────────────────────── */
const EVENT_ITEMS = [
  { image: "/events/9.png",  text: "CULTURAL",  href: "/events/cultural"  },
  { image: "/events/12.png", text: "TECHNICAL", href: "/events/technical" },
  { image: "/events/13.png", text: "GAMING",    href: "/events/gaming"    },
  { image: "/events/11.png", text: "SPECIAL",   href: "/events/special"   },
];

/* ─── Helpers ───────────────────────────────────────────────────── */
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function autoBind(instance: any) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((k) => {
    if (k !== "constructor" && typeof instance[k] === "function")
      instance[k] = instance[k].bind(instance);
  });
}

function getFontSize(font: string) {
  const m = font.match(/(\d+)px/);
  return m ? parseInt(m[1]) : 30;
}

/* ─── Text label texture ────────────────────────────────────────── */
function createTextTexture(gl: GL, text: string, font: string, color: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  const tw = Math.ceil(ctx.measureText(text).width);
  const fh = Math.ceil(getFontSize(font) * 1.2);
  canvas.width  = tw + 40;
  canvas.height = fh + 40;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new Texture(gl, { generateMipmaps: false });
  tex.image = canvas;
  return { texture: tex, width: canvas.width, height: canvas.height };
}

/* ─── Title mesh ────────────────────────────────────────────────── */
class Title {
  mesh!: Mesh;
  constructor(gl: GL, plane: Mesh, text: string, textColor: string, font: string) {
    const { texture, width, height } = createTextTexture(gl, text, font, textColor);
    const geo  = new Plane(gl);
    const prog = new Program(gl, {
      vertex:   `attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragment: `precision highp float;uniform sampler2D tMap;varying vec2 vUv;void main(){vec4 c=texture2D(tMap,vUv);if(c.a<0.1)discard;gl_FragColor=c;}`,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(gl, { geometry: geo, program: prog });
    const aspect = width / height;
    const th = plane.scale.y * 0.18; /* bigger label */
    this.mesh.scale.set(th * aspect, th, 1);
    this.mesh.position.y = -plane.scale.y * 0.5 - th * 0.5 - 0.08;
    this.mesh.setParent(plane);
  }
}

/* ─── Media (one card) ──────────────────────────────────────────── */
interface MediaProps {
  geometry: Plane; gl: GL; image: string; index: number; length: number;
  renderer: Renderer; scene: Transform;
  screen:   { width: number; height: number };
  text: string;
  viewport: { width: number; height: number };
  bend: number; textColor: string; borderRadius: number; font: string;
}

class Media {
  extra = 0; speed = 0; isBefore = false; isAfter = false;
  program!: Program; plane!: Mesh; title!: Title;
  scale!: number; padding!: number; width!: number; widthTotal!: number; x!: number;

  constructor(private p: MediaProps) {
    autoBind(this);
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const tex = new Texture(this.p.gl, { generateMipmaps: true });
    this.program = new Program(this.p.gl, {
      depthTest: false, depthWrite: false,
      vertex: `precision highp float;
        attribute vec3 position; attribute vec2 uv;
        uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;
        uniform float uTime; uniform float uSpeed;
        varying vec2 vUv;
        void main(){
          vUv = uv;
          vec3 pos = position;
          pos.z = (sin(pos.x * 3.0 + uTime) * 1.0 + cos(pos.y * 1.5 + uTime) * 1.0)
                  * (0.05 + uSpeed * 0.3);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }`,
      fragment: `precision highp float;
        uniform vec2 uImageSizes; uniform vec2 uPlaneSizes;
        uniform sampler2D tMap; uniform float uBorderRadius;
        varying vec2 vUv;
        float rSDF(vec2 p, vec2 b, float r){
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        void main(){
          vec2 ratio = vec2(
            min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y), 1.0),
            min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d     = rSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }`,
      uniforms: {
        tMap:          { value: tex },
        uPlaneSizes:   { value: [0, 0] },
        uImageSizes:   { value: [0, 0] },
        uSpeed:        { value: 0 },
        uTime:         { value: 100 * Math.random() },
        uBorderRadius: { value: this.p.borderRadius },
      },
      transparent: true,
    });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.p.image;
    img.onload = () => {
      tex.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.p.gl, { geometry: this.p.geometry, program: this.program });
    this.plane.setParent(this.p.scene);
  }

  createTitle() {
    this.title = new Title(this.p.gl, this.plane, this.p.text, this.p.textColor, this.p.font);
  }

  update(scroll: { current: number; last: number }, direction: "right" | "left") {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.p.viewport.width / 2;

    if (this.p.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B   = Math.abs(this.p.bend);
      const R   = (H * H + B * B) / (2 * B);
      const ex  = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - ex * ex);
      if (this.p.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(ex / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(ex / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value  += 0.04;
    this.program.uniforms.uSpeed.value  = this.speed;

    const off  = this.plane.scale.x / 2;
    const voff = this.p.viewport.width / 2;
    this.isBefore = this.plane.position.x + off < -voff;
    this.isAfter  = this.plane.position.x - off > voff;
    if (direction === "right" && this.isBefore) { this.extra -= this.widthTotal; this.isBefore = this.isAfter = false; }
    if (direction === "left"  && this.isAfter)  { this.extra += this.widthTotal; this.isBefore = this.isAfter = false; }
  }

  onResize({ screen, viewport }: {
    screen?:   { width: number; height: number };
    viewport?: { width: number; height: number };
  } = {}) {
    if (screen)   this.p.screen   = screen;
    if (viewport) this.p.viewport = viewport;

    this.scale = this.p.screen.height / 1500;

    /* ── BIG cards: 1300 height × 900 width units ── */
    this.plane.scale.y = (this.p.viewport.height * (1300 * this.scale)) / this.p.screen.height;
    this.plane.scale.x = (this.p.viewport.width  * (900  * this.scale)) / this.p.screen.width;

    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

    this.padding    = 1.5;
    this.width      = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.p.length;
    this.x          = this.width * this.p.index;
  }
}

/* ─── App ───────────────────────────────────────────────────────── */
class App {
  scroll = { ease: 0.03, current: 0, target: 0, last: 0, position: 0 };
  medias: Media[] = [];
  screen!:   { width: number; height: number };
  viewport!: { width: number; height: number };
  renderer!: Renderer; gl!: GL;
  camera!: Camera; scene!: Transform;
  planeGeometry!: Plane;
  raf = 0;

  /* drag */
  isDown = false; start = 0; dragDelta = 0;

  /* auto-scroll: tiny increment per frame = very slow */
  autoScrollSpeed = 0.003;
  userInteracting = false;
  resumeTimer: ReturnType<typeof setTimeout> | null = null;

  onCheckDebounce: () => void;

  private _onResize!:    () => void;
  private _onWheel!:     (e: Event) => void;
  private _onMouseDown!: (e: MouseEvent) => void;
  private _onMouseMove!: (e: MouseEvent) => void;
  private _onMouseUp!:   (e: MouseEvent) => void;
  private _onTouchStart!:(e: TouchEvent) => void;
  private _onTouchMove!: (e: TouchEvent) => void;
  private _onTouchEnd!:  (e: TouchEvent) => void;
  private _onClick!:     (e: MouseEvent) => void;

  constructor(
    private container: HTMLElement,
    private items: { image: string; text: string; href: string }[],
    private bend: number,
    private textColor: string,
    private borderRadius: number,
    private font: string,
    private scrollSpeed: number,
    private onNavigate: (href: string) => void,
  ) {
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias();

    if (this.medias[0]) {
      const midPos = this.medias[0].width * Math.floor(this.items.length / 2);
      this.scroll.target = midPos;
      this.scroll.current = midPos;
      this.scroll.last = midPos;
      this.scroll.position = midPos;
    }

    this.update();
    this.addListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() { this.scene = new Transform(); }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 });
  }

  createMedias() {
    const list = [...this.items, ...this.items];
    this.medias = list.map((item, index) =>
      new Media({
        geometry: this.planeGeometry, gl: this.gl,
        image: item.image, index, length: list.length,
        renderer: this.renderer, scene: this.scene,
        screen: this.screen, text: item.text,
        viewport: this.viewport, bend: this.bend,
        textColor: this.textColor, borderRadius: this.borderRadius,
        font: this.font,
      })
    );
  }

  pauseAuto() {
    this.userInteracting = true;
    if (this.resumeTimer) clearTimeout(this.resumeTimer);
    this.resumeTimer = setTimeout(() => { this.userInteracting = false; }, 2500);
  }

  /* ── Mouse ── */
  onMouseDown(e: MouseEvent) {
    this.isDown = true; this.dragDelta = 0;
    this.scroll.position = this.scroll.current;
    this.start = e.clientX;
    this.pauseAuto();
  }
  onMouseMove(e: MouseEvent) {
    if (!this.isDown) return;
    this.dragDelta = this.start - e.clientX;
    this.scroll.target = this.scroll.position + this.dragDelta * (this.scrollSpeed * 0.025);
  }
  onMouseUp(_e: MouseEvent) {
    this.isDown = false;
    this.onCheck();
  }
  onClick(e: MouseEvent) {
    /* only navigate when it was a tap, not a drag */
    if (Math.abs(this.dragDelta) > 6) return;
    this.handleClick(e.clientX, e.clientY);
  }

  /* ── Touch ── */
  onTouchStart(e: TouchEvent) {
    this.isDown = true; this.dragDelta = 0;
    this.scroll.position = this.scroll.current;
    this.start = e.touches[0].clientX;
    this.pauseAuto();
  }
  onTouchMove(e: TouchEvent) {
    if (!this.isDown) return;
    this.dragDelta = this.start - e.touches[0].clientX;
    this.scroll.target = this.scroll.position + this.dragDelta * (this.scrollSpeed * 0.025);
  }
  onTouchEnd(e: TouchEvent) {
    this.isDown = false;
    this.onCheck();
    if (Math.abs(this.dragDelta) <= 6) {
      this.handleClick(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  }

  /* ── Find the card closest to canvas center and navigate ── */
  handleClick(_cx: number, _cy: number) {
    let closest: { idx: number; dist: number } | null = null;
    this.medias.forEach((media, i) => {
      const dist = Math.abs(media.plane.position.x);
      if (!closest || dist < closest.dist) closest = { idx: i, dist };
    });
    if (closest && (closest as any).dist < this.medias[(closest as any).idx].plane.scale.x * 0.8) {
      const realIdx = (closest as any).idx % this.items.length;
      this.onNavigate(this.items[realIdx].href);
    }
  }

  onWheel(e: Event) {
    const we = e as WheelEvent;
    const d  = we.deltaY || (we as any).wheelDelta;
    this.scroll.target += (d > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
    this.pauseAuto();
  }

  onCheck() {
    if (!this.medias[0]) return;
    const w = this.medias[0].width;
    const i = Math.round(Math.abs(this.scroll.target) / w);
    this.scroll.target = this.scroll.target < 0 ? -(w * i) : w * i;
  }

  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const h   = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.viewport = { width: h * this.camera.aspect, height: h };
    this.medias.forEach((m) => m.onResize({ screen: this.screen, viewport: this.viewport }));
  }

  update() {
    /* slow continuous auto-scroll when idle */
    if (!this.userInteracting) {
      this.scroll.target += this.autoScrollSpeed;
    }

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const dir = this.scroll.current > this.scroll.last ? "right" : "left";
    this.medias.forEach((m) => m.update(this.scroll, dir));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = requestAnimationFrame(this.update.bind(this));
  }

  addListeners() {
    this._onResize    = this.onResize.bind(this);
    this._onWheel     = this.onWheel.bind(this);
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseUp   = this.onMouseUp.bind(this);
    this._onTouchStart= this.onTouchStart.bind(this);
    this._onTouchMove = this.onTouchMove.bind(this);
    this._onTouchEnd  = this.onTouchEnd.bind(this);
    this._onClick     = this.onClick.bind(this);

    window.addEventListener("resize", this._onResize);
    window.addEventListener("wheel",  this._onWheel);

    this.container.addEventListener("mousedown",  this._onMouseDown);
    this.container.addEventListener("mousemove",  this._onMouseMove);
    this.container.addEventListener("mouseup",    this._onMouseUp);
    this.container.addEventListener("click",      this._onClick as EventListener);
    this.container.addEventListener("touchstart", this._onTouchStart as EventListener, { passive: true });
    this.container.addEventListener("touchmove",  this._onTouchMove  as EventListener, { passive: true });
    this.container.addEventListener("touchend",   this._onTouchEnd   as EventListener);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    if (this.resumeTimer) clearTimeout(this.resumeTimer);

    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("wheel",  this._onWheel);

    this.container.removeEventListener("mousedown",  this._onMouseDown);
    this.container.removeEventListener("mousemove",  this._onMouseMove);
    this.container.removeEventListener("mouseup",    this._onMouseUp);
    this.container.removeEventListener("click",      this._onClick as EventListener);
    this.container.removeEventListener("touchstart", this._onTouchStart as EventListener);
    this.container.removeEventListener("touchmove",  this._onTouchMove  as EventListener);
    this.container.removeEventListener("touchend",   this._onTouchEnd   as EventListener);

    const canvas = this.renderer.gl.canvas as HTMLCanvasElement;
    canvas.parentNode?.removeChild(canvas);
  }
}

/* ─── React Component ───────────────────────────────────────────── */
export default function EventCircularGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) return;
    const app = new App(
      containerRef.current,
      EVENT_ITEMS,
      /* bend         */ 3,
      /* textColor    */ ANIME_COLORS.text,
      /* borderRadius */ 0.06,
      /* font         */ `bold 52px 'Cinzel', serif`,
      /* scrollSpeed  */ 2,
      /* onNavigate   */ (href: string) => router.push(href),
    );
    return () => app.destroy();
  }, [router]);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        padding: "clamp(3.5rem,9vh,6rem) 0 clamp(4rem,10vh,7rem)",
      }}
    >
      {/* Heading */}
      <div style={{ position: "relative", zIndex: 6, textAlign: "center", marginBottom: "clamp(1.5rem,4vh,2.5rem)" }}>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(3rem,9vw,7rem)",
            lineHeight: 0.9,
            letterSpacing: "0.06em",
            color: ANIME_COLORS.text,
            margin: 0,
          }}
        >
          PICK YOUR<br />BATTLEGROUND
        </h2>
      </div>

      {/* OGL canvas — tall for big cards */}
      <div
        ref={containerRef}
        className="w-full cursor-pointer"
        style={{ height: "clamp(420px,65vh,680px)", position: "relative", zIndex: 6 }}
      />

      {/* hint */}
      <p style={{
        textAlign: "center",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.6rem",
        letterSpacing: "0.3em",
        color: ANIME_COLORS.text,
        opacity: 0.35,
        marginTop: "1rem",
        textTransform: "uppercase",
      }}>
        Click a card to explore · Drag to browse
      </p>
    </section>
  );
}