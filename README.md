# Reading list

Evaluación final del Módulo 4 - ADALAB.

El backend consiste en la gestión de una base de datos que almacena libros, con la información del título, el autor o autora, un breve resumen, la imagen de portada, el precio medio, las páginas y el género.

## Características Backend

- **Seguridad de datos:** se utiliza la autenticación JWT para acceder a rutas protegidas, y bcrypt para el encriptado de las contraseñas, de forma que no se vulnere la privacidad de los usuarios registrados.

## Tecnologías Utilizadas

- **Back-end**: NodeJS - SQL.

### ¿Cómo arrancar el proyecto desde local?

1. Clona este repositorio en tu ordenador.
2. Ejecuta la instalación de las dependencias recogidas en el `package.json` con el comando `npm install`
3. Crea un archivo `.env` siguiendo el modelo del fichero `.env_example` para configurar los datos de tu puerto y tu servidor en local.
4. Si lo deseas, puedes instalar nodemon como dependencia del proyecto, pero recomendamos instalarlo de forma global con el comando `npm install -g nodemon`
5. Ejecuta el comando `npm run dev`para verificar que se ha desplegado el puerto correctamente, usando nodemon.
6. Si no quieres utilizar nodemon (por ejemplo, en producción), arranca el servidor con el comando `npm run start`.
