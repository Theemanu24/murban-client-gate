import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Admin = () => {
  return (
    <main className="flex-1 overflow-hidden bg-transparent">
      <div className="container mx-auto py-16 h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
          <p className="text-muted-foreground mb-8">
            Admin functionality is not available in this client portal version.
          </p>
          <Button asChild>
            <Link to="/">
              Back to Portal
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Admin;