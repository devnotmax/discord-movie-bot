import axios from "axios";
import { TMDBMovie } from "../types/movie";

export async function buscarPelicula(
  titulo: string
): Promise<TMDBMovie | null> {
  const res = await axios.get("https://api.themoviedb.org/3/search/movie", {
    params: {
      api_key: process.env.TMDB_API_KEY,
      query: titulo,
      language: "es-ES",
    },
  });

  return res.data.results[0] ?? null;
}
