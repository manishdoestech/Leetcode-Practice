import { getAllProblems } from "@/lib/problems";
import { HomePageClient } from "@/components/HomePageClient";
import LeetCodeStats from "@/components/LeetCodeStats";

export default async function HomePage() {
  const problems = await getAllProblems();
  return (
    <>
      <LeetCodeStats />
      <HomePageClient problems={problems} />
    </>
  );
}
