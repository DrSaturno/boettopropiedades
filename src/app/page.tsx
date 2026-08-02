import FeaturedProperties from "@/components/home/FeaturedProperties";
import HomeExperience from "@/components/home/HomeExperience";

export default function HomePage() {
  return (
    <HomeExperience
      featuredProperties={<FeaturedProperties />}
    />
  );
}
