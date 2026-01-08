import React, { useRef, useEffect, useState } from 'react';
import { IconBrush } from './icons/IconBrush';
import { IconEraser } from './icons/IconEraser';
import { IconXCircle } from './icons/IconXCircle';
import { IconTrash } from './icons/IconTrash';

interface MaskableImageCardProps {
  title: string;
  imageUrl: string;
  onMaskChange: (maskDataUrl: string | null) => void;
  onDelete?: () => void;
  maskingEnabled?: boolean;
}

type Tool = 'brush' | 'eraser';

const MASK_COLOR_API = 'rgba(255, 255, 255, 1)'; // White for editable area
const MASK_COLOR_DISPLAY = 'rgba(56, 189, 248, 0.5)'; // Primary color tint for user display

export const MaskableImageCard = ({ title, imageUrl, onMaskChange, onDelete, maskingEnabled = true }: MaskableImageCardProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const apiCanvasRef = useRef<HTMLCanvasElement>(null); // Hidden canvas for API mask
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>('brush');
  const [brushSize, setBrushSize] = useState(40);

  const drawOnCanvas = (x: number, y: number, tool: Tool) => {
    [displayCanvasRef, apiCanvasRef].forEach((canvasRef, index) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out';
      ctx.fillStyle = index === 0 ? MASK_COLOR_DISPLAY : MASK_COLOR_API;

      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  const getCoords = (e: React.MouseEvent<HTMLCanvasElement>): {x: number, y: number} | null => {
      const canvas = displayCanvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
      }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCoords(e);
    if (!coords) return;
    setIsDrawing(true);
    drawOnCanvas(coords.x, coords.y, activeTool);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCoords(e);
    if (!coords) return;
    drawOnCanvas(coords.x, coords.y, activeTool);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    const apiCanvas = apiCanvasRef.current;
    if (apiCanvas) {
      const ctx = apiCanvas.getContext('2d');
      if (!ctx) return;
      const imageData = ctx.getImageData(0, 0, apiCanvas.width, apiCanvas.height);
      const isCanvasEmpty = !imageData.data.some((channel, i) => (i + 1) % 4 !== 0 && channel !== 0);
      
      onMaskChange(isCanvasEmpty ? null : apiCanvas.toDataURL('image/png'));
    }
  };

  const clearMask = () => {
    [displayCanvasRef, apiCanvasRef].forEach(canvasRef => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canvasRef === apiCanvasRef) {
          ctx.fillStyle = 'black';
          ctx.fillRect(0,0,canvas.width, canvas.height);
      }
    });
    onMaskChange(null);
  };

  useEffect(() => {
    const image = imageRef.current;
    const displayCanvas = displayCanvasRef.current;
    const apiCanvas = apiCanvasRef.current;
    if (!image || !displayCanvas || !apiCanvas) return;

    const setupCanvas = () => {
      const { naturalWidth, naturalHeight } = image;
      [displayCanvas, apiCanvas].forEach(canvas => {
        canvas.width = naturalWidth;
        canvas.height = naturalHeight;
      });
      const apiCtx = apiCanvas.getContext('2d');
      if (apiCtx) {
          apiCtx.fillStyle = 'black';
          apiCtx.fillRect(0, 0, apiCanvas.width, apiCanvas.height);
      }
    };
    
    if (image.complete) {
      setupCanvas();
    } else {
      image.onload = setupCanvas;
    }
  }, [imageUrl]);

  // When masking is disabled, ensure the mask is cleared.
  useEffect(() => {
    if (!maskingEnabled) {
      clearMask();
    }
  }, [maskingEnabled]);

  const toolbarClasses = 'p-2 rounded-lg text-subtle transition-colors duration-200';
  const activeToolClasses = 'bg-primary/20 text-primary';
  
  return (
    <div className="flex-1 flex flex-col bg-surface border border-muted/50 rounded-xl shadow-lg overflow-hidden">
        <div className={`bg-surface p-3 border-b border-muted/50 flex flex-col gap-2 ${!maskingEnabled && 'pb-3'}`}>
            <div className="flex justify-between items-center gap-2">
              <h3 className="text-lg font-semibold text-text">{title}</h3>
              <div className="flex items-center gap-2">
                  {maskingEnabled && (
                    <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-muted/50">
                        <button onClick={() => setActiveTool('brush')} className={`${toolbarClasses} ${activeTool === 'brush' ? activeToolClasses : 'hover:bg-muted/30'}`} aria-label="Brush Tool">
                            <IconBrush className="w-5 h-5" />
                        </button>
                        <button onClick={() => setActiveTool('eraser')} className={`${toolbarClasses} ${activeTool === 'eraser' ? activeToolClasses : 'hover:bg-muted/30'}`} aria-label="Eraser Tool">
                            <IconEraser className="w-5 h-5" />
                        </button>
                        <div className="w-px h-6 bg-muted/50 mx-1"></div>
                        <button onClick={clearMask} className={`${toolbarClasses} hover:bg-red-500/20 hover:text-red-400`} aria-label="Clear Mask">
                            <IconXCircle className="w-5 h-5" />
                        </button>
                    </div>
                  )}
                  {onDelete && (
                      <button
                          onClick={onDelete}
                          className="p-3 bg-muted/20 hover:bg-muted/40 text-subtle rounded-lg disabled:opacity-50 transition-colors duration-200"
                          aria-label="Delete and start over"
                      >
                          <IconTrash className="w-5 h-5" />
                      </button>
                  )}
              </div>
            </div>
            {maskingEnabled && (
                <div className="w-full flex items-center gap-3 pt-2">
                    <IconBrush className="w-4 h-4 text-subtle" />
                    <input
                        type="range"
                        min="10"
                        max="100"
                        step="2"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer accent-primary"
                        aria-label="Brush size"
                    />
                    <span className="text-xs text-subtle w-8 text-right">{brushSize}px</span>
                </div>
            )}
        </div>
        <div className="aspect-square w-full flex items-center justify-center p-4 relative">
            <img ref={imageRef} src={imageUrl} alt={`${title} image for AI editing with mask tool`} className="max-w-full max-h-full object-contain rounded-md invisible" loading="lazy" decoding="async" />
            <div className="absolute inset-4 flex items-center justify-center">
                <div className='relative max-w-full max-h-full aspect-auto'>
                    <img src={imageUrl} alt={`Display of ${title} image`} className="max-w-full max-h-full object-contain rounded-md select-none pointer-events-none" loading="lazy" decoding="async" />
                    <canvas
                        ref={displayCanvasRef}
                        className={`absolute top-0 left-0 w-full h-full ${!maskingEnabled ? 'pointer-events-none' : 'cursor-crosshair'}`}
                        onMouseDown={maskingEnabled ? handleMouseDown : undefined}
                        onMouseMove={maskingEnabled ? handleMouseMove : undefined}
                        onMouseUp={maskingEnabled ? handleMouseUp : undefined}
                        onMouseLeave={maskingEnabled ? handleMouseUp : undefined}
                    />
                    <canvas ref={apiCanvasRef} className="hidden" />
                </div>
            </div>
        </div>
    </div>
  );
};