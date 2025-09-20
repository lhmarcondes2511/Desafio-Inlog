import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { VehicleProvider } from "./contexts/VehicleContext";
import VehicleList from "./pages/VehicleList";
import VehicleRegister from "./pages/VehicleRegister";
import Navigation from "./components/Navigation";

function App() {
  return (
    <VehicleProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-6 max-w-7xl">
            <Routes>
              <Route path="/" element={<VehicleList />} />
              <Route path="/register" element={<VehicleRegister />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </VehicleProvider>
  );
}

export default App;
