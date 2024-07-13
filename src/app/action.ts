'use server';
import { api } from '@/lib/api';
import type { AlbumSimplified, Artist, PagingObject, Track } from '@statsfm/spotify.js';

async function getMegadethInfo(): Promise<Artist> {
  const id = process.env.MEGADETH_ID as string;
  const artist: Artist = await api.artists.get(id);
  return artist;
}

async function getMegadethTopTracks(): Promise<Track[]> {
  const id = process.env.MEGADETH_ID as string;
  const tracks = await api.artists.topTracks(id);
  return tracks;
}

async function getMegadethAlbums(limit: number, offset: number): Promise<PagingObject<AlbumSimplified>> {
  const id = process.env.MEGADETH_ID as string;
  const albums = await api.artists.albums(id, { limit, offset });
  albums.items = albums.items.sort((a, b) => b.release_date.localeCompare(a.release_date));
  return albums;
}

export async function fetchMegadethData(): Promise<{
  artistInfo: Artist;
  topTracks: Track[];
  albums: PagingObject<AlbumSimplified>;
}> {
  const [info, tracks, albums] = await Promise.all([
    getMegadethInfo(),
    getMegadethTopTracks(),
    getMegadethAlbums(50, 0),
  ]);

  const processedTracks = tracks.map((track) => ({
    ...track,
    name: track.name.split(' - ')[0].slice(0, 20) + (track.name.length > 20 ? '...' : ''),
  }));

  return {
    artistInfo: info as Artist,
    topTracks: processedTracks as Track[],
    albums: albums as PagingObject<AlbumSimplified>,
  };
}
