
/* =====================================================
   APLICACIÓN WEB SIG - LEAFLET
   GeoServer + PostGIS + WMS + WFS + VECTOR TILES
   ===================================================== */

// =====================================================
// 1. CONFIGURACIÓN DE SERVICIOS
// =====================================================

const GEOSERVER_OWS =
    'http://localhost:8080/geoserver/taller_gis/ows';

const GEOSERVER_WMS =
    'http://localhost:8080/geoserver/taller_gis/wms';

const PG_TILESERV =
    'http://localhost:7800';

const WFS_URL =
    GEOSERVER_OWS +
    '?service=WFS&version=2.0.0&request=GetFeature' +
    '&typeNames=taller_gis:ciudades' +
    '&outputFormat=application/json&srsName=EPSG:4326';

const WFS_DEPARTAMENTOS_URL =
    GEOSERVER_OWS +
    '?service=WFS&version=2.0.0&request=GetFeature' +
    '&typeNames=taller_gis:departamentos_mgn2025' +
    '&outputFormat=application/json&srsName=EPSG:4326';

const MUNICIPIOS_VECTOR_URL =
    PG_TILESERV +
    '/public.municipios_mgn2025/{z}/{x}/{y}.pbf';

// =====================================================
// 2. CONFIGURACIÓN DEL MAPA
// =====================================================

const MAP_CONFIG = {
    center: [5.5353, -73.3678],
    zoom: 6,
    minZoom: 3,
    maxZoom: 19
};

const map = L.map('map', {
    center: MAP_CONFIG.center,
    zoom: MAP_CONFIG.zoom,
    minZoom: MAP_CONFIG.minZoom,
    maxZoom: MAP_CONFIG.maxZoom
});

// =====================================================
// 3. CAPAS BASE
// =====================================================

const baseLayers = {

    'Mapa base (OSM)': L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }
    ),

    'Satélite (Esri)': L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
            attribution: 'Tiles &copy; Esri',
            maxZoom: 18
        }
    ),

    'Calles (CartoDB)': L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }
    )

};

baseLayers['Mapa base (OSM)'].addTo(map);

// =====================================================
// 4. CAPAS WMS - GEOSERVER
// =====================================================

const departamentosWMS = L.tileLayer.wms(GEOSERVER_WMS, {
    layers: 'taller_gis:departamentos_mgn2025',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    styles: 'polygon',
    opacity: 0.90,
    tiled: true,
    zIndex: 400,
    attribution: 'DANE - MGN 2025'
});

const municipiosWMS = L.tileLayer.wms(GEOSERVER_WMS, {
    layers: 'taller_gis:municipios_mgn2025',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    styles: 'polygon',
    opacity: 0.75,
    tiled: true,
    zIndex: 450,
    attribution: 'DANE - MGN 2025'
});

departamentosWMS.addTo(map);

// =====================================================
// 5. CONTROL DE CAPAS
// =====================================================

const overlayLayers = {

    'Departamentos de Colombia (WMS)': departamentosWMS,

    'Municipios de Colombia (WMS)': municipiosWMS

};

const layerControl = L.control.layers(
    baseLayers,
    overlayLayers,
    {
        position: 'topright',
        collapsed: false
    }
).addTo(map);

// =====================================================
// 6. MUNICIPIOS VECTOR TILES - PG_TILESERV
// =====================================================

let municipiosVectorTiles = null;

