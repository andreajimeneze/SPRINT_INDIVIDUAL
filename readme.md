PROYECTO PERSONAL: TIENDA PEZ MOSAICO

Instrucciones para ejecutar el proyecto:

1) Se deben instalar las siguientes librerías: express, hbs, path, methodOverride,crypto-js, express-flash, express-session, cookie-parser, jsonwebtoken, dotenv. Su instalación es su instalación se realiza en el terminal de la siguiente manera: npm i { nombre de la librería} Asimismo, y para poder visualizar el proyecto en tiempo real, se sugiera instalar nodemon.

2) Este proyecto hace uso de API, implementada en el repositorio: https://github.com/andreajimeneze/API_SPRINT cuyas dependencias y otras consideraciones se encuentran en el Readme de ese repositorio.

3) El proyecto se encuentra levantado en puerto 3000 y se accede a él por navegador en http://localhost:3000.


Consideraciones de evaluación (rúbrica):

1) Consulta a la base de datos:
Selecciona las columnas requeridas para presentar la información solicitada
Utiliza JOIN para relacionar la información de distintas tablas: Se obtiene información desde distintas tablas en los controllers de la API: https://github.com/andreajimeneze/API_SPRINT. Las tablas relacionadas son productos con estado y categoría; registrousuario con rol.
Utiliza WHERE para filtrar la información requerida: Se obtienen WHERE en las consultas realizadas en los controllers de la API: https://github.com/andreajimeneze/API_SPRINT. En términos generales cuando se hacen consultas utilizando la url, ejemplo http://localhost:4000/producto/:id
Utiliza cláusulas de ordenamiento para presentar la información: ORDER BY
Utiliza cláusulas de agrupación de información para obtener datos agregados: GROUP BY. Se utiliza cláusula de agrupación en los link del index para determinar la cantidad de productos que tiene cada categoría. 

2) Algorítmo de cálculo y manipulación de archivos de texto:

Utilización general del lenguaje, sintaxis, selección de tipos de datos, sentencias lógicas, expresiones, operaciones, comparaciones
Utilización de sentencias repetitivas: Las sentencias iterativas forEach y for se aplican en las clases: https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/tree/main/utils/Class. Específicamente se utilizan en casos de obtener datos de manera dinámica.
Convenciones y estilos de programación
Utilización correcta de estructuras de datos
Manipulación de archivos

3) Página Web y HTML:

Utilización de tags html, estilos y responsividad - Utilización de Bootstrap: Se implementa la estructura html en https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/tree/main/views, los estilos se encuentran en: https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/tree/main/public/assets/styles. En relación a la responsividad se aplica con la utilización de bootstrap y en algunos casos con @media querys.

4) Lenguaje Node:

Inclusión de paquetes y librerías de usuario: Según lo indicado en las instrucciones de ejecución, punto 1. Se puede visualizar de manera clara en el archivo package.json: https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/blob/main/package.json
Agrupación del código y separación por funcionalidad: 
Utilización de funciones asíncronas: Se utilizan funciones asíncronas tanto en las clases (https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/tree/main/utils/Class) como en las rutas (https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/blob/main/routes/routes.js)

Lectura de parámetros de entrada 


5) Conexión a Base de Datos: 
Manejo de conexión a base de datos desde Node: La conexión a base de datos se realiza a través de la API levantada en el proyecto  https://github.com/andreajimeneze/API_SPRINT, específicamente en los controllers.js.
Manejo y ejecución de consultas desde Node: El manejo y ejecución de consultas se encuentran en el proyecto  https://github.com/andreajimeneze/API_SPRINT, específicamente en los controllers.js y routes.js

6) Uso de Express: 
Creación servicio Rest con Express: https://github.com/andreajimeneze/API_SPRINT