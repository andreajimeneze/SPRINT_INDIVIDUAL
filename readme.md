                        PROYECTO PERSONAL: TIENDA PEZ MOSAICO

Instrucciones para ejecutar el proyecto:

1) Se deben instalar las siguientes librerías: 
    - express: infraestructura para aplicaciones node js;
    - methodOverride: librería que permite forzar métodos delete, put, patch;
    - crypto-js: librería que permite encriptar contraseñas; 
    - express-flash: paquete de expres js que permite mostrar mensajes en pantalla; 
    - express-session: middleware que almacena datos de sesión en el servidor; 
    - cookie-parser: paquete que permite almacenar datos enviados por un sitio web en el navegador del usuario; 
    - jsonwebtoken: librería que genera token para la navegación en sitios seguros con uso de llaves; 
    - dotenv: paquete que permite la lectura sencilla de las variables de entorno en archivos de extensión;
    - pdfkit: librería que permite la generación de archivos pdf.

Su instalación se realiza en el terminal de la siguiente manera: npm i "nombre de la librería" (sin comillas) Asimismo, y para poder visualizar el proyecto en tiempo real, se sugiera instalar nodemon.

2) Este proyecto hace uso de API, implementada en el repositorio: https://github.com/andreajimeneze/API_SPRINT cuyas dependencias y otras consideraciones se encuentran en el Readme de ese repositorio. Mención especial es la necesidad de ejecución de las querys para cargar la base de datos de manera mínima para poder recorrer la aplicación. Para ingresar al mantenedor, se debe ingresar por el link ingreso con el usuario: admin y la contraseña 9165.

3) El proyecto se encuentra levantado en puerto 3000 y se accede a él por navegador en http://localhost:3000.

4) Se agregaron variables de entorno, en el archivo .env ubicado en la carpeta raíz.


Consideraciones de evaluación (rúbrica):

1) Consulta a la base de datos:
Selecciona las columnas requeridas para presentar la información solicitada: La selección de columnas para obtención y manejo de información, se realiza en la API: .https://github.com/andreajimeneze/API_SPRINT

Utiliza JOIN para relacionar la información de distintas tablas: Se obtiene información desde distintas tablas en los controllers de la API: https://github.com/andreajimeneze/API_SPRINT. Las tablas relacionadas son productos con estado y categoría; registrousuario con rol.

Utiliza WHERE para filtrar la información requerida: Se obtienen WHERE en las consultas realizadas en los controllers de la API: https://github.com/andreajimeneze/API_SPRINT. En términos generales -por ejemplo- cuando se hacen consultas utilizando la url, ejemplo http://localhost:4000/producto/:id

Utiliza cláusulas de ordenamiento para presentar la información: ORDER BY. Se generan consultas con ORDER BY en los controllers de la API: https://github.com/andreajimeneze/API_SPRINT. En el presente proyecto, se hace uso de la API a través de fetch en las clases y su instanciación en las rutas, permitiendo visualizar, por ejemplo, la tienda ordenada por precio y por nombre, ascendente y descendente.

Utiliza cláusulas de agrupación de información para obtener datos agregados: Se generan consultas con GROUP BY en los controllers de la API: https://github.com/andreajimeneze/API_SPRINT.  En el presente proyecto, se hace uso de la API a través de fetch en las clases y su instanciación en las rutas; se utiliza cláusula de agrupación en los link de categoría del index para determinar la cantidad de productos que tiene cada categoría. 

2) Algorítmo de cálculo y manipulación de archivos de texto:

Utilización general del lenguaje, sintaxis, selección de tipos de datos, sentencias lógicas, expresiones, operaciones, comparaciones: Este punto se puede visualizar de manera transversal en el proyecto: https://github.com/andreajimeneze/SPRINT_INDIVIDUAL.

Utilización de sentencias repetitivas: Las sentencias iterativas forEach y for se aplican en las clases: https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/tree/main/utils/Class. Específicamente se utilizan en casos de obtener datos de manera dinámica.

Convenciones y estilos de programación: Se utilizó programación orientada a objetos y la estructura del proyecto se encuentra lo suficientemente estructurado y diferenciado de manera de que sea legible. Cada función del proyecto se encuentra comentado; existe identación de los códigos los que permiten una mejor lectur; asimismo, se utiliza nombres de variables que sean significativas (ya sea en inglés o español).

Utilización correcta de estructuras de datos: Este punto se puede visualizar de manera transversal en el proyecto: https://github.com/andreajimeneze/SPRINT_INDIVIDUAL.

Manipulación de archivos: Se despliega un archivo pdf al generar una compra, cuya ruta de ejecución se encuentra en: https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/blob/main/routes/routes.js.

3) Página Web y HTML:

Utilización de tags html, estilos y responsividad - Utilización de Bootstrap: Se implementa la estructura html en https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/tree/main/views, los estilos se encuentran en: https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/tree/main/public/assets/styles. En relación a la responsividad se aplica con la utilización de bootstrap y en algunos casos con @media querys.

4) Lenguaje Node:

Inclusión de paquetes y librerías de usuario: Según lo indicado en las instrucciones de ejecución, punto 1. Se puede visualizar de manera clara en el archivo package.json: https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/blob/main/package.json.

Agrupación del código y separación por funcionalidad: La estructura del proyecto se divide en carpetas que incluyen archivos con funcionalidades afines. En el proyecto se visualiza la carpeta views con las vistas hbs y una subcarpeta partials con los partials que utilizan las vistas; una carpeta utils que contienen las clases (OOP) y archivo de funciones js; carpeta routes con las rutas del proyecto; y, por último, public con subcarpetas para los estilos y las imágenes utilizadas.

Utilización de funciones asíncronas: Se utilizan funciones asíncronas tanto en las clases (https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/tree/main/utils/Class) como en las rutas (https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/blob/main/routes/routes.js)

Lectura de parámetros de entrada: Se realiza lectura de parámetros de entradas en las rutas: https://github.com/andreajimeneze/SPRINT_INDIVIDUAL/blob/main/routes/routes.js.


5) Conexión a Base de Datos: 

Manejo de conexión a base de datos desde Node: La conexión a base de datos se realiza a través de la API levantada en el proyecto  https://github.com/andreajimeneze/API_SPRINT, específicamente en los controllers.js.

Manejo y ejecución de consultas desde Node: El manejo y ejecución de consultas se encuentran en el proyecto  https://github.com/andreajimeneze/API_SPRINT, específicamente en los controllers.js y routes.js

6) Uso de Express: 
Creación servicio Rest con Express: https://github.com/andreajimeneze/API_SPRINT