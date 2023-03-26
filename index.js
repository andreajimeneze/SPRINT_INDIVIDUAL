import express from 'express';
import { join } from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import hbs from "hbs";
import path from 'path';
import validator from "express-validator";
import { capFirstMay, formatCL } from "./public/helpers/helpers.js";
import router from './routes/routes.js';
import morgan from "morgan";
const productos= JSON.parse(fs.readFileSync("./data/data.json", "utf8"));

export default productos;
const __dirname = fileURLToPath(import.meta.url);
const app = express()

// Settings
app.set("views", "./views");
app.set("view engine", "hbs")

// Middlewares
hbs.registerPartials(join(app.get("views"), "partials"));
app.use(router)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(express.static(join(__dirname, "./node_modules/bootstrap/dist")))
app.use(express.static(join(__dirname, "./node_modules/jquery/dist")))

app.get('/jquery.min.js', function(req, res) {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/jquery.min.js');
});

app.listen(3000, () => {
  console.log("En Puerto 3000")
})

