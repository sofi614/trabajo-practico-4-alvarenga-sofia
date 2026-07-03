import Movie from "../models/movie.model.js";
 
const validarPelicula = (datos) => {
  const { title, genre, duration, year, synopsis } = datos;
  const anioActual = new Date().getFullYear();

  if (!title || !genre || duration === undefined || year === undefined) {
    return "Los campos title, genre, duration y year son obligatorios";
  }

  if (!Number.isInteger(duration) || duration <= 0) {
    return "La duración debe ser un número entero mayor a cero";
  }

  if (!Number.isInteger(year) || year < 1888 || year > anioActual || String(year).length !== 4) {
    return "El año debe ser un número entero de 4 dígitos entre 1888 y el año actual";
  }

  if (synopsis !== undefined && typeof synopsis !== "string") {
    return "La sinopsis debe ser una cadena de texto";
  }

  return null;
};

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener películas" });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar la película" });
  }
};

export const createMovie = async (req, res) => {
  try {
    const errorValidacion = validarPelicula(req.body);

    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

    const existeTitulo = await Movie.findOne({
      where: { title: req.body.title }
    });

    if (existeTitulo) {
      return res.status(400).json({ error: "Ya existe una película con ese título" });
    }

    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la película" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    const errorValidacion = validarPelicula(req.body);

    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

    const existeTitulo = await Movie.findOne({
      where: { title: req.body.title }
    });

    if (existeTitulo && existeTitulo.id !== movie.id) {
      return res.status(400).json({ error: "Ya existe una película con ese título" });
    }

    await movie.update(req.body);
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la película" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    await movie.destroy();
    res.json({ message: "Película eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la película" });
  }
};