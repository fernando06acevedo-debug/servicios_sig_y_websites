
/* =====================================================
   APLICACIÓN WEB SIG - LEAFLET
   Leaflet + GeoJSON estatico + GitHub Pages
   ===================================================== */

// =====================================================
// 1. CONFIGURACIÓN DE SERVICIOS
// =====================================================

// FUENTES GEOJSON ESTATICAS PARA GITHUB PAGES

const GEOJSON_BOSQUE =
    'https://epiragauta.github.io/geoservicios_y_websites/webapp/datos/85_CASANARE/Bosque.geojson';

const GEOJSON_DRENAJE =
    'https://epiragauta.github.io/geoservicios_y_websites/webapp/datos/85_CASANARE/Drenaje_Sencillo.geojson';



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
// CAPAS GEOJSON EXTERNAS - CASANARE
// =====================================================

// CAPA 1: BOSQUE
const capaBosque = L.geoJSON(null, {
    style: {
        color: '#176B36',
        weight: 1.5,
        fillColor: '#32A852',
        fillOpacity: 0.45
    },
    onEachFeature: function (feature, layer) {
        const propiedades = feature.properties || {};

        layer.bindPopup(
            '<b>Bosque - Casanare</b><br>' +
            Object.entries(propiedades)
                .map(([clave, valor]) =>
                    `<b>${clave}:</b> ${valor}`
                )
                .join('<br>')
        );
    }
});

// CAPA 2: DRENAJE SENCILLO
const capaDrenaje = L.geoJSON(null, {
    style: {
        color: '#0877D1',
        weight: 2.5,
        opacity: 0.9
    },
    onEachFeature: function (feature, layer) {
        const propiedades = feature.properties || {};

        layer.bindPopup(
            '<b>Drenaje sencillo - Casanare</b><br>' +
            Object.entries(propiedades)
                .map(([clave, valor]) =>
                    `<b>${clave}:</b> ${valor}`
                )
                .join('<br>')
        );
    }
});

// CARGA DIFERIDA DE ARCHIVOS GEOJSON EXTERNOS
// Los datos se descargan solamente cuando se activa cada capa.

let bosqueCargado = false;
let bosqueCargando = false;

let drenajeCargado = false;
let drenajeCargando = false;

// CARGAR BOSQUE AL ACTIVAR LA CAPA
capaBosque.on('add', function() {

    if (bosqueCargado || bosqueCargando) {
        return;
    }

    bosqueCargando = true;

    fetch(GEOJSON_BOSQUE)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error HTTP ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (!data.features || !Array.isArray(data.features)) {
                throw new Error('GeoJSON de Bosque no valido.');
            }

            capaBosque.addData(data);
            bosqueCargado = true;

            console.log(
                'Bosque - Casanare:',
                data.features.length,
                'elementos cargados'
            );
        })
        .catch(error => {
            console.error('Error en Bosque:', error);
        })
        .finally(() => {
            bosqueCargando = false;
        });

});

// CARGAR DRENAJE AL ACTIVAR LA CAPA
capaDrenaje.on('add', function() {

    if (drenajeCargado || drenajeCargando) {
        return;
    }

    drenajeCargando = true;

    fetch(GEOJSON_DRENAJE)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error HTTP ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (!data.features || !Array.isArray(data.features)) {
                throw new Error('GeoJSON de Drenaje no valido.');
            }

            capaDrenaje.addData(data);
            drenajeCargado = true;

            console.log(
                'Drenaje sencillo - Casanare:',
                data.features.length,
                'elementos cargados'
            );
        })
        .catch(error => {
            console.error('Error en Drenaje:', error);
        })
        .finally(() => {
            drenajeCargando = false;
        });

});

// =====================================================
// 3. CAPAS BASE
// =====================================================

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
// =====================================================
// 4. CONTROL DE CAPAS - GEOJSON ESTATICO
// =====================================================

