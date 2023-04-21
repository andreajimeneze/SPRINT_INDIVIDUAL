-- Active: 1680181159627@@127.0.0.1@5432@pezmosaico


CREATE TABLE IF NOT EXISTS categoria (
  id SERIAL PRIMARY KEY,
  categoria varchar(50) NOT NULL
);

INSERT INTO categoria ("categoria") VALUES ('Decoración Hogar'),
('Menaje'), ('Mobiliario'),('Misceláneo');

ALTER TABLE producto ADD COLUMN categoria_id INTEGER NULL;