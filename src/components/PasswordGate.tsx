
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PasswordGateProps {
  clientSlug: string;
  onSuccess: () => void;
}

export const PasswordGate = ({ clientSlug, onSuccess }: PasswordGateProps) => {
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

      console.log('Verifying password for client:', clientSlug, 'with password:', passkey);

      // Verify password using Supabase RPC function
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

      // Create secure session
      localStorage.setItem(`session:${clientSlug}`, "active");
      toast({ title: "Access Granted", description: "Successfully authenticated." });
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
    <form onSubmit={submit} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 max-w-md w-full mx-auto animate-fade-in animate-scale-in">
      <div className="flex items-center gap-2 mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <ShieldCheck className="text-red-400 animate-pulse" />
        <h2 className="text-xl font-semibold tracking-tight text-white">Enter passkey</h2>
      </div>
      <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <Input
          type={show ? "text" : "password"}
          placeholder="Your passkey"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          aria-label="Passkey"
          className="pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 transition-all duration-300 hover:bg-white/15"
          autoComplete="one-time-code"
        />
        <button
          type="button"
          aria-label={show ? "Hide passkey" : "Show passkey"}
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors duration-200 hover:scale-110"
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
      <Button className="mt-4 w-full h-11 hover:scale-[1.02] transition-transform duration-200 animate-fade-in" type="submit" disabled={loading} style={{ animationDelay: '0.3s' }}>
        {loading ? "Verifying…" : "Continue"}
      </Button>
      <p className="mt-3 text-sm text-white/60 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        Secure authentication with Blowfish password hashing and database verification.
      </p>
    </form>
  );
};
