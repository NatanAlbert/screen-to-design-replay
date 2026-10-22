import { ACCENT_HEX, COLORS, ISSUERS, NETWORKS, getDesign, type CardConfig } from "@/data/designs";

const WIDTH = 856;
const HEIGHT = 540;
const SCALE = 2;
const RADIUS = 38 * SCALE;

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar a arte do cartão."));
    image.src = src;
  });
}

function drawPattern(ctx: CanvasRenderingContext2D, config: CardConfig, accent: string) {
  const w = WIDTH, h = HEIGHT;
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.35;
  if (config.pattern === "lines") {
    for (let i = 0; i < 6; i++) {
      ctx.globalAlpha = 0.35 - i * 0.04;
      ctx.beginPath(); ctx.moveTo((150 + i * 26) / 316 * w, 0);
      ctx.lineTo(w, (120 - i * 18) / 200 * h); ctx.stroke();
    }
  } else if (config.pattern === "geometric") {
    ctx.globalAlpha = 0.18;
    for (let x = w * 0.45; x < w + 30; x += 44) {
      for (let y = -20; y < h + 30; y += 38) {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 22, y + 19);
        ctx.lineTo(x + 22, y + 57); ctx.lineTo(x, y + 76);
        ctx.lineTo(x - 22, y + 57); ctx.lineTo(x - 22, y + 19); ctx.closePath(); ctx.stroke();
      }
    }
    const fade = ctx.createLinearGradient(w * 0.35, 0, w, 0);
    fade.addColorStop(0, "rgba(0,0,0,0)"); fade.addColorStop(1, "rgba(0,0,0,.9)");
    ctx.globalAlpha = 0.35; ctx.fillStyle = fade; ctx.fillRect(0, 0, w, h);
  } else if (config.pattern === "industrial") {
    ctx.globalAlpha = 0.13;
    for (let x = w * 0.62; x < w; x += 24) for (let y = 0; y < h; y += 24) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 24, y); ctx.lineTo(x + 24, y + 24); ctx.stroke();
    }
    ctx.globalAlpha = 0.35; ctx.fillRect(w * 0.62, 0, 2, h);
    [[w*.65,25],[w*.97,25],[w*.65,h-25],[w*.97,h-25]].forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();});
    ctx.font = "16px monospace"; ctx.textAlign = "right"; ctx.fillText("VT-07", w * .95, h * .53);
  } else if (config.pattern === "metallic") {
    const grad = ctx.createLinearGradient(w*.75,0,w*.88,0);
    grad.addColorStop(0,"rgba(0,0,0,0)"); grad.addColorStop(.3,accent+"55");
    grad.addColorStop(.5,accent+"aa"); grad.addColorStop(.7,accent+"55"); grad.addColorStop(1,"rgba(0,0,0,0)");
    ctx.globalAlpha = 1; ctx.fillStyle = grad; ctx.fillRect(w*.75,0,w*.13,h);
  }
  ctx.restore();
}

