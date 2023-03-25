import express from 'express';
import { join } from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import hbs from "hbs";
import path from 'path';
import validator from "express-validator";
import { capFirstMay, formatCL } from "./helpers/helpers.js";
import bodyParser from "body-parser"
import router from './routes/routes.js';
const productos= JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
export default productos;
const __dirname = fileURLToPath(import.meta.url);
const app = express()

// Settings
app.set("views", "./views");
app.set("view engine", "hbs")

// Middlewares

hbs.registerPartials(join(app.get("views"), "partials"));
app.use(router)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use("/node_modules", express.static(join(__dirname, "./node_modules")))


app.listen(3000, () => {
  console.log("En Puerto 3000")
})

