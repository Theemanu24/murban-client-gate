import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ShieldCheck, MapPin } from "lucide-react";
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
      
      toast({ title: "Access Granted", description: successMessage });
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

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 max-w-md w-full mx-auto animate-fade-in animate-scale-in hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 group">
      <div className="flex items-center gap-2 mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <ShieldCheck className="text-white/80 animate-pulse group-hover:text-white transition-colors duration-300" />
        <h2 className="text-xl font-semibold tracking-tight text-white group-hover:text-white/90 transition-colors duration-300">
          Enter passkey
        </h2>
      </div>
      
      {terminal && (
        <div className="flex items-center gap-2 mb-4 animate-fade-in bg-white/5 rounded-lg p-3" style={{ animationDelay: '0.15s' }}>
          <MapPin className="w-4 h-4 text-white/60" />
          <span className="text-sm text-white/80">Terminal: <strong className="text-white">{terminal}</strong></span>
        </div>
      )}
      
      <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <Input
          type={show ? "text" : "password"}
          placeholder="Your passkey"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          aria-label="Passkey"
          className="pr-12 h-12 bg-white/20 border-white/30 text-white font-medium placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 transition-all duration-300 hover:bg-white/25 focus:scale-[1.02] focus:shadow-lg focus:shadow-white/10"
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
      <Button className="mt-4 w-full h-11 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-white/20 bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/30 hover:border-white/40" type="submit" disabled={loading} style={{ animationDelay: '0.3s' }}>
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying…
          </span>
        ) : (
          "Continue"
        )}
      </Button>
      <p className="mt-3 text-sm text-white/60 animate-fade-in group-hover:text-white/50 transition-colors duration-300" style={{ animationDelay: '0.4s' }}>
        Secure authentication with Blowfish password hashing and database verification.
      </p>
    </form>
  );
};
