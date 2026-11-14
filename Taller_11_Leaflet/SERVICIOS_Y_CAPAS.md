# Servicios geográficos y capas - Taller 11

## GeoServer

Servidor local: http://localhost:8080/geoserver

### Servicio WMS
http://localhost:8080/geoserver/taller_gis/wms?service=WMS&version=1.1.0&request=GetCapabilities

### Servicio WFS
http://localhost:8080/geoserver/taller_gis/ows?service=WFS&version=2.0.0&request=GetCapabilities

### Capas publicadas
- taller_gis:departamentos_mgn2025
- taller_gis:municipios_mgn2025
- taller_gis:ciudades

## pg_tileserv

Catálogo:
http://localhost:7800/

Metadatos de municipios:
http://localhost:7800/public.municipios_mgn2025.json

### Vector Tiles PBF
http://localhost:7800/public.municipios_mgn2025/{z}/{x}/{y}.pbf

## Consideraciones

Los servicios anteriores están configurados en entorno local.
Las direcciones localhost solo funcionan en el computador donde
están instalados y encendidos GeoServer y pg_tileserv.

Para acceso desde Internet será necesario desplegar estos servicios
en un servidor público y actualizar las direcciones de la aplicación.
