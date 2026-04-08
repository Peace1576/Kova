import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AiPage } from "./pages/AiPage";
import { AgreementAuditPage } from "./pages/AgreementAuditPage";
import { IntegrationStatusPage } from "./pages/IntegrationStatusPage";
import { AgreementsPage } from "./pages/AgreementsPage";
import { AgreementViewerPage } from "./pages/AgreementViewerPage";
import { AdminReviewPage } from "./pages/AdminReviewPage";
import { LegalDisclosurePage } from "./pages/LegalDisclosurePage";
import { LegalConsentPage } from "./pages/LegalConsentPage";
import { HomePage } from "./pages/HomePage";
import { MobilePage } from "./pages/MobilePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PricingPage } from "./pages/PricingPage";
import { ProductPage } from "./pages/ProductPage";
import { SystemPage } from "./pages/SystemPage";

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/mobile" element={<MobilePage />} />
        <Route path="/system" element={<SystemPage />} />
        <Route path="/agreements" element={<AgreementsPage />} />
        <Route path="/agreements/:slug" element={<AgreementViewerPage />} />
        <Route path="/legal/disclosure" element={<LegalDisclosurePage />} />
        <Route path="/legal/consent" element={<LegalConsentPage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
        <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
        <Route path="/app" element={<DashboardPage />} />
        <Route path="/app/ai" element={<AiPage />} />
        <Route path="/app/brain" element={<AiPage />} />
        <Route path="/app/audit" element={<AgreementAuditPage />} />
        <Route path="/app/status" element={<IntegrationStatusPage />} />
        <Route path="/app/admin/review" element={<AdminReviewPage />} />
        <Route path="/app/*" element={<DashboardPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
