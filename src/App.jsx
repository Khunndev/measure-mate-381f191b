import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import MeasurementForm from "./pages/MeasurementForm";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          {user && <Navbar />}
          <div className={user ? "pt-16" : ""}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={user ? <Navigate to="/measurement" replace /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/measurement"
                element={user ? <MeasurementForm /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/templates"
                element={user ? <Templates /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/settings"
                element={user ? <Settings /> : <Navigate to="/login" replace />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
