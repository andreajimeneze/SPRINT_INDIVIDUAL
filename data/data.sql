-- Active: 1680181159627@@127.0.0.1@5432@pezmosaico
CREATE DATABASE IF NOT EXISTS `nodelogin` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `pezmosaico`;

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `accounts` 
(`username`, `password`, `email`) VALUES 
('root', '1234', 'test@test.com');

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';

CREATE TABLE IF NOT EXISTS `registro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `rut` varchar(15) NOT NULL,
  `direccion` varchar(50) NOT NULL,
  `telefono` int(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

ALTER TABLE `registro` MODIFY `telefono` varchar(50) NOT NULL;

SELECT * FROM `registro`;

DELETE FROM `registro` WHERE id = 1;

ALTER TABLE registrousuario ADD CONSTRAINT unique_usuario UNIQUE (usuario);

ALTER TABLE registrousuario ADD CONSTRAINT unique_usuario UNIQUE (rut);

ALTER TABLE registrousuario ADD CONSTRAINT unique_rut UNIQUE (rut);
