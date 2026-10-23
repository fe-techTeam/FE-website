import type { Metadata } from "next";
import ServicesPage from "@/components/services/ServicesPage";

export const metadata: Metadata = {
  title: "Integrated Marketing Services in India",
  description:
    "From strategy to execution — branding, performance marketing, creative, digital experience, e-commerce, social and analytics engineered as one growth system.",
};

export default function Page() {
  return <ServicesPage />;
}
