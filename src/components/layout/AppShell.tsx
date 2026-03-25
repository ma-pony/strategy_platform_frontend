import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import TopNav from "@/components/nav/TopNav";
import PaywallModal from "@/components/paywall/PaywallModal";
import PageContainer from "@/components/layout/PageContainer";

export default function AppShell(props: { children?: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <TopNav />
      <main className="pt-8 pb-10 md:pt-10">
        <PageContainer>
          {props.children ? (
            props.children
          ) : (
            <div className="grid gap-6 animate-in">
              <Outlet />
            </div>
          )}
        </PageContainer>
      </main>
      <footer className="border-t border-white/[0.06] py-6">
        <PageContainer>
          <div className="flex flex-col gap-2 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
            <div>数据仅用于研究与演示，不构成投资建议</div>
            <div>更新频率：Demo 数据每日生成 · 版本 v0</div>
          </div>
        </PageContainer>
      </footer>
      <PaywallModal />
    </div>
  );
}
