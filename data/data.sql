-- Active: 1680181159627@@127.0.0.1@5432@pezmosaico

CREATE TABLE registrousuario(  
    id SERIAL NOT NULL PRIMARY KEY,
    nombres VARCHAR(50),
    apellidos VARCHAR(50),
    rut VARCHAR(15),
    direccion VARCHAR(50),
    telefono VARCHAR(15),
    email VARCHAR(50),
    usuario VARCHAR(50),
    password VARCHAR(150)
);

CREATE TABLE producto(  
    id SERIAL NOT NULL PRIMARY KEY,
    nombre VARCHAR(50),
    precio INT,
    imagen VARCHAR(150),
    existencia INT,
    categoria_id INT NULL
);

CREATE TABLE detalle_compra(  
    id SERIAL NOT NULL PRIMARY KEY,
    id_compra INT,
    id_pdto INT,
    cantidad INT,
    precioPdto INT
);

CREATE TABLE compra(  
    id SERIAL NOT NULL PRIMARY KEY,
    fecha VARCHAR(10),
    monto INT,
    id_usuario INT
);

INSERT INTO producto(nombre, precio, imagen, existencia, categoria_id) VALUES 
('Bandeja mosaico', 30000,'https://i.pinimg.com/originals/71/3d/68/713d68cce00a8937f19e524765fcb6d0.png', 10, 2),
('Cuadro mosaico', 60000, 'https://i.pinimg.com/originals/9a/0d/36/9a0d36cc7a7c75c302d7e32467243bff.jpg', 10, 1),
('Tornamesa mosaico', 45000, 'https://i.pinimg.com/originals/6a/79/23/6a7923d42f181c0f27ffbe525dcdd09d.jpg', 10, 1),
('Bandeja mosaico', 30000, 'https://i.pinimg.com/originals/79/f2/17/79f2170bb0a5ece617b9181a87f22b23.jpg', 10, 2),
('Posavasos mosaico', 10000, 'https://i.pinimg.com/originals/67/e3/e0/67e3e03865a68d2ac74aa91a73879194.jpg', 10, 2),
('Caja té mosaico', 15000, 'https://i.pinimg.com/originals/f6/78/b2/f678b2197e63bca556fd835efb45e5f5.jpg', 10, 2),
('Número casa mosaico', 25000, 'https://defrenteparaomar.com/wp-content/04-diy/201902-numero-casa-mosaico/02-numero-para-casa-mosaico.jpg', 10, 4),
('Lámpara mosaico', 45000, 'https://i.pinimg.com/originals/21/f7/b6/21f7b6539a6120d2254876adc4f1a4aa.jpg', 10, 1),
('Bandeja chica mosaico', 18000, 'https://i.pinimg.com/originals/df/4e/0e/df4e0e41d198abfa2e9141fe58066905.jpg', 10, 2),
('Cenicero mosaico', 15000, 'https://i.pinimg.com/originals/a8/1e/3f/a81e3ff7884ccd91cfbd21712a31b1fb.jpg', 10, 4);

ALTER TABLE registrousuario ADD CONSTRAINT unique_usuario UNIQUE (usuario);

ALTER TABLE registrousuario ADD CONSTRAINT unique_rut UNIQUE (rut);

CREATE TABLE IF NOT EXISTS categoria (
  id SERIAL PRIMARY KEY,
  categoria varchar(50) NOT NULL
);

INSERT INTO categoria ("categoria") VALUES ('Decoración Hogar'),
('Menaje'), ('Mobiliario'),('Misceláneo');

ALTER TABLE producto ADD CONSTRAINT fk_producto_categoria
    FOREIGN KEY (categoria_id) REFERENCES categoria (id);

ALTER TABLE compra ADD CONSTRAINT fk_compra_registrousuario
    FOREIGN KEY (id_usuario) REFERENCES registrousuario (id);

ALTER TABLE detalle_compra ADD CONSTRAINT fk_detalle_compra_compra
    FOREIGN KEY (id_compra) REFERENCES compra (id);

ALTER TABLE detalle_compra ADD CONSTRAINT fk_detalle_compra_producto
    FOREIGN KEY (id_pdto) REFERENCES producto (id);

ALTER TABLE producto ADD COLUMN id_estado INTEGER NULL;

CREATE TABLE IF NOT EXISTS estado (
  id SERIAL PRIMARY KEY,
  descripcion varchar(50) NULL
  );
INSERT INTO estado ("descripcion") VALUES ('disponible'), ('no disponible');
ALTER TABLE producto ADD CONSTRAINT fk_producto_estado
  FOREIGN KEY (id_estado) REFERENCES estado (id);

ALTER TABLE producto ALTER COLUMN id_estado SET NOT NULL;

ALTER TABLE categoria ADD COLUMN imgCategoria VARCHAR(100);

ALTER TABLE categoria ALTER COLUMN imgCategoria SET DATA TYPE VARCHAR(200);

CREATE TABLE rol(  
    id SERIAL NOT NULL PRIMARY KEY,
    descripcion VARCHAR(10)
);

ALTER TABLE registrousuario ADD COLUMN rol_id INT NULL;

ALTER TABLE registrousuario ADD CONSTRAINT fk_registrousuario_rol
    FOREIGN KEY (rol_id) REFERENCES rol(id);

INSERT INTO rol ("descripcion") VALUES ('admin'), ('user');

ALTER TABLE registrousuario ALTER COLUMN rol_id SET NOT NULL;

CREATE TABLE compra(  
    id SERIAL NOT NULL PRIMARY KEY,
    fecha VARCHAR(10),
    monto INT,
    id_usuario INT
);
ALTER TABLE "detalle_compra" DROP COLUMN "precioPdto";

ALTER TABLE "compra" RENAME COLUMN "monto" TO "monto_neto";

ALTER TABLE "compra" ALTER COLUMN "monto_neto" SET NOT NULL;
ALTER TABLE "compra" ADD COLUMN "impuesto" INTEGER NULL;

ALTER TABLE "compra" ADD COLUMN "monto_bruto" INTEGER NULL;

ALTER TABLE "compra" ADD COLUMN "gasto_envio" INTEGER NULL;

CREATE TABLE tipo_documento(  
    id SERIAL NOT NULL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE SEQUENCE numero_documento_seq;

CREATE TABLE numero_documento (
    id SERIAL PRIMARY KEY,
    id_tipo_documento INTEGER NOT NULL REFERENCES tipo_documento(id),
    numero INTEGER DEFAULT NEXTVAL('numero_documento_seq'),
    UNIQUE(id_tipo_documento, numero)
);

CREATE TABLE datos_empresa (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(50) NOT NULL
);

ALTER TABLE datos_empresa ADD COLUMN rut VARCHAR(15) NOT NULL;

INSERT INTO datos_empresa (nombre, direccion, telefono, email, rut) VALUES ('Pez Mosaico Limitada', 'Pasaje Esmeralda 14, Valparaíso', '965554730', 'pezmosaico@gmail.com', '76573333-2');

CREATE TABLE detalle_compra(  
    id SERIAL NOT NULL PRIMARY KEY,
    id_compra INT,
    id_pdto INT,
    cantidad INT,
    precioPdto INT
);

CREATE TABLE compra(  
    id SERIAL NOT NULL PRIMARY KEY,
    fecha VARCHAR(10),
    monto INT,
    id_usuario INT
);

ALTER TABLE compra ALTER COLUMN monto_bruto SET NOT NULL;

ALTER TABLE compra ALTER COLUMN monto_neto SET NOT NULL;

ALTER TABLE compra ALTER COLUMN impuesto SET NOT NULL;

