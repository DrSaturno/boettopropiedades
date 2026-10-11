import HomeProperties from "@/components/home/HomeProperties";
import HomeExperience from "@/components/home/HomeExperience";

export default function HomePage() {
  return (
    <HomeExperience
      homeProperties={<HomeProperties />}
    />
  );
}
