import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import Home from "@/pages/Home";
import Signals from "@/pages/Signals";
import StrategyDetail from "@/pages/StrategyDetail";
import Methodology from "@/pages/Methodology";
import MarketResearch from "@/pages/MarketResearch";
import Pricing from "@/pages/Pricing";
import Account from "@/pages/Account";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/signals" element={<Signals />} />
          <Route path="/strategies/:strategyId" element={<StrategyDetail />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/market-research" element={<MarketResearch />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
