import { getShoes } from '../lib/shoes';
import Quiz from '../components/Quiz';

export const revalidate = 300;

export default async function Home() {
  const { shoes, source } = await getShoes();
  const brands = [...new Set(shoes.map(s => s.brand))].sort();
  return <Quiz shoes={shoes} brands={brands} source={source} />;
}
