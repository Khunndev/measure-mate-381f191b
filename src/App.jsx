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
import Sidebar from "./components/Sidebar";

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
          <div className="flex h-screen bg-gray-100">
            {user && <Sidebar />}
            <div className="flex-1 flex flex-col overflow-hidden">
              {user && <Navbar />}
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                <div className="container mx-auto px-6 py-8">
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
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
