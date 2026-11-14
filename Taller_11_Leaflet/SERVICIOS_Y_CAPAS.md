# Datos, capas y fuentes - Taller 11

## 1. Arquitectura de la version publicada

La aplicacion publicada utiliza una arquitectura estatica:

- HTML para la estructura.
- CSS para la presentacion.
- JavaScript y Leaflet para la interaccion cartografica.
- GeoJSON para las entidades geograficas.
- GitHub Pages para alojar los archivos del visor.

La version publicada no necesita conectarse a GeoServer, PostGIS ni pg_tileserv para cargar los archivos GeoJSON locales.

## 2. Archivos GeoJSON de Colombia

Ubicacion: `datos/colombia/`

| Archivo | Contenido |
|---|---|
| `ciudades.geojson` | Ciudades |
| `departamentos.geojson` | Departamentos |
| `municipios.geojson` | Municipios |

## 3. Archivos GeoJSON de Boyaca

Ubicacion: `datos/boyaca/`

| Archivo | Contenido |
|---|---|
| `municipios_boyaca.geojson` | Municipios de Boyaca |
| `provincias_boyaca.geojson` | Geometrias municipales con atributo de provincia |
| `veredas_boyaca.geojson` | Veredas |
| `hospitales_boyaca.geojson` | Puntos de hospitales |
| `red_vial_departamental.geojson` | Red vial departamental |

Nota: `provincias_boyaca.geojson` contiene geometrias municipales con informacion de provincia; no corresponde a una capa de provincias disueltas.

Los cinco archivos GeoJSON de Boyaca estan integrados como capas independientes en el visor. Se pueden activar y desactivar desde el control de capas. La carga de sus datos es diferida.

## 4. Capas externas

La aplicacion conserva fuentes externas de Casanare configuradas en el codigo:

- Bosque:
  `https://epiragauta.github.io/geoservicios_y_websites/webapp/datos/85_CASANARE/Bosque.geojson`
- Drenaje sencillo:
  `https://epiragauta.github.io/geoservicios_y_websites/webapp/datos/85_CASANARE/Drenaje_Sencillo.geojson`

Estas capas dependen de la disponibilidad del sitio externo y de que permita solicitudes desde el dominio de GitHub Pages.

## 5. Mapas base

Los mapas base se obtienen de proveedores externos configurados en `js/app.js`. Su disponibilidad depende de la conexion a Internet y de las condiciones de uso de cada proveedor.

## 6. Servicios del entorno de desarrollo

Durante etapas anteriores del taller se utilizaron GeoServer, PostgreSQL/PostGIS y pg_tileserv en un entorno local para practicar servicios OGC y teselas vectoriales.

Esos servicios locales no forman parte de los requisitos de ejecucion de la version estatica descrita en este documento.

Las direcciones `localhost` utilizadas durante el desarrollo no son servicios publicos y no deben utilizarse como dependencias de la aplicacion publicada.