function configurarMunicipiosVectorTiles() {

    if (typeof L.vectorGrid === 'undefined') {

        console.error(
            'Leaflet.VectorGrid no está disponible. ' +
            'Revisa la biblioteca incluida en index.html.'
        );

        return;

    }

    municipiosVectorTiles = L.vectorGrid.protobuf(
        MUNICIPIOS_VECTOR_URL,
        {

            rendererFactory: L.canvas.tile,

            vectorTileLayerStyles: {

                municipios_mgn2025: {
                    weight: 1,
                    color: '#34495e',
                    opacity: 0.9,
                    fill: true,
                    fillColor: '#3498db',
                    fillOpacity: 0.20
                }

            },

            interactive: true,

            minZoom: 3,

            maxNativeZoom: 14,

            maxZoom: 19,

            zIndex: 460,

            getFeatureId: function(feature) {
                return feature.properties.objectid;
            }

        }
    );

    municipiosVectorTiles.on('click', function(event) {

        const propiedades = event.layer.properties || {};

        const nombre = escapeHTML(
            propiedades.mpio_cnmbr || 'Sin nombre'
        );

        const departamento = escapeHTML(
            propiedades.dpto_cnmbr || 'No disponible'
        );

        const codigo = escapeHTML(
            propiedades.mpio_ccdgo || 'No disponible'
        );

        const area = Number(propiedades.mpio_narea);

        const areaTexto = Number.isFinite(area)
            ? area.toLocaleString('es-CO')
            : 'No disponible';

        const contenido =

            '<div class="popup-title">' +
            nombre +
            '</div>' +

            '<div class="popup-divider"></div>' +

            '<p><strong>Departamento:</strong> ' +
            departamento +
            '</p>' +

            '<p><strong>Código municipal:</strong> ' +
            codigo +
            '</p>' +

            '<p><strong>Área reportada:</strong> ' +
            areaTexto +
            '</p>' +

            '<p><strong>Fuente:</strong> DANE - MGN 2025</p>' +

            '<p><strong>Servicio:</strong> pg_tileserv - Vector Tiles</p>';

        L.popup()
            .setLatLng(event.latlng)
            .setContent(contenido)
            .openOn(map);

        actualizarPanel(

            '<p><strong>Municipio seleccionado</strong></p>' +

            '<p class="highlight">' +
            nombre +
            '</p>' +

            '<p><strong>Departamento:</strong> ' +
            departamento +
            '</p>' +

            '<p><strong>Código:</strong> ' +
            codigo +
            '</p>' +

            '<p><strong>Área reportada:</strong> ' +
            areaTexto +
            '</p>' +

            '<p><strong>Fuente:</strong> DANE - MGN 2025</p>'

        );

    });

    municipiosVectorTiles.on('tileerror', function(error) {

        console.error(
            'Error al cargar una tesela de municipios:',
            error
        );

    });

    layerControl.addOverlay(
        municipiosVectorTiles,
        'Municipios de Colombia (Vector Tiles - PBF)'
    );

    console.log(
        'Municipios Vector Tiles configurados:',
        MUNICIPIOS_VECTOR_URL
    );

}

// =====================================================
// 7. ESCALA
// =====================================================

L.control.scale({

    position: 'bottomleft',

    metric: true,

    imperial: false

}).addTo(map);

// =====================================================
// 8. LEYENDA
// =====================================================

const legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function() {

    const div = L.DomUtil.create('div', 'legend');

    div.innerHTML =

        '<h4>Leyenda</h4>' +

        '<div class="legend-item">' +
        '<i style="background:#f1c40f; opacity:0.5;"></i>' +
        '<span>Departamentos</span>' +
        '</div>' +

        '<div class="legend-item">' +
        '<i style="background:#3498db; opacity:0.6;"></i>' +
        '<span>Municipios Vector Tiles</span>' +
        '</div>' +

        '<div class="legend-item">' +
        '<i style="background:#e74c3c; opacity:0.9;"></i>' +
        '<span>Ciudades WFS</span>' +
        '</div>' +

        '<div class="legend-item">' +
        '<i style="background:#ffffff;"></i>' +
        '<span>Límites administrativos WMS</span>' +
        '</div>';

    return div;

};

legend.addTo(map);

// =====================================================
// 9. FUNCIONES AUXILIARES
// =====================================================

function escapeHTML(value) {

    return String(value ?? '').replace(/[&<>"']/g, character => ({

        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'

    })[character]);

}

function actualizarPanel(mensaje) {

    const panel = document.getElementById('info-panel');

    if (panel) {
        panel.innerHTML = mensaje;
    }

}

