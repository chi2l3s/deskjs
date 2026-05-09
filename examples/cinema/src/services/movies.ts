import { mockMovies } from "../data/movies";

export async function getMovies() {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl) return mockMovies;

  const res = await fetch(`${baseUrl}/movies`);
  if (!res.ok) throw new Error("Failed to load movies");
  return res.json();
}

export async function getMovie(id: string) {
  const movies = await getMovies();
  return movies.find((movie: { id: string }) => movie.id === id) ?? movies[0];
}
