import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import TopNav from "@/components/nav/TopNav";
import PaywallModal from "@/components/paywall/PaywallModal";
import PageContainer from "@/components/layout/PageContainer";

export default function AppShell(props: { children?: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <TopNav />
      <main className="py-6">
        <PageContainer>
          {props.children ? (
            props.children
          ) : (
            <div className="grid gap-6">
              <Outlet />
            </div>
          )}
        </PageContainer>
      </main>
      <footer className="border-t border-white/10 py-6">
        <PageContainer>
          <div className="flex flex-col gap-2 text-xs text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
            <div>数据仅用于研究与演示，不构成投资建议</div>
            <div>更新频率：Demo 数据每日生成 · 版本 v0</div>
          </div>
        </PageContainer>
      </footer>
      <PaywallModal />
    </div>
  );
}
