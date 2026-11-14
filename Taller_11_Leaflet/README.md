# Visor geografico de la division administrativa de Colombia

**Autor:** Luis Fernando Acevedo Suarez
**Proyecto:** Taller 11 - Aplicacion Web SIG con Leaflet
**Tecnologia principal:** Leaflet.js

## Presentacion

Aplicacion web cartografica para visualizar y explorar informacion geografica de Colombia mediante un visor interactivo desarrollado con Leaflet.

La version publicada utiliza archivos GeoJSON estaticos alojados en el repositorio. No requiere ejecutar GeoServer, PostGIS, pg_tileserv ni servicios locales para cargar las capas GeoJSON incluidas en el proyecto.

**URL prevista de publicacion:**

https://fernando06acevedo-debug.github.io/servicios_sig_y_websites/Taller_11_Leaflet/

## Funcionalidades

- Visualizacion de departamentos de Colombia.
- Consulta de municipios mediante GeoJSON.
- Visualizacion de ciudades mediante GeoJSON.
- Busqueda y localizacion de ciudades.
- Consulta de atributos mediante ventanas emergentes.
- Resaltado de entidades geograficas.
- Control de capas, leyenda y escala cartografica.
- Seleccion de mapas base.
- Carga diferida de capas de mayor tamano cuando corresponda.
- Diseno adaptable a diferentes tamanos de pantalla.

## Tecnologias

| Componente | Funcion |
|---|---|
| HTML5 | Estructura de la aplicacion |
| CSS3 | Presentacion y diseno |
| JavaScript | Logica e interaccion |
| Leaflet.js | Visualizacion cartografica |
| GeoJSON | Almacenamiento e intercambio de entidades geograficas |
| GitHub Pages | Alojamiento de la aplicacion estatica |

## Datos geograficos

Los archivos GeoJSON se encuentran organizados en la carpeta `datos/`.

### Colombia

- `datos/colombia/ciudades.geojson`
- `datos/colombia/departamentos.geojson`
- `datos/colombia/municipios.geojson`

### Boyaca

- `datos/boyaca/municipios_boyaca.geojson`
- `datos/boyaca/provincias_boyaca.geojson`
- `datos/boyaca/veredas_boyaca.geojson`
- `datos/boyaca/hospitales_boyaca.geojson`
- `datos/boyaca/red_vial_departamental.geojson`

Los archivos GeoJSON de Colombia y Boyaca estan integrados en el visor. Las capas de mayor tamano utilizan carga diferida: sus datos se solicitan cuando el usuario las activa desde el control de capas.

La informacion administrativa nacional se relaciona con el Marco Geoestadistico Nacional (MGN) 2025, de acuerdo con los datos utilizados en el proyecto.

## Mapas base y fuentes externas

Los mapas base pueden depender de proveedores externos y de la disponibilidad de sus servicios.

Las capas externas de Casanare configuradas en la aplicacion tambien requieren acceso a Internet y que sus fuentes permanezcan disponibles.

## Estructura del proyecto

```text
Taller_11_Leaflet/
|-- index.html
|-- README.md
|-- SERVICIOS_Y_CAPAS.md
|-- css/
|   |-- style.css
|-- js/
|   |-- app.js
|-- datos/
|   |-- colombia/
|   |-- boyaca/
|-- evidencias/
```

## Publicacion

La aplicacion esta preparada para su alojamiento como sitio estatico mediante GitHub Pages.

La ruta de publicacion corresponde a:

`/servicios_sig_y_websites/Taller_11_Leaflet/`

Los archivos HTML, CSS, JavaScript y GeoJSON se sirven desde el repositorio. GitHub Pages no ejecuta bases de datos ni servidores cartograficos.

## Resultado

El proyecto integra herramientas de desarrollo web y Sistemas de Informacion Geografica para facilitar la exploracion de informacion territorial mediante una interfaz cartografica interactiva.

## Autor

**Luis Fernando Acevedo Suarez**

Desarrollo academico realizado en el marco del curso de Servicios Web Geograficos.