function normalizarTexto(texto) {

    return String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

}

// =====================================================
// 10. CIUDADES WFS
// =====================================================

let ciudadesGeoJSON = null;

let ciudadesData = null;

let marcadorBusqueda = null;

function estiloCiudad() {

    return {

        radius: 8,

        fillColor: '#e74c3c',

        color: '#ffffff',

        weight: 2,

        opacity: 1,

        fillOpacity: 0.9

    };

}

function resaltarCiudad(e) {

    e.target.setStyle({

        radius: 12,

        fillColor: '#f1c40f',

        weight: 3

    });

}

function restaurarCiudad(e) {

    if (ciudadesGeoJSON) {
        ciudadesGeoJSON.resetStyle(e.target);
    }

}

function obtenerNombreCiudad(feature) {

    const props = feature.properties || {};

    return props.nombre ||
        props.NOMBRE ||
        props.nom_ciudad ||
        props.name ||
        'Sin nombre';

}

function cargarCiudadesWFS() {

    fetch(WFS_URL)

        .then(response => {

            if (!response.ok) {
                throw new Error('Respuesta HTTP: ' + response.status);
            }

            return response.json();

        })

        .then(data => {

            if (!data.features || data.features.length === 0) {

                throw new Error(
                    'El servicio no devolvió ciudades.'
                );

            }

            ciudadesData = data;

            ciudadesGeoJSON = L.geoJSON(data, {

                pointToLayer: function(feature, latlng) {

                    return L.circleMarker(
                        latlng,
                        estiloCiudad()
                    );

                },

                onEachFeature: function(feature, layer) {

                    const props = feature.properties || {};

                    const nombre = escapeHTML(
                        obtenerNombreCiudad(feature)
                    );

                    const poblacion = Number(
                        props.poblacion || 0
                    );

                    const contenido =

                        '<div class="popup-title">' +
                        nombre +
                        '</div>' +

                        '<div class="popup-divider"></div>' +

                        '<p><strong>Población:</strong> ' +
                        poblacion.toLocaleString('es-CO') +
                        '</p>' +

                        '<p><strong>Fuente:</strong> GeoServer WFS</p>';

                    layer.bindPopup(contenido);

                    layer.on({

                        mouseover: resaltarCiudad,

                        mouseout: restaurarCiudad

                    });

                    layer.on('click', function() {

                        actualizarPanel(

                            '<p><strong>Ciudad seleccionada</strong></p>' +

                            '<p class="highlight">' +
                            nombre +
                            '</p>' +

                            '<p><strong>Población:</strong> ' +
                            poblacion.toLocaleString('es-CO') +
                            '</p>'

                        );

                    });

                }

            }).addTo(map);

            layerControl.addOverlay(
                ciudadesGeoJSON,
                'Ciudades (WFS - GeoJSON)'
            );

            console.log(
                'Ciudades WFS cargadas:',
                data.features.length
            );

            actualizarPanel(

                '<p><strong>Conexión exitosa con GeoServer</strong></p>' +

                '<p>Ciudades cargadas: ' +
                data.features.length +
                '</p>' +

                '<p>Departamentos y municipios disponibles mediante WMS y Vector Tiles.</p>' +

                '<p class="info-text">Utiliza el buscador para localizar ciudades.</p>'

            );

        })

        .catch(error => {

            console.error(
                'Error al cargar ciudades WFS:',
                error
            );

            const resultados = document.getElementById(
                'search-results'
            );

            if (resultados) {

                resultados.innerHTML =

                    '<p class="info-text">No se pudieron cargar las ciudades: ' +

                    escapeHTML(error.message) +

                    '</p>';

            }

        });

}

// =====================================================
// 11. DEPARTAMENTOS WFS
// =====================================================

let departamentosGeoJSON = null;

let departamentosData = null;

function estiloDepartamento() {

    return {

        color: '#263238',

        weight: 1.5,

        opacity: 1,

        fillColor: '#f1c40f',

        fillOpacity: 0.08

    };

}

