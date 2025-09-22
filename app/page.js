// app/page.js
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedProperties from '@/components/FeaturedProperties';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedProperties />
      <Contact />
    </main>
  );
}
