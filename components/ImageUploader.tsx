import React, { useRef, useState, useEffect } from 'react';
import { soundService } from '../utils/soundService';
import { TranslationSchema } from '../i18n/types';
import { compressBase64 } from '../utils/imageUtils';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
  t: TranslationSchema;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading, t }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (isCameraActive && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive, cameraStream]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const fullBase64 = reader.result as string;
        // Optimization: Compress before sending to API to reduce bandwidth
        const compressed = await compressBase64(fullBase64, 1024, 0.8);
        onImageSelected(compressed.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    soundService.playCameraTick();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1080 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      setCameraStream(stream);
      setIsCameraActive(true);
    } catch (err) {
      setCameraError(t.uploader.cameraDenied);
      triggerUpload();
    }
  };

  const stopCamera = () => {
    soundService.playCancel();
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      soundService.playShutter();
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        setIsCapturing(true);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const rawData = canvas.toDataURL('image/jpeg', 0.9);
        // Bandwidth optimization: Compress to a web-optimized size before API call
        const webOptimized = await compressBase64(rawData, 1024, 0.75);

        onImageSelected(webOptimized.split(',')[1]);

        // Immediate Cleanup
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
        setIsCameraActive(false);
        setIsCapturing(false);
      }
    }
  };

  const triggerUpload = () => {
    soundService.playCameraTick();
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto animate-reveal">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative aspect-square w-full bg-white dark:bg-[#1C1C1E] rounded-ios-lg shadow-ios overflow-hidden ios-transition group border border-black/[0.03] dark:border-white/10">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-md z-[60] px-8 text-center space-y-8 animate-in fade-in duration-500 overflow-hidden">
            <div className="absolute inset-0 z-10 pointer-events-none opacity-20">
              <div className="absolute left-0 right-0 h-1 bg-vizofit-accent shadow-[0_0_15px_rgba(12,244,227,1)] animate-scan"></div>
            </div>
            <div className="size-24 bg-vizofit-accent/20 rounded-full flex items-center justify-center animate-glow">
              <span className="material-symbols-rounded text-vizofit-accent text-5xl">analytics</span>
            </div>
            <div className="space-y-3 w-full">
              <h3 className="text-2xl font-bold tracking-tight animate-pulse text-apple-text dark:text-white">{t.uploader.analyzingTitle}</h3>
              <p className="text-apple-gray text-sm font-medium">{t.uploader.analyzingDesc}</p>
            </div>
          </div>
        ) : isCameraActive ? (
          <div className="absolute inset-0 flex flex-col bg-black z-50">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
              <button onClick={(e) => { e.stopPropagation(); stopCamera(); }} className="pointer-events-auto size-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center active:scale-90">
                <span className="material-symbols-rounded text-2xl">close</span>
              </button>
              <div className="flex items-center justify-center pb-4">
                <button onClick={(e) => { e.stopPropagation(); capturePhoto(); }} disabled={isCapturing} className="pointer-events-auto size-20 rounded-full border-4 border-white flex items-center justify-center p-1.5 active:scale-90 transition-transform shadow-2xl">
                  <div className="size-full bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={startCamera} className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center ios-transition hover:bg-apple-bg/30 dark:hover:bg-white/5 active:scale-[0.98] group">
            <div className="relative size-28 flex items-center justify-center mb-8">
              {/* Dynamic Aura Glow */}
              <div className="absolute inset-0 bg-vizofit-accent/20 dark:bg-vizofit-accent/10 blur-[40px] rounded-full scale-150 group-hover:scale-[1.8] ios-transition duration-700 opacity-60 dark:opacity-40 animate-pulse-soft" />

              {/* Frosted Glass Disc */}
              <div className="size-24 rounded-full relative flex items-center justify-center overflow-hidden border border-white/50 dark:border-white/10 shadow-2xl group-hover:scale-110 ios-transition bg-white/30 dark:bg-white/5 backdrop-blur-2xl">
                {/* Brand Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-vizofit-accent/40 via-transparent to-vizofit-accent/10 dark:from-vizofit-accent/20 dark:to-transparent" />

                {/* Noise Texture for 'Frosted' feel */}
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
                />

                <img src="assets/Icons/snap_icon.png" className="size-14 object-contain relative z-20 drop-shadow-[0_8px_15px_rgba(0,0,0,0.2)]" alt="Snap" />
              </div>
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-2 text-apple-text dark:text-white">{t.uploader.snapTitle}</h3>
            <p className="text-apple-gray font-bold text-sm px-4">{t.uploader.snapDesc}</p>
          </button>
        )}
      </div>

      {!isLoading && !isCameraActive && (
        <div className="mt-8 flex justify-center animate-reveal stagger-2">
          <button
            onClick={triggerUpload}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-apple-text dark:bg-[#1C1C1E] text-white dark:text-white border border-transparent dark:border-white/10 font-black text-xs ios-transition hover:opacity-90 active:scale-95 shadow-lg dark:shadow-none uppercase tracking-widest"
          >
            <span className="material-symbols-rounded text-xl">photo_library</span>
            {t.uploader.uploadBtn}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
