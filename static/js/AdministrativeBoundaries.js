
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
    State: L.latLngBounds([[18.699940795454157, 78.5006330219195], [18.915862175154455, 78.72873390726926]]),
    District: L.latLngBounds([[18.699940795454157, 78.5006330219195], [18.915862175154455, 78.72873390726926]]),
    Mandal: L.latLngBounds([[18.699940795454157, 78.5006330219195], [18.915862175154455, 78.72873390726926]]),
    Village: L.latLngBounds([[18.699940795454157, 78.5006330219195], [18.915862175154455, 78.72873390726926]]),
    ULB: L.latLngBounds([[18.8053719066904, 78.57066741262234],[18.90120153755063, 78.67192986289551]]),
    Ward: L.latLngBounds([[18.80113105830372, 78.58253171643538],[18.897460702437698, 78.68432010627626]])
};

function zoomToLayer(layerName) {
    if (layerBounds[layerName]) {
        map.fitBounds(layerBounds[layerName]);
    }
}

// Add default basemap
//   osmLayer.addTo(map);


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
    "http://104.233.209.179:8080/geoserver/SpatialDataPortalDB/wms",
    {
        layers: "SpatialDataPortalDB:mandal_boundary",
        format: "image/png",
        transparent: true
    }
);

var villageBoundaryLayer = L.tileLayer.wms(
    "http://104.233.209.179:8080/geoserver/SpatialDataPortalDB/wms",
    {
        layers: "SpatialDataPortalDB:village_boundary",
        format: "image/png",
        transparent: true
    }
);

var ULBBoundary = L.tileLayer.wms(
    "http://104.233.209.179:8080/geoserver/SpatialDataPortalDB/wms",
    {
        layers: "SpatialDataPortalDB:ulb_boundary",
        format: "image/png",
        transparent: true
    }
);

var WardBoundaryLayer = L.tileLayer.wms(
    "http://104.233.209.179:8080/geoserver/SpatialDataPortalDB/wms",
    {
        layers: "SpatialDataPortalDB:ward_boundry",
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
    
        case "ULBBoundary":
            layer = ULBBoundary;
            ULBBoundary.bringToFront();
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
       
        
        if (map.hasLayer(villageBoundaryLayer)) {
            getFeatureInfo(e, villageBoundaryLayer, "SpatialDataPortalDB:village_boundary");

        } else if (map.hasLayer(ULBBoundary)) {
            getFeatureInfo(e, ULBBoundary, "SpatialDataPortalDB:ulb_boundary");

        } else if (map.hasLayer(WardBoundaryLayer)) {
            getFeatureInfo(e, WardBoundaryLayer, "SpatialDataPortalDB:ward_boundry");
   
        } else if (map.hasLayer(mandalBoundaryLayer)) {
            getFeatureInfo(e, mandalBoundaryLayer, "	SpatialDataPortalDB:mandal_boundary");

        } else if (map.hasLayer(districtBoundaryLayer)) {
            getFeatureInfo(e, districtBoundaryLayer, "AdminBoundarys:District");

        } else if (map.hasLayer(stateBoundaryLayer)) {
            getFeatureInfo(e, stateBoundaryLayer, "AdminBoundarys:State_Boundary");

        } else {
            console.log("No WMS layer is active.");
        }

       
        });


// =====================================
// GET MANDAL ATTRIBUTES ON CLICK
// =====================================

function getFeatureInfo(evt, layer, layerName) {


    var point = map.latLngToContainerPoint(evt.latlng, map.getZoom());
   
    var size = map.getSize();
   

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

        if (layerName === "SpatialDataPortalDB:ward_boundry") {
            L.popup()
            .setLatLng(evt.latlng)
            .setContent("<b>Ward Name:</b> " + properties.name)
            .openOn(map);
            }

        if (layerName === "SpatialDataPortalDB:mandal_boundary") {
            L.popup()
            .setLatLng(evt.latlng)
            .setContent("<b>Mandal Name:</b> " + properties.MANDAL_NAM)
            .openOn(map);
            }



   
       
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

 
}
function NoMap() {

    if (map.hasLayer(satelliteLayer)) {
        map.removeLayer(satelliteLayer);
    }

    if (map.hasLayer(terrainLayer)) {
        map.removeLayer(terrainLayer);
    }

    if (map.hasLayer(osmLayer)) {
        map.removeLayer(osmLayer);
    }

}

// ================================
// INITIALIZE DEFAULT LAYER STATE
// ================================
document.addEventListener("DOMContentLoaded", function() {
    ULBBoundary.addTo(map);
    ULBBoundary.bringToFront();
    zoomToLayer('ULB');

    const ulbIcon = document.querySelector('[onclick*="ULBBoundary"]') || document.getElementById("ulb-icon");
    if (ulbIcon) {
        ulbIcon.classList.add("fa-eye");
        ulbIcon.classList.remove("fa-eye-slash");
    }

    const otherIcons = document.querySelectorAll('[onclick*="Showlayer"]:not([onclick*="ULBBoundary"])');
    otherIcons.forEach(icon => {
        icon.classList.add("fa-eye-slash");
        icon.classList.remove("fa-eye");
    });
});
