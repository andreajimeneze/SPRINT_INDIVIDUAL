import express from 'express';
import { join } from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import hbs from "hbs";
import router from './routes/routes.js';
import session from "express-session";
import cookieParser from "cookie-parser";
const productos= JSON.parse(fs.readFileSync("./data/data.json", "utf8"));
const secreto = "secreto";
export default productos;
const __dirname = fileURLToPath(import.meta.url);

const app = express()

// Settings
app.set("views", "./views");
app.set("view engine", "hbs")

// Middlewares
hbs.registerPartials(join(app.get("views"), "partials"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(secreto));
app.use(session({
  secret: "secreto",
  resave: true,
  saveUninitialized: false
}))

app.use(router)
app.use(express.json());
app.use(express.static("public"))
app.use(express.static("helpers"))

app.listen(3000, () => {
  console.log("En Puerto 3000")
})