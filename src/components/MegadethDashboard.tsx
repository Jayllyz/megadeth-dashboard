// MegadethDashboard.tsx
'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AlbumSimplified, Artist, PagingObject, Track } from '@statsfm/spotify.js';
import Image from 'next/image';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';
import { ModeToggle } from './toggletTheme';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--primary))',
  },
};

interface MegadethDashboardProps {
  artistInfo: Artist;
  topTracks: Track[];
  albums: PagingObject<AlbumSimplified>;
}

export default function MegadethDashboard({ artistInfo, topTracks, albums }: MegadethDashboardProps) {
  const chartData = topTracks.slice(0, 10).map((track) => ({
    name: track.name,
    popularity: track.popularity,
  }));

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="bg-card text-card-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {artistInfo?.images[0].url && (
                <Image
                  src={artistInfo.images[0].url}
                  width={300}
                  height={300}
                  alt={artistInfo.name}
                  className="rounded-lg shadow-lg"
                />
              )}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-5xl font-bold">{artistInfo?.name}</h1>
                  <ModeToggle />
                </div>
                <p className="text-xl text-muted-foreground">
                  Megadeth is an iconic American heavy metal band formed in 1983. Known for their technical prowess and
                  politically charged lyrics, they've been a pivotal force in the thrash metal scene for decades.
                </p>
                <div className="flex flex-wrap gap-2">
                  {artistInfo?.genres.map((genre: string) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <p className="text-lg">
                  <span className="font-semibold" suppressHydrationWarning>
                    {artistInfo?.followers.total.toLocaleString()}
                  </span>{' '}
                  followers
                </p>
                <p className="text-lg">
                  Popularity: <span className="font-semibold">{artistInfo?.popularity}/100</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Top Tracks</CardTitle>
            <CardDescription>Popularity of Megadeth's top 10 tracks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] w-full">
              <ChartContainer className="h-full" config={chartConfig}>
                <BarChart data={chartData} layout="horizontal" margin={{ top: 20, right: 10, left: 10, bottom: 50 }}>
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    dataKey="popularity"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="popularity" fill="hsl(var(--primary))" radius={5}>
                    <LabelList dataKey="popularity" position="top" fill="hsl(var(--primary-foreground))" />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>50 Latest Albums</CardTitle>
            <CardDescription>Discography highlights</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border border-border p-4">
              {albums?.items.map((album: AlbumSimplified, i: number) => (
                <div key={album.id}>
                  <div className="flex items-center">
                    {album.images.length > 0 && (
                      <Image
                        src={album.images[0].url}
                        width={50}
                        height={50}
                        alt={`${album.name} cover`}
                        className="rounded mr-4"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium leading-none">{album.name}</p>
                      <p className="text-sm text-muted-foreground">{new Date(album.release_date).getFullYear()}</p>
                    </div>
                  </div>
                  {albums && i !== albums.items.length - 1 && <div className="border-b border-border my-2" />}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