const overlayLayers = {

    'Bosque - Casanare': capaBosque,

    'Drenaje sencillo - Casanare': capaDrenaje

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
// 5. MUNICIPIOS DE COLOMBIA - GEOJSON LOCAL
// =====================================================

let municipiosCargados = false;
let municipiosCargando = false;

const municipiosGeoJSON = L.geoJSON(null, {

    style: function() {
        return {
            color: '#34495e',
            weight: 1,
            opacity: 0.9,
            fillColor: '#3498db',
            fillOpacity: 0.20
        };
    },

    onEachFeature: function(feature, layer) {

        const props = feature.properties || {};

        const nombre = escapeHTML(
            props.mpio_cnmbr || 'Sin nombre'
        );

        const departamento = escapeHTML(
            props.dpto_cnmbr || 'No disponible'
        );

        const codigo = escapeHTML(
            props.mpio_ccdgo ||
            props.mpio_cdpmp ||
            'No disponible'
        );

        const area = Number(props.mpio_narea);

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

            '<p><strong>Codigo municipal:</strong> ' +
            codigo +
            '</p>' +

            '<p><strong>Area reportada:</strong> ' +
            areaTexto +
            '</p>' +

            '<p><strong>Fuente:</strong> DANE - MGN 2025</p>' +

            '<p><strong>Formato:</strong> GeoJSON local</p>';

        layer.bindPopup(contenido);

        layer.on('click', function() {

            actualizarPanel(

                '<p><strong>Municipio seleccionado</strong></p>' +

                '<p class="highlight">' +
                nombre +
                '</p>' +

                '<p><strong>Departamento:</strong> ' +
                departamento +
                '</p>' +

                '<p><strong>Codigo:</strong> ' +
                codigo +
                '</p>' +

                '<p><strong>Area reportada:</strong> ' +
                areaTexto +
                '</p>' +

                '<p><strong>Fuente:</strong> DANE - MGN 2025</p>'

            );

        });

    }

});

// Carga diferida: solo descarga los municipios cuando
// el usuario activa la capa desde el control de Leaflet.
municipiosGeoJSON.on('add', function() {

    if (municipiosCargados || municipiosCargando) {
        return;
    }

    municipiosCargando = true;

    fetch('datos/colombia/municipios.geojson')

        .then(function(response) {

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            return response.json();

        })

        .then(function(data) {

            if (!data.features || data.features.length === 0) {
                throw new Error('El GeoJSON no contiene municipios.');
            }

            municipiosGeoJSON.addData(data);

            municipiosCargados = true;
            municipiosCargando = false;

            console.log(
                'Municipios GeoJSON locales cargados:',
                data.features.length
            );

        })

        .catch(function(error) {

            municipiosCargando = false;

            console.error(
                'Error al cargar municipios locales:',
                error
            );

            actualizarPanel(
                '<p><strong>Error al cargar municipios.</strong></p>' +
                '<p>Verifica el archivo datos/colombia/municipios.geojson.</p>'
            );

        });

});

layerControl.addOverlay(
    municipiosGeoJSON,
    'Municipios de Colombia (GeoJSON local)'
);


// INICIO CAPAS BOYACA - CARGA DIFERIDA
// Los GeoJSON se descargan al activar cada capa.

function crearCapaBoyaca(config) {

    let cargada = false;
    let cargando = false;

    const capa = L.geoJSON(null, {

        style: config.style,

        pointToLayer: config.pointToLayer,

        onEachFeature: function(feature, layer) {

            const props = feature.properties || {};

            const titulo =
                props[config.campoTitulo] ||
                config.nombre;

            const filas = Object.entries(props)
                .filter(([clave, valor]) =>
                    valor !== null &&
                    valor !== undefined &&
                    String(valor).trim() !== ''
                )
                .slice(0, 10)
                .map(([clave, valor]) => {

                    const texto = typeof valor === 'object'
                        ? JSON.stringify(valor)
                        : String(valor);

                    return '<p><strong>' +
                        escapeHTML(clave) +
                        ':</strong> ' +
                        escapeHTML(texto) +
                        '</p>';
                })
                .join('');

            layer.bindPopup(
                '<div class="popup-title">' +
                escapeHTML(titulo) +
                '</div>' +
                '<div class="popup-divider"></div>' +
                filas +
                '<p><strong>Fuente:</strong> GeoJSON local de Boyaca</p>'
            );
        }
    });

    capa.on('add', function() {

        if (cargada || cargando) {
            return;
        }

        cargando = true;

        fetch(config.url)

            .then(function(response) {

                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }

                return response.json();

            })

            .then(function(data) {

                if (!data || !Array.isArray(data.features)) {
                    throw new Error('El archivo no contiene un GeoJSON valido.');
                }

                capa.addData(data);

                cargada = true;

                console.log(
                    config.nombre + ':',
                    data.features.length,
                    'elementos cargados correctamente.'
                );

            })

            .catch(function(error) {

                console.error(
                    'Error al cargar ' + config.nombre + ':',
                    error
                );

                actualizarPanel(
                    '<p><strong>Error al cargar ' +
                    escapeHTML(config.nombre) +
                    '.</strong></p>' +
                    '<p>Verifica el archivo GeoJSON correspondiente.</p>'
                );

            })

            .finally(function() {
                cargando = false;
            });

    });

    layerControl.addOverlay(
        capa,
        config.nombre
    );

    return capa;
}

