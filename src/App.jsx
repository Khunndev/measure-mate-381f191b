import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import { useEffect } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('http://localhost:3333/health');
        if (response.ok) {
          toast.success("เซิร์ฟเวอร์ทำงานปกติ!");
        } else {
          toast.error("เซิร์ฟเวอร์มีปัญหา!");
        }
      } catch (error) {
        toast.error("ไม่สามารถตรวจสอบสถานะเซิร์ฟเวอร์ได้!");
      }
    };

    checkHealth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {navItems.map(({ to, page }) => (
              <Route key={to} path={to} element={page} />
            ))}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
