import type { Metadata } from "next";
import CareersPage from "@/components/careers/CareersPage";
import { getCareerRoles } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Careers in Digital Marketing & Technology",
  description:
    "Build your career at First Economy across media, creative, technology and data. Open roles in Mumbai, Bengaluru, Pune and Chhatrapati Sambhaji Nagar.",
};

export const revalidate = 3600;

export default async function Page() {
  const roles = await getCareerRoles();
  return <CareersPage roles={roles} />;
}
