import React, { useRef, useState, useEffect } from 'react';
import { Eraser, PenLine } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureImage: string, email: string, name: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel, isSubmitting }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');

  // Setup canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on parent container width
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = 200; // Fixed height
        
        // Reset styles after resize
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling on touch
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
      if (!hasSignature) setHasSignature(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const handleSave = () => {
    if (!signerName || !signerEmail) {
      alert("Please enter your name and email.");
      return;
    }
    if (!hasSignature) {
      alert("Please sign in the box.");
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Embed timestamp into the image
        const timestamp = new Date().toLocaleString();
        
        ctx.save();
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#94a3b8"; // slate-400
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        // Draw at bottom right corner with some padding
        ctx.fillText(`Signed: ${timestamp}`, canvas.width - 10, canvas.height - 5);
        ctx.restore();
      }

      const signatureImage = canvas.toDataURL('image/png');
      onSave(signatureImage, signerEmail, signerName);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            value={signerEmail}
            onChange={(e) => setSignerEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Signature</label>
        <div className="border-2 border-slate-200 border-dashed rounded-lg bg-slate-50 relative">
          <canvas
            ref={canvasRef}
            className="w-full touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400/50">
              <div className="flex items-center gap-2 text-lg">
                <PenLine className="w-5 h-5" />
                <span>Sign here</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-2">
          <button 
            type="button" 
            onClick={clearSignature}
            className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <Eraser className="w-4 h-4" /> Clear
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 py-3 px-4 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSubmitting || !hasSignature || !signerName || !signerEmail}
          className={`flex-1 py-3 px-4 text-white font-bold rounded-lg transition-colors shadow-sm
            ${isSubmitting || !hasSignature || !signerName || !signerEmail
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isSubmitting ? 'Sending...' : 'Accept & Sign'}
        </button>
      </div>
    </div>
  );
};