function drawFinish(ctx: CanvasRenderingContext2D, material: CardConfig["material"]) {
  const w=WIDTH,h=HEIGHT;
  ctx.save();
  if (material === "matte") {
    let g=ctx.createRadialGradient(w*.15,0,0,w*.15,0,w*.85);g.addColorStop(0,"rgba(255,255,255,.07)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    g=ctx.createRadialGradient(w,h,0,w,h,h);g.addColorStop(0,"rgba(0,0,0,.35)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  } else if (material === "brushed") {
    for(let x=0;x<w;x+=6){ctx.fillStyle=x%3===0?"rgba(255,255,255,.035)":"rgba(0,0,0,.05)";ctx.fillRect(x,0,2,h);}
    const g=ctx.createLinearGradient(0,0,w,0);g.addColorStop(0,"rgba(0,0,0,.18)");g.addColorStop(.42,"rgba(255,255,255,.2)");g.addColorStop(.68,"rgba(0,0,0,.12)");g.addColorStop(1,"rgba(255,255,255,.1)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  } else if (material === "polished") {
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(.18,"rgba(255,255,255,0)");g.addColorStop(.34,"rgba(255,255,255,.42)");g.addColorStop(.46,"rgba(255,255,255,.04)");g.addColorStop(.58,"rgba(255,255,255,.18)");g.addColorStop(.86,"rgba(0,0,0,.3)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  } else if (material === "carbon") {
    for(let x=-h;x<w;x+=10){ctx.strokeStyle="rgba(255,255,255,.07)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+h,h);ctx.stroke();ctx.strokeStyle="rgba(0,0,0,.4)";ctx.beginPath();ctx.moveTo(x+h,0);ctx.lineTo(x,h);ctx.stroke();}
    ctx.fillStyle="rgba(0,0,0,.18)";ctx.fillRect(0,0,w,h);
  } else {
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,255,255,.2)");g.addColorStop(.45,"rgba(255,255,255,.02)");g.addColorStop(1,"rgba(0,0,0,.28)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  }
  ctx.restore();
}

export async function downloadCardPng(config: CardConfig, filename = "vanta-card.png"): Promise<"downloaded" | "shared"> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * SCALE; canvas.height = HEIGHT * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Este navegador não conseguiu criar a imagem PNG.");
  ctx.scale(SCALE, SCALE);
  roundedRect(ctx, 0, 0, WIDTH, HEIGHT, RADIUS / SCALE); ctx.clip();

  const design = getDesign(config.designId);
  const base = COLORS[config.color].hex;
  const accent = ACCENT_HEX[config.accent];
  const spider = design.name === "Spider-Man — Webline";

  if (spider) {
    const image = await loadImage("/card.jpeg");
    ctx.fillStyle = "#080b10"; ctx.fillRect(0,0,WIDTH,HEIGHT);
    // Match object-fit: cover, then apply the selected tint/finish with canvas filters.
    const scale = Math.max(WIDTH/image.width, HEIGHT/image.height);
    const iw=image.width*scale, ih=image.height*scale;
    const tint = config.color === "gold" ? "sepia(.42) saturate(1.25)" : config.color === "silver" ? "grayscale(.65) brightness(1.12)" : config.color === "darkgreen" ? "hue-rotate(75deg) saturate(.78)" : config.color === "navy" ? "hue-rotate(165deg) saturate(.8)" : config.color === "black" || config.color === "graphite" ? "brightness(.68) saturate(.72)" : config.color === "darkpurple" ? "hue-rotate(35deg) saturate(.85)" : "";
    const finish = config.material === "matte" ? "saturate(.82) contrast(.96)" : config.material === "polished" ? "contrast(1.12) saturate(1.08)" : config.material === "brushed" ? "contrast(1.08) saturate(.92)" : config.material === "carbon" ? "contrast(1.18) brightness(.88)" : "contrast(1.02)";
    ctx.save(); ctx.filter = [tint,finish].filter(Boolean).join(" "); ctx.drawImage(image,(WIDTH-iw)/2,(HEIGHT-ih)/2,iw,ih); ctx.restore();
    if(config.material==="polished"){const g=ctx.createLinearGradient(0,0,WIDTH,HEIGHT);g.addColorStop(.18,"transparent");g.addColorStop(.34,"rgba(255,255,255,.48)");g.addColorStop(.48,"transparent");g.addColorStop(.62,"rgba(255,255,255,.12)");g.addColorStop(.78,"transparent");ctx.fillStyle=g;ctx.fillRect(0,0,WIDTH,HEIGHT);}
    else if(config.material==="brushed"){for(let x=0;x<WIDTH;x+=8){ctx.fillStyle="rgba(255,255,255,.08)";ctx.fillRect(x,0,2,HEIGHT);}}
    else if(config.material==="carbon"){for(let x=-HEIGHT;x<WIDTH;x+=10){ctx.strokeStyle="rgba(0,0,0,.18)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+HEIGHT,HEIGHT);ctx.stroke();}}
    else {const g=ctx.createLinearGradient(0,0,WIDTH,HEIGHT);g.addColorStop(0,"rgba(255,255,255,.10)");g.addColorStop(.35,"transparent");g.addColorStop(1,"rgba(0,0,0,.15)");ctx.fillStyle=g;ctx.fillRect(0,0,WIDTH,HEIGHT);}
  } else {
    ctx.fillStyle=base;ctx.fillRect(0,0,WIDTH,HEIGHT);drawFinish(ctx,config.material);
    const glare=ctx.createRadialGradient(WIDTH*.5,0,0,WIDTH*.5,0,WIDTH*.7);glare.addColorStop(0,"rgba(255,255,255,.3)");glare.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=glare;ctx.fillRect(0,0,WIDTH,HEIGHT);
  }

  if(config.pattern!=="plain") drawPattern(ctx,config,accent);
  if(spider && config.pattern==="metallic"){const g=ctx.createLinearGradient(WIDTH*.28,0,WIDTH*.68,HEIGHT);g.addColorStop(0,"transparent");g.addColorStop(.5,accent+"44");g.addColorStop(1,"transparent");ctx.fillStyle=g;ctx.fillRect(0,0,WIDTH,HEIGHT);}

  if(spider){
    ctx.strokeStyle=accent+"aa";ctx.lineWidth=config.accent==="black"?2:4;roundedRect(ctx,2,2,WIDTH-4,HEIGHT-4,38);ctx.stroke();
    ctx.strokeStyle="rgba(0,0,0,.12)";ctx.lineWidth=10;roundedRect(ctx,5,5,WIDTH-10,HEIGHT-10,35);ctx.stroke();
  } else {
    ctx.strokeStyle="rgba(255,255,255,.14)";ctx.lineWidth=2;roundedRect(ctx,1,1,WIDTH-2,HEIGHT-2,38);ctx.stroke();
  }

  const ink = COLORS[config.color].light ? "rgba(10,10,12,.82)" : "rgba(245,245,242,.9)";
  const font = config.font==="mono" ? "500 23px monospace" : config.font==="serif" ? "italic 34px Georgia, serif" : "500 25px Inter, Arial, sans-serif";
  if(!spider){
    ctx.fillStyle=ink;ctx.textAlign="left";ctx.font="600 28px Inter, Arial, sans-serif";ctx.fillText(config.issuer!=="none"?(ISSUERS.find(i=>i.id===config.issuer)?.label.toUpperCase()??"VANTA"):"VANTA",WIDTH*.07,HEIGHT*.16);
    ctx.textAlign="right";ctx.globalAlpha=.7;ctx.font="500 14px monospace";ctx.fillText(config.network!=="none"?(NETWORKS.find(n=>n.id===config.network)?.label??design.collection):design.collection,WIDTH*.93,HEIGHT*.16);ctx.globalAlpha=1;
    if(config.textPos!=="bottom-right"){ctx.textAlign="right";ctx.globalAlpha=.5;ctx.font="14px monospace";ctx.fillText("DEMO",WIDTH*.93,HEIGHT*.91);ctx.globalAlpha=1;}
  }
  if(config.text){
    ctx.fillStyle=spider?(config.color==="silver"||config.color==="gold"?"#fff8e8":"#fff"):ink;
    ctx.font=font;ctx.textBaseline="middle";ctx.textAlign=config.textPos==="center"?"center":config.textPos==="bottom-right"?"right":"left";
    const x=config.textPos==="center"?WIDTH/2:config.textPos==="bottom-right"?WIDTH*.93:WIDTH*.07;
    const y=config.textPos==="center"?HEIGHT/2:HEIGHT*.91;
    let text=config.text.toLocaleUpperCase();
    while(ctx.measureText(text).width>WIDTH*.82 && text.length>1) text=text.slice(0,-1);
    ctx.fillText(text,x,y);
  }

  const blob = await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/png"));
  if(!blob || blob.size<1000) throw new Error("O PNG não foi gerado corretamente.");
  const file = new File([blob],filename,{type:"image/png"});
  const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  if(isIOS && typeof navigator.share==="function" && navigator.canShare?.({files:[file]})){
    await navigator.share({files:[file],title:filename}); return "shared";
  }
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");anchor.href=url;anchor.download=filename;anchor.style.display="none";
  document.body.appendChild(anchor);anchor.click();anchor.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),30000);
  return "downloaded";
}
