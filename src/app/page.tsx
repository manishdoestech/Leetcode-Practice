import { getAllProblems } from "@/lib/problems";
import { HomePageClient } from "@/components/HomePageClient";

export default async function HomePage() {
  const problems = await getAllProblems();
  return <HomePageClient problems={problems} />;
}
