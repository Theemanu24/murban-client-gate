import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AdminAuth } from "@/components/AdminAuth";
import { AdminDashboard } from "@/components/AdminDashboard";
import { User } from "firebase/auth";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleAuthenticated = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  if (!user) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Boba Cafe Admin</h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
      <AdminDashboard user={user} />
    </div>
  );
};

export default Admin;