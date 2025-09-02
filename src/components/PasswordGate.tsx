import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ShieldCheck, MapPin, MousePointer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PasswordGateProps {
  clientSlug: string;
  terminal?: string;
  onSuccess: () => void;
}

export const PasswordGate = ({ clientSlug, terminal, onSuccess }: PasswordGateProps) => {
  const [passkey, setPasskey] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!passkey.trim()) {
        toast({ title: "Passkey required", description: "Please enter your passkey to continue." });
        return;
      }

      console.log('Verifying password for client:', clientSlug, 'terminal:', terminal, 'with password:', passkey);

      // Verify password using Supabase RPC function
      // You can extend this later to include terminal-specific password verification
      const { data: isValid, error } = await supabase.rpc('verify_client_password', {
        client_slug: clientSlug,
        password: passkey
      });
      
      console.log('Password verification result:', { isValid, error });
      
      if (error) {
        console.error('Error verifying password:', error);
        toast({
          title: "Error",
          description: "Failed to verify password. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!isValid) {
        toast({ 
          title: "Invalid Passkey", 
          description: "The passkey you entered is incorrect.",
          variant: "destructive"
        });
        return;
      }

      // Create secure session with terminal info
      const sessionKey = terminal ? `session:${clientSlug}:${terminal}` : `session:${clientSlug}`;
      localStorage.setItem(sessionKey, "active");
      
      const successMessage = terminal
        ? `Successfully authenticated for ${terminal} terminal.`
        : "Successfully authenticated.";

      toast({
        title: "Access Granted",
        description: successMessage,
        duration: 2000,
      });
      onSuccess();
    } catch (err) {
      console.error('Password verification failed:', err);
      toast({
        title: "Error",
        description: "Failed to verify password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFlipCard = () => {
    setIsFlipped(true);
  };

  return (
    <div className="flip-card-container max-w-md w-full mx-auto h-[400px]">
      <div 
        className={`flip-card-inner relative w-full h-full transition-transform duration-700 ease-in-out ${isFlipped ? 'flipped' : ''}`}
      >
        {/* Front side - "Click me" card */}
        <div 
          className={`flip-card-side flip-card-front absolute inset-0 rounded-2xl cursor-pointer transition-all duration-500 group ${isFlipped ? 'hidden' : 'block'}`}
          onClick={handleFlipCard}
        >
          <div className="w-full h-full bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 hover:shadow-white/10 hover:border-white/30 group-hover:scale-[1.02] transition-all duration-300">
            <div className="flex flex-col items-center justify-center h-full gap-6 animate-fade-in">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                <ShieldCheck className="w-10 h-10 text-white/80 animate-pulse group-hover:text-white transition-colors duration-300" />
              </div>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
                  Secure Access
                </h2>
                <p className="text-white/70 mb-4">
                  {terminal ? `Terminal: ${terminal}` : 'Authentication Required'}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-white/60 group-hover:text-white/80 transition-colors duration-300 animate-bounce">
                <MousePointer className="w-5 h-5" />
                <span className="text-lg font-semibold">Click me</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-xs text-white/50">
                Click to authenticate
              </p>
            </div>
          </div>
        </div>

        {/* Back side - Password form */}
        <div 
          className={`flip-card-side flip-card-back absolute inset-0 rounded-2xl transition-all duration-500 ${isFlipped ? 'block' : 'hidden'}`}
        >
          <div className="w-full h-full bg-gradient-to-br from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 hover:shadow-white/10 hover:border-white/30 transition-all duration-300">
            <form onSubmit={submit} className="h-full flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <ShieldCheck className="text-white/80 animate-pulse transition-colors duration-300" />
                <h2 className="text-xl font-semibold tracking-tight text-white transition-colors duration-300">
                  Enter passkey
                </h2>
              </div>
              
              {terminal && (
                <div className="flex items-center gap-2 mb-6 animate-fade-in bg-white/5 rounded-lg p-3 border border-white/10" style={{ animationDelay: '0.15s' }}>
                  <MapPin className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/80">Terminal: <strong className="text-white">{terminal}</strong></span>
                </div>
              )}
              
              <div className="relative animate-fade-in mb-6" style={{ animationDelay: '0.2s' }}>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Your passkey"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  aria-label="Passkey"
                  className="pr-12 h-12 bg-white/10 border-white/30 text-white font-medium placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all duration-300 hover:bg-white/15 focus:scale-[1.02] focus:shadow-lg focus:shadow-white/10"
                  autoComplete="one-time-code"
                />
                <button
                  type="button"
                  aria-label={show ? "Hide passkey" : "Show passkey"}
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 transition-all duration-200 hover:scale-125 active:scale-95"
                >
                  {show ? <EyeOff className="animate-pulse" /> : <Eye />}
                </button>
              </div>

              <Button 
                className="w-full h-11 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-white/20 bg-white/15 hover:bg-white/25 text-white font-semibold border border-white/30 hover:border-white/40 mb-6" 
                type="submit" 
                disabled={loading} 
                style={{ animationDelay: '0.3s' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying…
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>

              <p className="text-sm text-white/60 animate-fade-in transition-colors duration-300 text-center" style={{ animationDelay: '0.4s' }}>
                Secure authentication with Blowfish password hashing and database verification.
              </p>
              
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="mt-4 text-xs text-white/50 hover:text-white/70 underline transition-colors duration-200 text-center"
              >
                ← Back
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .flip-card-container {
          perspective: 1000px;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.7s ease-in-out;
          transform-style: preserve-3d;
        }
        
        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }
        
        .flip-card-side {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 1rem;
        }
        
        .flip-card-front {
          transform: rotateY(0deg);
          z-index: 2;
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
          z-index: 1;
        }
        
        .flip-card-inner.flipped .flip-card-front {
          z-index: 1;
          opacity: 0;
          pointer-events: none;
        }
        
        .flip-card-inner.flipped .flip-card-back {
          z-index: 2;
          opacity: 1;
          pointer-events: auto;
        }
        
        .flip-card-inner:not(.flipped) .flip-card-front {
          z-index: 2;
          opacity: 1;
          pointer-events: auto;
        }
        
        .flip-card-inner:not(.flipped) .flip-card-back {
          z-index: 1;
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};