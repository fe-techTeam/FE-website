import type { Metadata } from "next";
import WorkPage from "@/components/work/WorkPage";

export const metadata: Metadata = {
  title: "Marketing Case Studies & Campaign Work",
  description:
    "Explore how we engineer growth systems that solve real business challenges and deliver measurable results.",
};

export default function Page() {
  return <WorkPage />;
}
