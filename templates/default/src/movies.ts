import { movies } from "./data";

export async function getMovies() {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl) return movies;

  const res = await fetch(`${baseUrl}/movies`);
  if (!res.ok) throw new Error("Failed to load movies");
  return res.json();
}

export function getMovie(id: string) {
  return movies.find((movie) => movie.id === id) ?? movies[0];
}