function resaltarDepartamento(e) {

    const layer = e.target;

    layer.setStyle({

        color: '#e67e22',

        weight: 3,

        fillColor: '#f39c12',

        fillOpacity: 0.30

    });

    layer.bringToFront();

}

function restaurarDepartamento(e) {

    if (departamentosGeoJSON) {
        departamentosGeoJSON.resetStyle(e.target);
    }

    actualizarPanel(

        '<p><strong>Información geográfica</strong></p>' +

        '<p>Colombia - Departamentos</p>' +

        '<p class="info-text">Pasa el cursor sobre un departamento o haz clic para consultar sus atributos.</p>'

    );

}

function cargarDepartamentosWFS() {

    fetch(WFS_DEPARTAMENTOS_URL)

        .then(response => {

            if (!response.ok) {
                throw new Error('Respuesta HTTP: ' + response.status);
            }

            return response.json();

        })

        .then(data => {

            if (!data.features || data.features.length === 0) {

                throw new Error(
                    'El servicio no devolvió departamentos.'
                );

            }

            departamentosData = data;

            departamentosGeoJSON = L.geoJSON(data, {

                style: estiloDepartamento,

                onEachFeature: function(feature, layer) {

                    const props = feature.properties || {};

                    const codigo = escapeHTML(
                        props.dpto_ccdgo || 'No disponible'
                    );

                    const nombre = escapeHTML(
                        props.dpto_cnmbr || 'Sin nombre'
                    );

                    const anioCreacion = escapeHTML(
                        props.dpto_ano_crcn || 'No disponible'
                    );

                    const actoAdministrativo = escapeHTML(
                        props.dpto_act_adm || 'No disponible'
                    );

                    const area = escapeHTML(
                        props.dpto_narea || 'No disponible'
                    );

                    const anioReferencia = escapeHTML(
                        props.dpto_nano || 'No disponible'
                    );

                    const contenido =

                        '<div class="popup-title">' +
                        nombre +
                        '</div>' +

                        '<div class="popup-divider"></div>' +

                        '<p><strong>Código:</strong> ' +
                        codigo +
                        '</p>' +

                        '<p><strong>Año de creación:</strong> ' +
                        anioCreacion +
                        '</p>' +

                        '<p><strong>Acto administrativo:</strong> ' +
                        actoAdministrativo +
                        '</p>' +

                        '<p><strong>Área:</strong> ' +
                        area +
                        '</p>' +

                        '<p><strong>Año de referencia:</strong> ' +
                        anioReferencia +
                        '</p>' +

                        '<p><strong>Fuente:</strong> DANE - MGN 2025</p>';

                    layer.bindPopup(contenido);

                    const informacion =

                        '<p><strong>Departamento seleccionado</strong></p>' +

                        '<p class="highlight">' +
                        nombre +
                        '</p>' +

                        '<p><strong>Código:</strong> ' +
                        codigo +
                        '</p>' +

                        '<p><strong>Año de creación:</strong> ' +
                        anioCreacion +
                        '</p>' +

                        '<p><strong>Área:</strong> ' +
                        area +
                        '</p>' +

                        '<p><strong>Año de referencia:</strong> ' +
                        anioReferencia +
                        '</p>' +

                        '<p><strong>Fuente:</strong> DANE - MGN 2025</p>';

                    layer.on({

                        mouseover: function(e) {

                            resaltarDepartamento(e);

                            actualizarPanel(informacion);

                        },

                        mouseout: restaurarDepartamento,

                        click: function() {

                            actualizarPanel(informacion);

                            layer.openPopup();

                        }

                    });

                }

            }).addTo(map);

            layerControl.addOverlay(
                departamentosGeoJSON,
                'Departamentos interactivos (WFS - GeoJSON)'
            );

            console.log(
                'Departamentos WFS cargados:',
                data.features.length
            );

        })

        .catch(error => {

            console.error(
                'Error al cargar departamentos WFS:',
                error
            );

            actualizarPanel(

                '<p><strong>Error al cargar departamentos WFS.</strong></p>' +

                '<p>' +
                escapeHTML(error.message) +
                '</p>'

            );

        });

}

