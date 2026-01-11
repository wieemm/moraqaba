
import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';

export const CameraCheckIn: React.FC<{ onComplete: (success: boolean) => void }> = ({ onComplete }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<'IDLE' | 'SUCCESS' | 'FAILED'>('IDLE');
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const performCheckIn = () => {
    setScanning(true);
    // Simulate IA processing
    setTimeout(() => {
      setScanning(false);
      setResult('SUCCESS');
      setTimeout(() => onComplete(true), 1500);
    }, 3000);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="relative w-full aspect-square bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-200 shadow-2xl">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover"
        />
        
        {/* Scanning Overlay */}
        {scanning && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-lime-400 shadow-[0_0_20px_#84cc16] animate-[scan_2s_infinite]"></div>
            <div className="absolute inset-0 border-2 border-lime-400 opacity-30 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-64 h-64 border-2 border-dashed border-lime-400 rounded-full animate-spin"></div>
            </div>
            <div className="absolute bottom-4 w-full text-center text-lime-400 font-bold tracking-widest text-xs uppercase">
              Analyse Biométrique en cours...
            </div>
          </div>
        )}

        {result === 'SUCCESS' && (
          <div className="absolute inset-0 bg-lime-500/80 flex flex-col items-center justify-center text-white p-6 text-center">
            <CheckCircle size={80} className="mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold uppercase tracking-widest">Identité Vérifiée</h3>
            <p className="mt-2 opacity-90">Check-in enregistré à {new Date().toLocaleTimeString()}</p>
          </div>
        )}

        {!stream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <ShieldAlert size={48} className="mb-4" />
            <p className="font-medium">Veuillez autoriser l'accès à la caméra pour effectuer la reconnaissance faciale.</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        {result === 'IDLE' && !scanning && (
          <button 
            onClick={performCheckIn}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all transform active:scale-95"
          >
            <Camera size={20} />
            Démarrer le Check-in
          </button>
        )}
        
        {scanning && (
          <div className="flex items-center gap-3 text-slate-600 animate-pulse font-medium">
            <RefreshCw size={20} className="animate-spin" />
            Traitement IA...
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