// 1. HOSPITALES DE BOYACA
const capaHospitalesBoyaca = crearCapaBoyaca({

    nombre: 'Hospitales de Boyaca',

    url: 'datos/boyaca/hospitales_boyaca.geojson',

    campoTitulo: 'Nombre',

    pointToLayer: function(feature, latlng) {

        return L.circleMarker(latlng, {
            radius: 6,
            color: '#7B1FA2',
            weight: 2,
            fillColor: '#CE93D8',
            fillOpacity: 0.9
        });
    }

});

// 2. MUNICIPIOS DE BOYACA
const capaMunicipiosBoyaca = crearCapaBoyaca({

    nombre: 'Municipios de Boyaca',

    url: 'datos/boyaca/municipios_boyaca.geojson',

    campoTitulo: 'mpio_cnmbr',

    style: {
        color: '#145A8D',
        weight: 1.2,
        opacity: 0.9,
        fillColor: '#5DADE2',
        fillOpacity: 0.18
    }

});

// 3. PROVINCIAS DE BOYACA
const capaProvinciasBoyaca = crearCapaBoyaca({

    nombre: 'Provincias de Boyaca',

    url: 'datos/boyaca/provincias_boyaca.geojson',

    campoTitulo: 'provincia',

    style: {
        color: '#B9770E',
        weight: 1.5,
        opacity: 0.95,
        fillColor: '#F5B041',
        fillOpacity: 0.22
    }

});

// 4. RED VIAL DEPARTAMENTAL
const capaRedVialBoyaca = crearCapaBoyaca({

    nombre: 'Red vial departamental - Boyaca',

    url: 'datos/boyaca/red_vial_departamental.geojson',

    campoTitulo: 'NOMBREVIA',

    style: {
        color: '#D35400',
        weight: 2,
        opacity: 0.85
    }

});

// 5. VEREDAS DE BOYACA
const capaVeredasBoyaca = crearCapaBoyaca({

    nombre: 'Veredas de Boyaca',

    url: 'datos/boyaca/veredas_boyaca.geojson',

    campoTitulo: 'NOMBRE_VER',

    style: {
        color: '#287A45',
        weight: 0.8,
        opacity: 0.85,
        fillColor: '#82C785',
        fillOpacity: 0.16
    }

});

// FIN CAPAS BOYACA - CARGA DIFERIDA





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
        '<span>Municipios GeoJSON</span>' +
        '</div>' +

        '<div class="legend-item">' +
        '<i style="background:#e74c3c; opacity:0.9;"></i>' +
        '<span>Ciudades GeoJSON</span>' +
        '</div>' +

        '<div class="legend-item">' +
        '<i style="background:#ffffff;"></i>' +
        '<span>Limites administrativos GeoJSON</span>' +
        '</div>' +

        '<div class="legend-item">' +
        '<i style="background:#32A852; opacity:0.7;"></i>' +
        '<span>Bosque - Casanare</span>' +
        '</div>' +

        '<div class="legend-item">' +
        '<i style="background:#0877D1;"></i>' +
        '<span>Drenaje sencillo - Casanare</span>' +
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
// 10. CIUDADES GEOJSON
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

function cargarCiudadesGeoJSON() {

    fetch('datos/colombia/ciudades.geojson')

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

                        '<p><strong>Fuente:</strong> GeoJSON local</p>';

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
                'Ciudades (GeoJSON local)'
            );

            console.log(
                'Ciudades GeoJSON locales cargadas:',
                data.features.length
            );

            actualizarPanel(

                '<p><strong>Datos geograficos locales cargados</strong></p>' +

                '<p>Ciudades cargadas: ' +
                data.features.length +
                '</p>' +

                '<p>Departamentos y municipios disponibles mediante GeoJSON.</p>' +

                '<p class="info-text">Utiliza el buscador para localizar ciudades.</p>'

            );

        })

        .catch(error => {

            console.error(
                'Error al cargar ciudades GeoJSON:',
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
// 11. DEPARTAMENTOS GEOJSON
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

function cargarDepartamentosGeoJSON() {

    fetch('datos/colombia/departamentos.geojson')

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
                'Departamentos de Colombia (GeoJSON local)'
            );

            console.log(
                'Departamentos GeoJSON locales cargados:',
                data.features.length
            );

        })

        .catch(error => {

            console.error(
                'Error al cargar departamentos GeoJSON:',
                error
            );

            actualizarPanel(

                '<p><strong>Error al cargar departamentos GeoJSON.</strong></p>' +

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

                    '<p>La ubicación fue encontrada en los datos GeoJSON locales.</p>'

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

        configurarBuscador();



        cargarCiudadesGeoJSON();

        cargarDepartamentosGeoJSON();

    }
);

console.log(
    'Aplicación de Servicios Web Geográficos cargada.'
);
