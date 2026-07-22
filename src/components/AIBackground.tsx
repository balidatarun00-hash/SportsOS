import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Video, Upload, Play, Pause, Sliders, AlertCircle, CheckCircle, 
  RefreshCw, Settings, Eye, HelpCircle, Image as ImageIcon, Check, X, Film
} from "lucide-react";

// Default Unsplash high-quality cricket ball on bat resting on green field
const DEFAULT_CRICKET_BG = "https://images.unsplash.com/photo-1531415080290-bc98545ab3ef?w=1600&auto=format&fit=crop&q=80";

interface AIBackgroundProps {
  onBackgroundChange?: (type: "video" | "image", url: string) => void;
}

export default function AIBackground({ onBackgroundChange }: AIBackgroundProps) {
  // State for current active background
  const [bgType, setBgType] = useState<"image" | "video">("image");
  const [bgUrl, setBgUrl] = useState<string>(DEFAULT_CRICKET_BG);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  
  // Custom video generation states
  const [prompt, setPrompt] = useState<string>(
    "A gorgeous slow-motion cinematic loop of a shiny red cricket ball resting on a wooden bat, wind gently blowing grass blades, warm sunset sunrays, high-end 3D visual"
  );
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  
  // API workflow state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [operationName, setOperationName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // UI Panels
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(true); // default true for amazing visual out of the box!
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // File drag state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll video status
  useEffect(() => {
    if (!operationName || !isGenerating) return;

    let pollInterval: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max (5s interval)

    const checkStatus = async () => {
      try {
        attempts++;
        setGenerationStep(`Rendering via Veo AI... (Attempt ${attempts}/${maxAttempts})`);
        
        const res = await fetch("/api/video-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName }),
        });

        if (!res.ok) {
          throw new Error("Failed to check generation status");
        }

        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error.message || "Generation failed on model server");
        }

        if (data.done) {
          setIsGenerating(false);
          setBgType("video");
          const streamUrl = `/api/video-stream?operationName=${encodeURIComponent(operationName)}`;
          setBgUrl(streamUrl);
          setSuccessMsg("Veo AI successfully animated your image! The background is now a living masterpiece.");
          setGenerationStep("");
          
          if (onBackgroundChange) {
            onBackgroundChange("video", streamUrl);
          }
        }
      } catch (err: any) {
        console.error("Polling error:", err);
        setErrorMsg(err.message || "Status check encountered an error.");
        setIsGenerating(false);
        setGenerationStep("");
      }
    };

    pollInterval = setInterval(checkStatus, 5000);
    return () => clearInterval(pollInterval);
  }, [operationName, isGenerating, onBackgroundChange]);

  // Handle local image file uploads
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file.");
      return;
    }
    
    setErrorMsg(null);
    setSuccessMsg(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setSelectedImageBase64(base64);
      setBgType("image");
      setBgUrl(base64);
      if (onBackgroundChange) {
        onBackgroundChange("image", base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Run the video generation
  const handleGenerateVideo = async () => {
    try {
      setIsGenerating(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      setGenerationStep("Uploading photo & setting up parameters...");

      const activeImage = selectedImageBase64 || DEFAULT_CRICKET_BG;

      // In case we are using the default Unsplash image, we need to fetch and convert it to base64
      let base64ToSend = activeImage;
      if (activeImage === DEFAULT_CRICKET_BG) {
        setGenerationStep("Fetching default master image...");
        try {
          const fetched = await fetch(DEFAULT_CRICKET_BG);
          const blob = await fetched.blob();
          base64ToSend = await new Promise((resolve) => {
            const r = new FileReader();
            r.onloadend = () => resolve(r.result as string);
            r.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn("Failed to convert remote Unsplash image to base64, using fallback", e);
        }
      }

      setGenerationStep("Calling Veo 3.1 video generator model...");

      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64ToSend,
          prompt,
          aspectRatio,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Server failed to launch Veo video generation");
      }

      const data = await res.json();
      if (!data.operationName) {
        throw new Error("Server did not return a valid operation reference.");
      }

      setOperationName(data.operationName);
      setGenerationStep("Veo AI has accepted the task. Starting render polling...");
    } catch (err: any) {
      console.error("Generation error:", err);
      setErrorMsg(err.message || "An unexpected error occurred during generation.");
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const resetToDefault = () => {
    setBgType("image");
    setBgUrl(DEFAULT_CRICKET_BG);
    setSelectedImageBase64(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    if (onBackgroundChange) {
      onBackgroundChange("image", DEFAULT_CRICKET_BG);
    }
  };

  return (
    <>
      {/* ================= PORTAL BACKGROUND LAYER ================= */}
      <div className="fixed inset-0 -z-50 w-full h-full overflow-hidden select-none pointer-events-none" id="ai_portal_background">
        {/* Deep backdrop color */}
        <div className="absolute inset-0 bg-[#070D2B]" />

        {/* Video Background */}
        {bgType === "video" && (
          <video
            src={bgUrl}
            autoPlay={isPlaying}
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-30"
            id="vfx_background_player"
          />
        )}

        {/* Image Background */}
        {bgType === "image" && (
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
              isSimulationMode ? "animate-background-sim-drift" : ""
            }`}
            style={{
              backgroundImage: `url(${bgUrl})`,
              opacity: 0.25,
            }}
            id="vfx_background_image"
          />
        )}

        {/* Living VFX simulation particle layer (Golden sunbeams & dust particles) */}
        {isSimulationMode && (
          <div className="absolute inset-0 pointer-events-none z-[1] mix-blend-screen opacity-40">
            {/* Soft glowing sunbeams */}
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-amber-500/20 via-transparent to-transparent filter blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
            
            {/* Shifting atmospheric dust specs */}
            <div className="absolute top-[20%] left-[10%] w-[8px] h-[8px] rounded-full bg-yellow-400/30 filter blur-[1px] animate-float-slow" />
            <div className="absolute bottom-[30%] right-[15%] w-[12px] h-[12px] rounded-full bg-amber-400/20 filter blur-[2px] animate-float-medium" style={{ animationDuration: '18s' }} />
            <div className="absolute top-[60%] left-[40%] w-[6px] h-[6px] rounded-full bg-white/40 filter blur-[1px] animate-float-fast" style={{ animationDuration: '12s' }} />
          </div>
        )}

        {/* Immersive Glass overlay to ensure superb text legibility across all pages */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070D2B]/90 via-[#070D2B]/75 to-[#070D2B]/95 z-[2]" />
      </div>

      {/* ================= FLOATING STICKER TRIGGER ================= */}
      <div className="fixed bottom-6 right-6 z-40" id="ai_background_controller_badge">
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="group flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 hover:border-[#1C77FF] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-2xl shadow-blue-900/30 hover:shadow-[#1C77FF]/25 hover:bg-slate-800 transition-all cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isGenerating ? "bg-amber-400" : ""}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ${isGenerating ? "bg-amber-500" : ""}`} />
          </span>
          <Film className="h-4 w-4 text-[#38BDF8] group-hover:rotate-12 transition-transform" />
          <span>{isGenerating ? "AI Animating..." : "AI Video Background"}</span>
        </button>
      </div>

      {/* ================= CONTROLLER OVERLAY PANEL ================= */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="ai_background_panel_modal">
          <div className="w-full max-w-2xl bg-slate-950/95 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsPanelOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full border border-slate-800 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-slate-900 mb-6 text-left">
              <div className="h-10 w-10 bg-[#1C77FF]/15 border border-[#1C77FF]/30 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-blue-400">
                  Google Veo 3.1 Fast Video Engine
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">AI Background Studio</h3>
                <p className="text-slate-400 text-xs mt-0.5">Animate any sports photo into a loopable living cinematic background.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Image Selection & Preview */}
              <div className="space-y-4 text-left">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Step 1: Select Source Image
                </label>
                
                {/* Image Drag Box */}
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-[#1C77FF] bg-blue-950/20"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                    accept="image/*"
                  />
                  
                  {/* Current Preview */}
                  <div className="absolute inset-2 rounded-xl overflow-hidden">
                    <img
                      src={selectedImageBase64 || DEFAULT_CRICKET_BG}
                      className="w-full h-full object-cover opacity-40"
                      alt="Source image for video generation"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <Upload className="h-6 w-6 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-white">
                      {selectedImageBase64 ? "Custom Photo Loaded" : "Default Cricket Ball Image"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Drag & drop or click to replace
                    </span>
                  </div>
                </div>

                {/* Preset Options */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">Active image preset:</span>
                  <button
                    onClick={resetToDefault}
                    className="text-[11px] font-bold text-[#1C77FF] hover:underline cursor-pointer"
                  >
                    Reset to Default Cricket Ball
                  </button>
                </div>

                {/* Active Background Status */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3.5 space-y-2">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                    Background Player Status
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Active Format:</span>
                    <span className="text-xs font-bold text-white capitalize px-2.5 py-0.5 bg-slate-850 rounded-full border border-slate-800">
                      {bgType} Background
                    </span>
                  </div>

                  {bgType === "video" && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-300">Video Playback:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                          title={isPlaying ? "Pause background video" : "Play background video"}
                        >
                          {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Simulation mode controls */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-300">Live Parallax Drift:</span>
                    <button
                      onClick={() => setIsSimulationMode(!isSimulationMode)}
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                        isSimulationMode
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : "bg-slate-800 border-slate-750 text-slate-400"
                      }`}
                    >
                      {isSimulationMode ? "Active" : "Disabled"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Video Parameters */}
              <div className="space-y-4 text-left">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Step 2: AI Rendering Settings
                </label>

                {/* Prompt Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Veo Motion Directive</span>
                    <span className="text-[9px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900/40 uppercase font-bold">Fast Model</span>
                  </div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 resize-none leading-normal"
                    placeholder="Describe the cinematic camera motions, weather, wind, or dust effects..."
                  />
                </div>

                {/* Aspect Ratio choice */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400">Aspect Ratio Matrix</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAspectRatio("16:9")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        aspectRatio === "16:9"
                          ? "bg-[#1C77FF]/15 border-[#1C77FF] text-white"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>📺 16:9 Landscape</span>
                    </button>
                    <button
                      onClick={() => setAspectRatio("9:16")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        aspectRatio === "9:16"
                          ? "bg-[#1C77FF]/15 border-[#1C77FF] text-white"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>📱 9:16 Portrait</span>
                    </button>
                  </div>
                </div>

                {/* Status displays or Action buttons */}
                <div className="pt-2">
                  {isGenerating ? (
                    <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 text-center">
                      <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white">Animating with Veo 3.1...</span>
                        <p className="text-[10px] text-slate-400 leading-normal">{generationStep}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleGenerateVideo}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-[#1C77FF] hover:from-blue-500 hover:to-blue-400 text-white font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                      Animate Image with Veo AI
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* Notification logs at bottom */}
            <div className="mt-6 pt-4 border-t border-slate-900 text-left">
              {errorMsg && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-1 leading-normal">
                    <span className="font-bold block text-red-300">Model Server Note:</span>
                    <p>{errorMsg}</p>
                    <p className="text-[10px] text-red-400/80 pt-1">
                      Note: Real video rendering requires a valid server-side <span className="font-mono">GEMINI_API_KEY</span>. If not configured, you can close this studio and enjoy the high-fidelity pre-rendered background animation simulation!
                    </p>
                  </div>
                </div>
              )}

              {successMsg && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-1 leading-normal">
                    <span className="font-bold block text-emerald-300">Animation Engaged!</span>
                    <p>{successMsg}</p>
                  </div>
                </div>
              )}

              {!errorMsg && !successMsg && !isGenerating && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-850 text-slate-400 text-xs">
                  <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    By default, the studio uses a high-fidelity parallax drift simulation of the gorgeous red cricket ball on bat on turf. To run real Generative video AI model calls, press the "Animate Image with Veo AI" button.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
