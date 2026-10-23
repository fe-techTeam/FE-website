import type { Metadata } from "next";
import AwardsPage from "@/components/awards/AwardsPage";

export const metadata: Metadata = {
  title: "Marketing & Media Awards and Recognition",
  description:
    "225+ media awards across the First Economy network — recognized for creative excellence, innovation and measurable business impact.",
};

export default function Page() {
  return <AwardsPage />;
}
