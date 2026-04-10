import type { Metadata } from "next";

import { LoginView } from "./login-view";

export const metadata: Metadata = {
  title: "Ingreso — IEP Madre Santa Beatriz",
  description: "Acceso a la plataforma de gestión administrativa.",
};

export default function LoginPage() {
  return <LoginView />;
}