// =====================================================
// 12. BUSCADOR DE CIUDADES
// =====================================================

function configurarBuscador() {

    const searchInput = document.getElementById(
        'search-input'
    );

    const searchButton = document.getElementById(
        'search-button'
    );

    const searchResults = document.getElementById(
        'search-results'
    );

    if (!searchInput || !searchButton || !searchResults) {

        console.error(
            'No se encontraron los elementos del buscador.'
        );

        return;

    }

    function buscarCiudad() {

        const termino = normalizarTexto(
            searchInput.value
        );

        searchResults.innerHTML = '';

        if (!termino) {

            searchResults.innerHTML =
                '<p class="info-text">Escribe el nombre de una ciudad.</p>';

            return;

        }

        if (!ciudadesData || !ciudadesGeoJSON) {

            searchResults.innerHTML =
                '<p class="info-text">Las ciudades todavía se están cargando.</p>';

            return;

        }

        const resultados = ciudadesData.features.filter(
            feature => {

                const nombre = normalizarTexto(
                    obtenerNombreCiudad(feature)
                );

                return nombre.includes(termino);

            }
        );

        if (resultados.length === 0) {

            searchResults.innerHTML =
                '<p class="info-text">No se encontraron ciudades con ese nombre.</p>';

            return;

        }

        const titulo = document.createElement('h3');

        titulo.textContent =
            'Resultados encontrados: ' +
            resultados.length;

        searchResults.appendChild(titulo);

        resultados.forEach(feature => {

            const nombre = obtenerNombreCiudad(feature);

            const item = document.createElement('div');

            item.className = 'search-result-item';

            item.textContent = nombre;

            item.addEventListener('click', function() {

                const layerEncontrada =
                    ciudadesGeoJSON.getLayers().find(
                        layer => layer.feature === feature
                    );

                if (!layerEncontrada) {
                    return;
                }

                const latlng = layerEncontrada.getLatLng();

                map.setView(latlng, 13, {
                    animate: true
                });

                layerEncontrada.openPopup();

                if (marcadorBusqueda) {
                    map.removeLayer(marcadorBusqueda);
                }

                marcadorBusqueda = L.marker(latlng)
                    .addTo(map)
                    .bindPopup(
                        '<strong>' +
                        escapeHTML(nombre) +
                        '</strong>'
                    );

                marcadorBusqueda.openPopup();

                actualizarPanel(

                    '<p><strong>Ciudad localizada</strong></p>' +

                    '<p class="highlight">' +
                    escapeHTML(nombre) +
                    '</p>' +

                    '<p>La ubicación fue encontrada mediante el servicio WFS.</p>'

                );

            });

            searchResults.appendChild(item);

        });

    }

    searchButton.addEventListener(
        'click',
        buscarCiudad
    );

    searchInput.addEventListener(
        'keydown',
        function(event) {

            if (event.key === 'Enter') {
                buscarCiudad();
            }

        }
    );

    console.log(
        'Buscador de ciudades configurado correctamente.'
    );

}

// =====================================================
// 13. INICIALIZACIÓN DE LA APLICACIÓN
// =====================================================

document.addEventListener(
    'DOMContentLoaded',
    function() {

        console.log(
            'Iniciando aplicación Leaflet...'
        );

        console.log(
            'GeoServer WFS ciudades:',
            WFS_URL
        );

        console.log(
            'GeoServer WFS departamentos:',
            WFS_DEPARTAMENTOS_URL
        );

        console.log(
            'GeoServer WMS:',
            GEOSERVER_WMS
        );

        console.log(
            'pg_tileserv:',
            MUNICIPIOS_VECTOR_URL
        );

        configurarBuscador();

        configurarMunicipiosVectorTiles();

        cargarCiudadesWFS();

        cargarDepartamentosWFS();

    }
);

console.log(
    'Aplicación de Servicios Web Geográficos cargada.'
);
