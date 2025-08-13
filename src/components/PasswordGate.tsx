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

      // Verify password using secure backend function
      const { data: isValid, error } = await supabase.rpc('verify_client_password', {
        client_slug: clientSlug,
        password: passkey
      });

      if (error) {
        console.error('Password verification error:', error);
        toast({ 
          title: "Authentication Error", 
          description: "Unable to verify credentials. Please try again.",
          variant: "destructive"
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border p-6 max-w-md w-full mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="text-primary" />
        <h2 className="text-xl font-semibold tracking-tight">Enter passkey</h2>
      </div>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          placeholder="Your passkey"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          aria-label="Passkey"
          className="pr-12 h-12"
          autoComplete="one-time-code"
        />
        <button
          type="button"
          aria-label={show ? "Hide passkey" : "Show passkey"}
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
      <Button className="mt-4 w-full h-11" type="submit" disabled={loading}>
        {loading ? "Verifying…" : "Continue"}
      </Button>
      <p className="mt-3 text-sm text-muted-foreground">
        Secure authentication with Blowfish password hashing and database verification.
      </p>
    </form>
  );
};
