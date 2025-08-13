import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Admin = () => {
  return (
    <main className="container mx-auto py-16 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-3">Admin (MVP)</h1>
      <p className="text-muted-foreground">
        Connect Supabase to enable secure admin login and CRUD for clients. This page will host passkey management and auditing.
      </p>
      <div className="mt-6">
        <Button asChild variant="secondary">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
};

export default Admin;
