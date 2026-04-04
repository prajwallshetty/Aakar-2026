"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";
import { ANIME_COLORS } from "@/components/(User)/AnimeTheme/AnimeThemeComponents";
import { cinzelFont } from "@/lib/font";

type GL = Renderer["gl"];

/* ─── Event card data (same as EventCards.tsx) ─────────────────── */
const EVENT_ITEMS = [
  { image: "/events/9.png",  text: "CULTURAL" },
  { image: "/events/12.png", text: "TECHNICAL" },
  { image: "/events/13.png", text: "GAMING" },
  { image: "/events/11.png", text: "SPECIAL" },
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
  canvas.width  = tw + 20;
  canvas.height = fh + 20;
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
  constructor(
    private gl: GL,
    private plane: Mesh,
    text: string,
    textColor: string,
    font: string
  ) {
    const { texture, width, height } = createTextTexture(gl, text, font, textColor);
    const geo = new Plane(gl);
    const prog = new Program(gl, {
      vertex: `attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragment: `precision highp float;uniform sampler2D tMap;varying vec2 vUv;void main(){vec4 c=texture2D(tMap,vUv);if(c.a<0.1)discard;gl_FragColor=c;}`,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(gl, { geometry: geo, program: prog });
    const aspect = width / height;
    const th = plane.scale.y * 0.13;
    this.mesh.scale.set(th * aspect, th, 1);
    this.mesh.position.y = -plane.scale.y * 0.5 - th * 0.5 - 0.05;
    this.mesh.setParent(plane);
  }
}

/* ─── Media (one card) ──────────────────────────────────────────── */
interface MediaProps {
  geometry: Plane; gl: GL; image: string; index: number; length: number;
  renderer: Renderer; scene: Transform; screen: { width: number; height: number };
  text: string; viewport: { width: number; height: number };
  bend: number; textColor: string; borderRadius: number; font: string;
}

class Media {
  extra = 0; speed = 0; isBefore = false; isAfter = false;
  program!: Program; plane!: Mesh; title!: Title;
  scale!: number; padding!: number; width!: number; widthTotal!: number; x!: number;

  constructor(private props: MediaProps) {
    autoBind(this);
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const tex = new Texture(this.props.gl, { generateMipmaps: true });
    this.program = new Program(this.props.gl, {
      depthTest: false, depthWrite: false,
      vertex: `precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform float uTime;uniform float uSpeed;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z=(sin(p.x*4.0+uTime)*1.5+cos(p.y*2.0+uTime)*1.5)*(0.1+uSpeed*0.5);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
      fragment: `precision highp float;uniform vec2 uImageSizes;uniform vec2 uPlaneSizes;uniform sampler2D tMap;uniform float uBorderRadius;varying vec2 vUv;float rSDF(vec2 p,vec2 b,float r){vec2 d=abs(p)-b;return length(max(d,vec2(0.0)))+min(max(d.x,d.y),0.0)-r;}void main(){vec2 ratio=vec2(min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y),1.0),min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x),1.0));vec2 uv=vec2(vUv.x*ratio.x+(1.0-ratio.x)*0.5,vUv.y*ratio.y+(1.0-ratio.y)*0.5);vec4 color=texture2D(tMap,uv);float d=rSDF(vUv-0.5,vec2(0.5-uBorderRadius),uBorderRadius);float alpha=1.0-smoothstep(-0.002,0.002,d);gl_FragColor=vec4(color.rgb,alpha);}`,
      uniforms: {
        tMap: { value: tex },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.props.borderRadius },
      },
      transparent: true,
    });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.props.image;
    img.onload = () => {
      tex.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.props.gl, { geometry: this.props.geometry, program: this.program });
    this.plane.setParent(this.props.scene);
  }

  createTitle() {
    this.title = new Title(
      this.props.gl, this.plane,
      this.props.text, this.props.textColor, this.props.font
    );
  }

  update(scroll: { current: number; last: number }, direction: "right" | "left") {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.props.viewport.width / 2;

    if (this.props.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B = Math.abs(this.props.bend);
      const R = (H * H + B * B) / (2 * B);
      const ex = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - ex * ex);
      if (this.props.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(ex / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(ex / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const off = this.plane.scale.x / 2;
    const voff = this.props.viewport.width / 2;
    this.isBefore = this.plane.position.x + off < -voff;
    this.isAfter  = this.plane.position.x - off > voff;
    if (direction === "right" && this.isBefore) { this.extra -= this.widthTotal; this.isBefore = this.isAfter = false; }
    if (direction === "left"  && this.isAfter)  { this.extra += this.widthTotal; this.isBefore = this.isAfter = false; }
  }

  onResize({ screen, viewport }: { screen?: { width: number; height: number }; viewport?: { width: number; height: number } } = {}) {
    if (screen)   this.props.screen   = screen;
    if (viewport) this.props.viewport = viewport;
    this.scale = this.props.screen.height / 1500;
    this.plane.scale.y = (this.props.viewport.height * (900 * this.scale)) / this.props.screen.height;
    this.plane.scale.x = (this.props.viewport.width  * (700 * this.scale)) / this.props.screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding    = 2;
    this.width      = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.props.length;
    this.x          = this.width * this.props.index;
  }
}

/* ─── App ───────────────────────────────────────────────────────── */
class App {
  scroll = { ease: 0.05, current: 0, target: 0, last: 0, position: 0 };
  medias: Media[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  renderer!: Renderer; gl!: GL;
  camera!: Camera; scene!: Transform;
  planeGeometry!: Plane;
  raf = 0;
  isDown = false; start = 0;
  onCheckDebounce: () => void;

  private _onResize!:     () => void;
  private _onWheel!:      (e: Event) => void;
  private _onTouchDown!:  (e: MouseEvent | TouchEvent) => void;
  private _onTouchMove!:  (e: MouseEvent | TouchEvent) => void;
  private _onTouchUp!:    () => void;

  constructor(
    private container: HTMLElement,
    private items: { image: string; text: string }[],
    private bend: number,
    private textColor: string,
    private borderRadius: number,
    private font: string,
    private scrollSpeed: number,
  ) {
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias();
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
    /* duplicate items for seamless loop */
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

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    this.scroll.target = this.scroll.position + (this.start - x) * (this.scrollSpeed * 0.025);
  }

  onTouchUp() { this.isDown = false; this.onCheck(); }

  onWheel(e: Event) {
    const we = e as WheelEvent;
    const d = we.deltaY || (we as any).wheelDelta;
    this.scroll.target += (d > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
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
    const h = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.viewport = { width: h * this.camera.aspect, height: h };
    this.medias.forEach((m) => m.onResize({ screen: this.screen, viewport: this.viewport }));
  }

  update() {
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
    this._onTouchDown = this.onTouchDown.bind(this);
    this._onTouchMove = this.onTouchMove.bind(this);
    this._onTouchUp   = this.onTouchUp.bind(this);
    window.addEventListener("resize",     this._onResize);
    window.addEventListener("wheel",      this._onWheel);
    window.addEventListener("mousedown",  this._onTouchDown);
    window.addEventListener("mousemove",  this._onTouchMove);
    window.addEventListener("mouseup",    this._onTouchUp);
    window.addEventListener("touchstart", this._onTouchDown);
    window.addEventListener("touchmove",  this._onTouchMove);
    window.addEventListener("touchend",   this._onTouchUp);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize",     this._onResize);
    window.removeEventListener("wheel",      this._onWheel);
    window.removeEventListener("mousedown",  this._onTouchDown);
    window.removeEventListener("mousemove",  this._onTouchMove);
    window.removeEventListener("mouseup",    this._onTouchUp);
    window.removeEventListener("touchstart", this._onTouchDown);
    window.removeEventListener("touchmove",  this._onTouchMove);
    window.removeEventListener("touchend",   this._onTouchUp);
    const canvas = this.renderer.gl.canvas as HTMLCanvasElement;
    canvas.parentNode?.removeChild(canvas);
  }
}

/* ─── React Component ───────────────────────────────────────────── */
export default function EventCircularGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const app = new App(
      containerRef.current,
      EVENT_ITEMS,
      /* bend */        3,
      /* textColor */   ANIME_COLORS.text,
      /* borderRadius */ 0.05,
      /* font */        `bold 30px 'Bebas Neue', sans-serif`,
      /* scrollSpeed */ 2,
    );
    return () => app.destroy();
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        padding: "clamp(3.5rem,9vh,6rem) 0 clamp(4rem,10vh,7rem)",
      }}
    >
      {/* Heading — matches EventCards.tsx style */}
      <div
        style={{
          position: "relative",
          zIndex: 6,
          textAlign: "center",
          marginBottom: "clamp(1.5rem,4vh,2.5rem)",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 32, height: 4, background: ANIME_COLORS.background, boxShadow: `2px 2px 0 ${ANIME_COLORS.accent}` }} />
          <span
            className={cinzelFont.className}
            style={{
              fontSize: "clamp(0.6rem,1.3vw,0.75rem)",
              letterSpacing: "0.42em",
              color: ANIME_COLORS.text,
            }}
          >
            AAKAR 2026
          </span>
          <div style={{ width: 32, height: 4, background: ANIME_COLORS.background, boxShadow: `2px 2px 0 ${ANIME_COLORS.secondary}` }} />
        </div>

        <h2
          className={cinzelFont.className}
          style={{
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

      {/* OGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full cursor-grab active:cursor-grabbing"
        style={{ height: "clamp(300px,50vh,480px)", position: "relative", zIndex: 6 }}
      />
    </section>
  );
}