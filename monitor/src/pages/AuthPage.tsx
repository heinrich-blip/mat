import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate("/alerts", { replace: true });
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">MAT Monitor</h1>
            <p className="text-sm text-muted-foreground">
              Alerts &amp; Analytics Dashboard
            </p>
          </div>
        </div>

        {/* Auth form */}
        <div className="bg-card border border-border rounded-xl p-6">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(210 100% 56%)",
                    brandAccent: "hsl(210 100% 46%)",
                    inputBackground: "hsl(222 47% 18%)",
                    inputBorder: "hsl(222 47% 28%)",
                    inputText: "hsl(213 31% 91%)",
                    inputPlaceholder: "hsl(215 20% 50%)",
                    messageText: "hsl(213 31% 91%)",
                    anchorTextColor: "hsl(210 100% 70%)",
                  },
                },
              },
              style: {
                container: { background: "transparent" },
                label: { color: "hsl(213 31% 75%)", fontSize: "13px" },
                button: {
                  borderRadius: "6px",
                  fontWeight: "600",
                },
                input: {
                  borderRadius: "6px",
                  fontSize: "14px",
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin + "/alerts"}
          />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Use your MAT dashboard credentials to sign in.
        </p>
      </div>
    </div>
  );
}
