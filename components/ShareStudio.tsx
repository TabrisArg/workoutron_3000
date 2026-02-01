
import React, { useEffect, useRef, useState } from 'react';
import { WorkoutRoutine, UserSettings } from '../types';
import { TranslationSchema } from '../i18n/types';
import { soundService } from '../utils/soundService';

interface ShareStudioProps {
  routine: WorkoutRoutine;
  imagePreview: string | null;
  t: TranslationSchema;
  settings: UserSettings;
  onClose: () => void;
}

const STORE_URL = "https://workoutron.ai";

const ShareStudio: React.FC<ShareStudioProps> = ({ routine, imagePreview, t, settings, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    generateCard();
  }, [routine, imagePreview, settings.language]);

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, currentY);
      currentY += lineHeight;
    }
    return { finalY: currentY, lineCount: lines.length };
  };

  const drawQRCode = async (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(STORE_URL)}&bgcolor=ffffff&color=000000&margin=4`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = qrUrl;
    await new Promise(res => { 
      img.onload = res; 
      img.onerror = () => {
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, size, size);
        res(null);
      }; 
    });
    
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.roundRect(x - 12, y - 12, size + 24, size + 24, 20);
    ctx.fill();
    
    ctx.drawImage(img, x, y, size, size);
  };

  const generateCard = async () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;

    if (imagePreview) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imagePreview;
      await new Promise(res => { img.onload = res; img.onerror = res; });
      const canvasAspect = 1080 / 1920;
      const imgAspect = img.width / img.height;
      let dW, dH, dX, dY;
      if (imgAspect > canvasAspect) {
        dH = 1920; dW = img.width * (1920 / img.height); dX = (1080 - dW) / 2; dY = 0;
      } else {
        dW = 1080; dH = img.height * (1080 / img.width); dX = 0; dY = (1920 - dH) / 2;
      }
      ctx.drawImage(img, dX, dY, dW, dH);
    } else {
      ctx.fillStyle = "#09090B"; ctx.fillRect(0, 0, 1080, 1920);
    }

    const gTop = ctx.createLinearGradient(0, 0, 0, 800);
    gTop.addColorStop(0, 'rgba(0,0,0,0.95)'); gTop.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gTop; ctx.fillRect(0, 0, 1080, 800);
    
    const gBot = ctx.createLinearGradient(0, 600, 0, 1920);
    gBot.addColorStop(0, 'rgba(0,0,0,0)'); gBot.addColorStop(0.35, 'rgba(0,0,0,0.85)'); gBot.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gBot; ctx.fillRect(0, 600, 1080, 1320);

    ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "right"; ctx.font = "900 32px Inter, sans-serif"; ctx.globalAlpha = 0.4;
    ctx.fillText("WORKOUTRON 3000", 1000, 100); ctx.globalAlpha = 1.0;

    const pad = 80;
    const qrSize = 180;
    await drawQRCode(ctx, pad, pad, qrSize);

    const maxW = 920;
    const title = routine.equipmentName.toUpperCase();
    
    let fS = 110;
    ctx.font = `900 ${fS}px Inter, sans-serif`;
    while (fS > 50) {
      ctx.font = `900 ${fS}px Inter, sans-serif`;
      const words = title.split(' ');
      let lines = 1; let line = '';
      for(let n=0; n<words.length; n++) {
        let test = line + words[n] + ' ';
        if (ctx.measureText(test).width > maxW && n > 0) { lines++; line = words[n] + ' '; }
        else { line = test; }
      }
      if (lines <= 2) break;
      fS -= 10;
    }

    ctx.textAlign = "left"; ctx.fillStyle = "#FFFFFF";
    const tMeta = wrapText(ctx, title, pad, 750, maxW, fS + 15);
    
    ctx.font = "700 48px Inter, sans-serif"; ctx.fillStyle = "#007AFF";
    ctx.fillText(`${routine.estimatedDuration.toUpperCase()} SESSION`, pad, tMeta.finalY + 15);

    const exCount = Math.min(routine.exercises.length, 6);
    const rowH = 155; 
    const listStartY = 920 + ((6 - exCount) * (rowH / 2.2));
    
    routine.exercises.slice(0, 6).forEach((ex, i) => {
      const y = listStartY + (i * rowH);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath(); ctx.roundRect(pad, y - rowH/2 + 10, maxW, rowH - 18, 28); ctx.fill();
      
      ctx.fillStyle = "#007AFF"; ctx.font = `900 32px Inter, sans-serif`;
      ctx.fillText((i + 1).toString().padStart(2, '0'), pad + 35, y + 10);

      const statsText = `${ex.sets} X ${ex.reps}`;
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = `700 30px Inter, sans-serif`;
      ctx.fillText(statsText, pad + maxW - 40, y + 10);
      const statsW = ctx.measureText(statsText).width;
      ctx.textAlign = "left";

      let nameFS = 44;
      ctx.font = `900 ${nameFS}px Inter, sans-serif`;
      let nameText = ex.name.toUpperCase();
      const availableNameW = maxW - 200 - statsW; 
      
      while (ctx.measureText(nameText).width > availableNameW && nameFS > 28) {
        nameFS -= 2;
        ctx.font = `900 ${nameFS}px Inter, sans-serif`;
      }
      
      if (ctx.measureText(nameText).width > availableNameW) {
        while (ctx.measureText(nameText + "...").width > availableNameW && nameText.length > 0) {
          nameText = nameText.substring(0, nameText.length - 1);
        }
        nameText += "...";
      }

      ctx.fillStyle = "white";
      ctx.fillText(nameText, pad + 110, y + 10);
    });

    const footerPad = 100;
    ctx.fillStyle = "white"; ctx.textAlign = "left";
    ctx.font = "900 30px Inter, sans-serif";
    ctx.fillText("SCAN TO DOWNLOAD", footerPad, 1920 - footerPad - 75);
    ctx.font = "500 22px Inter, sans-serif"; ctx.globalAlpha = 0.5;
    ctx.fillText("GET YOUR OWN AI ROUTINE AT WORKOUTRON.AI", footerPad, 1920 - footerPad - 40);
    ctx.globalAlpha = 1.0;

    setGeneratedImage(canvas.toDataURL('image/png', 0.95));
    setIsGenerating(false);
  };

  /**
   * REFINED SHARING LOGIC
   * Third-party social apps generally don't allow attaching images via standard URL schemes (intents)
   * from a web browser unless they are publicly hosted.
   * 
   * Strategy:
   * 1. ALWAYS try navigator.share first (Native Mobile Share). It's the only way to share Text + File correctly.
   * 2. FALLBACK: Copy image to clipboard and open the social app's link. 
   *    User can then Paste the image into the post/chat.
   */
  const handleAction = async (platformId: string, label: string) => {
    if (!generatedImage) return;
    soundService.playTap();
    
    // Add explicit store links to share text and hashtags
    const message = `Check out my ${routine.equipmentName} routine! 🔥 Created with Workoutron 3000.\n\nTry it: ${STORE_URL} #Workoutron3000 #${platformId}`;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], 'workoutron-routine.png', { type: 'image/png' });

      // Attempt Native Mobile Share (iOS/Android)
      // This is the gold standard: attaches the file and sets the text in one go.
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Workoutron: ${routine.equipmentName}`,
            text: message,
          });
          return;
        } catch (e) {
          console.debug("Native share cancelled or failed, falling back to clipboard");
        }
      }
      
      // Desktop / Web Fallback: Clipboard Copy + Intent Redirect
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopyStatus(label);
          setTimeout(() => setCopyStatus(null), 6000);
        } catch (clipboardErr) {
          console.error("Clipboard write failed", clipboardErr);
        }
      }

      // Deep Links / Web Intents
      const deepLinks: Record<string, string> = {
        'twitter': `https://x.com/intent/tweet?text=${encodeURIComponent(message)}`,
        'whatsapp': `https://wa.me/?text=${encodeURIComponent(message + "\n\nTry it: " + STORE_URL)}`,
        'telegram': `https://t.me/share/url?url=${encodeURIComponent(STORE_URL)}&text=${encodeURIComponent(message)}`,
        'facebook': `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(STORE_URL)}&quote=${encodeURIComponent(message)}`,
        'instagram': 'https://www.instagram.com',
        'snapchat': 'https://www.snapchat.com'
      };

      if (deepLinks[platformId]) {
        // Robust way to open a new tab that bypasses most "refused to connect" or popup blockers
        const a = document.createElement('a');
        a.href = deepLinks[platformId];
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error("Action handler failed", err);
      downloadImage();
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    soundService.playTriumphant();
    const link = document.createElement('a');
    link.download = `workoutron-${routine.equipmentName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = generatedImage;
    link.click();
  };

  const socialPlatforms = [
    { id: 'instagram', icon: 'auto_awesome', color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600', label: t.share.instagram },
    { id: 'twitter', icon: 'close', color: 'bg-black', label: t.share.twitter },
    { id: 'facebook', icon: 'facebook', color: 'bg-[#1877F2]', label: t.share.facebook },
    { id: 'whatsapp', icon: 'chat', color: 'bg-[#25D366]', label: t.share.whatsapp },
    { id: 'telegram', icon: 'send', color: 'bg-[#0088cc]', label: t.share.telegram },
    { id: 'snapchat', icon: 'chat_bubble', color: 'bg-[#FFFC00] text-black', label: t.share.snapchat },
  ];

  return (
    <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      {copyStatus && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-apple-blue text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl z-[3000] animate-spring flex items-center gap-4 border border-white/20">
          <span className="material-symbols-rounded animate-bounce">content_paste</span>
          <div className="text-left">
            <div className="text-white font-black">Routine Copied!</div>
            <div className="text-[9px] opacity-70 font-bold uppercase tracking-tighter">Paste it now in {copyStatus}</div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#1C1C1E] w-full max-w-5xl rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-spring max-h-[95vh] border border-white/10">
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="w-full md:w-[45%] bg-[#0A0A0B] p-6 flex items-center justify-center relative min-h-[400px]">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-6">
              <div className="size-14 border-[5px] border-apple-blue border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-black uppercase text-apple-gray tracking-widest">Designing Your Card...</span>
            </div>
          ) : generatedImage && (
            <img 
              src={generatedImage} 
              className="max-h-full max-w-full rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,1)] object-contain animate-reveal ring-1 ring-white/20" 
              alt="Workout Card Preview" 
            />
          )}
        </div>
        
        <div className="w-full md:w-[55%] p-8 md:p-14 space-y-8 flex flex-col justify-center overflow-y-auto no-scrollbar bg-white dark:bg-[#1C1C1E]">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-4xl font-black tracking-tight dark:text-white leading-tight">{t.share.title}</h2>
            <p className="text-apple-gray text-sm font-medium leading-relaxed">
              Mobile: Share directly with the image attached. 
              <br/>
              Desktop: Image is copied to clipboard—just hit <b>PASTE</b>.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {socialPlatforms.map((p) => (
              <button 
                key={p.id} 
                onClick={() => handleAction(p.id, p.label)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-3xl ios-transition active:scale-90 hover:opacity-90 transition-all ${p.color} text-white group shadow-lg`}
              >
                <span className="material-symbols-rounded text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">{p.label}</span>
              </button>
            ))}
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => handleAction('generic', 'System Share')} 
              className="w-full bg-apple-blue text-white py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 flex items-center justify-center gap-4 border border-apple-blue"
            >
              <span className="material-symbols-rounded text-xl">ios_share</span> {t.share.nativeBtn}
            </button>
            <button 
              onClick={downloadImage} 
              className="w-full bg-apple-bg dark:bg-white/5 dark:text-white py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest active:scale-95 flex items-center justify-center gap-3 border border-black/10 dark:border-white/10"
            >
              <span className="material-symbols-rounded">download</span> {t.share.downloadBtn}
            </button>
          </div>

          <button 
            onClick={() => { soundService.playCancel(); onClose(); }} 
            className="w-full py-4 rounded-[2rem] bg-apple-bg dark:bg-white/5 text-apple-text dark:text-white font-black text-xs uppercase tracking-[0.1em] ios-transition active:scale-95 flex items-center justify-center gap-2 border border-black/5 dark:border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
          >
            <span className="material-symbols-rounded text-lg">close</span> {t.common.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareStudio;
