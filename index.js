import express from 'express';
import { join } from "path";
import { fileURLToPath } from 'url';
import hbs from "hbs";
import router from './routes/routes.js';

// const __dirname = fileURLToPath(import.meta.url);

const app = express()

// Settings
app.set("views", "./views");
app.set("view engine", "hbs")

// Middlewares
hbs.registerPartials(join(app.get("views"), "partials"));
app.use(express.urlencoded({ extended: true }));

app.use(router)
app.use(express.json());
app.use(express.static("public"))
app.use(express.static("helpers"))

app.listen(3000, () => {
  console.log("En Puerto 3000")
})