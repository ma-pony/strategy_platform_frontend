import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

const Home = lazy(() => import("@/pages/Home"));
const Signals = lazy(() => import("@/pages/Signals"));
const StrategyDetail = lazy(() => import("@/pages/StrategyDetail"));
const Methodology = lazy(() => import("@/pages/Methodology"));
const MarketResearch = lazy(() => import("@/pages/MarketResearch"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Account = lazy(() => import("@/pages/Account"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="size-5 rounded-full border-2 border-white/20 border-t-[color:var(--accent)] animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
    <Router>
      <Suspense fallback={<PageFallback />}>
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
      </Suspense>
    </Router>
    </ErrorBoundary>
  );
}
