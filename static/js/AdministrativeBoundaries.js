// ================================
// TREE MENU
// ================================
function toggleTree(id, element) {

    let tree = document.getElementById(id);
    let arrow = element.querySelector(".arrow");

    if (tree.style.display == "block") {

        tree.style.display = "none";
        arrow.classList.remove("fa-minus");
        arrow.classList.add("fa-plus");

    } else {

        tree.style.display = "block";
        arrow.classList.remove("fa-plus");
        arrow.classList.add("fa-minus");

    }
}


// ================================
// MAP
// ================================
var map = L.map('map').setView([17.1, 79.3], 8);

//==============================
//ZOOMING
//=============================
const layerBounds = {
    State: L.latLngBounds([12.6, 76.7], [19.9, 84.0]),
    District: L.latLngBounds([16.0, 78.0], [17.8, 80.2]),
    Village: L.latLngBounds([18.840267, 79.416114], [18.910657, 79.488692]),
    Mandal: L.latLngBounds([[18.664696, 78.883718], [19.292326, 79.959857]])
};

function zoomToLayer(layerName) {
    if (layerBounds[layerName]) {
        map.fitBounds(layerBounds[layerName]);
    }
}
// ================================
// BASE MAPS
// ================================

// OpenStreetMap
var osmLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 22,
        attribution: '&copy; OpenStreetMap contributors'
    }
);

// Satellite
var satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {   maxZoom: 22,
        attribution: 'Tiles &copy; Esri'
    }
);

// Terrain
var terrainLayer = L.tileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 22,
        attribution: '&copy; OpenTopoMap'
    }
);

// Add default basemap
osmLayer.addTo(map);


// ================================
// LAYER FILE  BOUNDARY WMS
// ================================
var stateBoundaryLayer = L.tileLayer.wms(
    "http://104.233.209.179:8080/geoserver/AdminBoundarys/wms",
    {
        layers: "AdminBoundarys:State_Boundary",
        format: "image/png",
        transparent: true
    }
);

var districtBoundaryLayer = L.tileLayer.wms(
    "http://104.233.209.179:8080/geoserver/AdminBoundarys/wms",
    {
        layers: "AdminBoundarys:District_Boundary",
        format: "image/png",
        transparent: true
    }
);

var mandalBoundaryLayer = L.tileLayer.wms(
    "http://104.233.209.179:8080/geoserver/AdminBoundarys/wms",
    {
        layers: "AdminBoundarys:Mandal_Boundary",
        format: "image/png",
        transparent: true
    }
);

var villageBoundaryLayer = L.tileLayer.wms(
    "http://104.233.209.179:8080/geoserver/AdminBoundarys/wms",
    {
        layers: "AdminBoundarys:Mancherial",
        format: "image/png",
        transparent: true
    }
);
var WardBoundaryLayer = L.tileLayer.wms(
    "http://104.233.209.179:8080/geoserver/AdminBoundarys/wms",
    {
        layers: "AdminBoundarys:Ward_Boundary",
        format: "image/png",
        transparent: true
    }
);

// Add WMS by default
// villageBoundaryLayer.addTo(map);

// ================================
// SHOW / HIDE STATE BOUNDARY
// ================================
function Showlayer(icon, layerType) {

    var layer;

    switch(layerType) {
        case "state":
            layer = stateBoundaryLayer;

            break;

        case "District":
            layer = districtBoundaryLayer;
            districtBoundaryLayer.bringToFront();
            
            break;

        case "Mandal":
            layer = mandalBoundaryLayer;
            break;

        case "Village":
            layer = villageBoundaryLayer;
            villageBoundaryLayer.bringToFront();
            break;


        case "Ward":
            layer = WardBoundaryLayer;
            WardBoundaryLayer.bringToFront();
            break;

        default:
            return;
    }

    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");

    if (icon.classList.contains("fa-eye")) {

        if (!map.hasLayer(layer)) {
            layer.addTo(map);
            layer.bringToFront();
        }

    } else {

        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
        }

    }
}

 map.on("click", function(e) {
        console.log("Map clicked");

        if (map.hasLayer(villageBoundaryLayer)) {
            getFeatureInfo(e, villageBoundaryLayer, "AdminBoundarys:Mancherial");
            }     
       
        });


// =====================================
// GET MANDAL ATTRIBUTES ON CLICK
// =====================================

function getFeatureInfo(evt, layer, layerName) {


    var point = map.latLngToContainerPoint(evt.latlng, map.getZoom());
    console.log(point);
    var size = map.getSize();
    console.log(size);

    var url = layer._url + L.Util.getParamString({

        request: "GetFeatureInfo",
        service: "WMS",
        srs: "EPSG:4326",
        styles: "",
        version: "1.1.1",
        transparent: true,
        format: "image/png",

        bbox: map.getBounds().toBBoxString(),
        width: size.x,
        height: size.y,

        layers: layerName,
        query_layers: layerName,

        info_format: "application/json",
        feature_count: 1,

        x: Math.round(point.x),
        y: Math.round(point.y)

    });
    
    fetch(url)
    .then(response => response.json())
    .then(data => {

        if (data.features.length === 0) {

            document.getElementById("attr-table1").innerHTML =
                "<h3>Attributes</h3><p>No feature selected.</p>";

            return;
        }

        var properties = data.features[0].properties;

        var html = "<h3>Attributes</h3>";

        html += "<table>";
        html += "<tr><th>Field</th><th>Value</th></tr>";

        for (var key in properties) {

            html += "<tr>";
            html += "<td>" + key + "</td>";
            html += "<td>" + properties[key] + "</td>";
            html += "</tr>";

        }

        html += "</table>";

        document.getElementById("attr-table1").innerHTML = html;

    })
    .catch(function(error){

        console.log(error);

        document.getElementById("attr-table1").innerHTML =
            "<h3>Attributes</h3><p>Error loading attributes.</p>";

    });

}




// ================================
// BASEMAP FUNCTIONS
// ================================

function showOSM() {

    if (map.hasLayer(satelliteLayer)) {
        map.removeLayer(satelliteLayer);
    }

    if (map.hasLayer(terrainLayer)) {
        map.removeLayer(terrainLayer);
    }

    if (!map.hasLayer(osmLayer)) {
        osmLayer.addTo(map);
    }

    // Keep boundary on top
    if (map.hasLayer(stateBoundaryLayer)) {
        stateBoundaryLayer.bringToFront();
    }
}


function showSatellite() {

    if (map.hasLayer(osmLayer)) {
        map.removeLayer(osmLayer);
    }

    if (map.hasLayer(terrainLayer)) {
        map.removeLayer(terrainLayer);
    }

    if (!map.hasLayer(satelliteLayer)) {
        satelliteLayer.addTo(map);
    }

    // Keep boundary on top
    if (map.hasLayer(stateBoundaryLayer)) {
        stateBoundaryLayer.bringToFront();
    }
}


function showTerrain() {

    if (map.hasLayer(osmLayer)) {
        map.removeLayer(osmLayer);
    }

    if (map.hasLayer(satelliteLayer)) {
        map.removeLayer(satelliteLayer);
    }

    if (!map.hasLayer(terrainLayer)) {
        terrainLayer.addTo(map);
    }

    // Keep boundary on top
    if (map.hasLayer(stateBoundaryLayer)) {
        stateBoundaryLayer.bringToFront();
    }
}

