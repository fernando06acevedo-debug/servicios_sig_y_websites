# Visor geográfico de la división administrativa de Colombia

**Autor:** Luis Fernando Acevedo Suarez  
**Proyecto:** Taller 11 – Aplicación Web SIG con Leaflet  
**Tecnología principal:** Leaflet.js

## Presentación

Esta aplicación web permite visualizar y explorar información geográfica de la división político-administrativa de Colombia mediante un visor cartográfico interactivo.

El desarrollo integra tecnologías de publicación y consulta de información geográfica, combinando servicios OGC, una base de datos espacial y teselas vectoriales para representar diferentes niveles de información territorial.

La aplicación se encuentra alojada mediante GitHub Pages.

**Aplicación publicada:**  
https://fernando06acevedo-debug.github.io/servicios_sig_y_websites/Taller_11_Leaflet/

## Funcionalidades

- Visualización de departamentos de Colombia.
- Consulta y representación de municipios.
- Visualización de ciudades mediante información geográfica servida por WFS.
- Integración de capas WMS.
- Representación de municipios mediante Vector Tiles (MVT/PBF).
- Selección de mapas base: OpenStreetMap, Esri Satélite y CartoDB.
- Búsqueda y localización de ciudades.
- Consulta de atributos mediante ventanas emergentes.
- Resaltado de entidades geográficas al interactuar con el mapa.
- Control de capas, leyenda y escala cartográfica.
- Diseño adaptable a diferentes tamaños de pantalla.

## Fuentes y organización de la información

La aplicación integra información de la división político-administrativa asociada al Marco Geoestadístico Nacional (MGN) 2025.

La información se organiza y publica mediante servicios geográficos y una base de datos espacial:

| Componente | Función |
|---|---|
| GeoServer | Publicación de servicios WMS y WFS |
| PostgreSQL/PostGIS | Almacenamiento y gestión de información espacial |
| pg_tileserv | Publicación de teselas vectoriales |
| Leaflet.js | Visualización e interacción cartográfica |
| Leaflet.VectorGrid | Representación de Vector Tiles |

## Servicios geográficos implementados

**GeoServer – WMS**

Permite representar las capas de departamentos y municipios como servicios cartográficos.

**GeoServer – WFS**

Permite consultar entidades y atributos geográficos, incluyendo la información de ciudades.

**pg_tileserv – Vector Tiles**

Permite representar la capa de municipios mediante teselas vectoriales en formato PBF.

Los nombres de las capas y las direcciones de los servicios se encuentran documentados en `SERVICIOS_Y_CAPAS.md`.

## Estructura del proyecto

```text
Taller_11_Leaflet/
├── index.html
├── README.md
├── SERVICIOS_Y_CAPAS.md
├── Entrega_Capitulo11_Leaflet.zip
├── css/
│   └── style.css
├── js/
│   └── app.js
└── evidencias/
    └── LEEME.md
```

## Publicación y disponibilidad

La interfaz del visor se encuentra publicada mediante GitHub Pages.

Los servicios GeoServer y pg_tileserv utilizados durante el desarrollo están configurados en un entorno local. Por esta razón, las direcciones `localhost` permiten el acceso desde el equipo donde se encuentran ejecutándose los servicios, pero no constituyen servicios públicos disponibles desde cualquier ubicación de Internet.

Para habilitar el consumo externo de todas las capas es necesario desplegar GeoServer y pg_tileserv en una infraestructura accesible públicamente y actualizar las direcciones de conexión de la aplicación.

## Resultado del desarrollo

Como resultado se obtuvo un visor cartográfico que integra diferentes fuentes y formatos de información geográfica. La aplicación permite explorar la división administrativa de Colombia, consultar entidades, cambiar la cartografía base y visualizar información mediante servicios WMS, WFS y Vector Tiles.

Durante el desarrollo se realizaron pruebas de conexión, publicación y visualización de capas, así como ajustes en la configuración de los servicios y en la interacción del visor.

Este trabajo permitió aplicar los conceptos de servicios web geográficos y fortalecer la integración entre bases de datos espaciales, servidores cartográficos y aplicaciones web.

## Autoría

**Luis Fernando Acevedo Suarez**

Desarrollo académico realizado en el marco del curso de Servicios Web Geográficos.
