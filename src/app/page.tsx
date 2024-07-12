'use server';
import MegadethDashboard from '@/components/MegadethDashboard';
import { fetchMegadethData } from './action';

export default async function Home() {
  const { artistInfo, topTracks, albums } = await fetchMegadethData();

  return <MegadethDashboard artistInfo={artistInfo} topTracks={topTracks} albums={albums} />;
}
