import express from "express";
import sequelize from "./src/config/database.js";
import movieRoutes from "./src/routes/movie.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API REST de películas funcionando");
});

app.use("/api", movieRoutes);

try {
  await sequelize.authenticate();
  console.log("Conexión a MySQL exitosa");

  await sequelize.sync();
  console.log("Modelos sincronizados");
} catch (error) {
  console.log("Error al conectar con la base de datos:", error);
}

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
