

// // ================================
// // OPEN STREET MAP
// // ================================

var osmLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        // maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors"
    }
);


// // ================================
// // ESRI SATELLITE
// // ================================

var satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        maxZoom: 25,
        attribution: "Tiles &copy; Esri"
    }
);


// // ================================
// // TERRAIN
// // ================================

var terrainLayer = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 25,
        attribution: "&copy; OpenTopoMap"
    }
);


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
    


// ============================================================
// TREE MENU
// ============================================================

function toggleTree(id, element) {

    var tree = document.getElementById(id);

    var arrow = element.querySelector(".arrow");


    if (tree.style.display === "block") {

        tree.style.display = "none";

        arrow.classList.remove("fa-minus");
        arrow.classList.add("fa-plus");

    }

    else {

        tree.style.display = "block";

        arrow.classList.remove("fa-plus");
        arrow.classList.add("fa-minus");

    }

}



// ============================================================
// MAP
// ============================================================

 var map = L.map("map").setView([18.850, 78.6245], 14); 

// Default basemap: none
NoMap();


// ============================================================
// LAYER BOUNDS
// ============================================================

const MasterPlanboundary = {

    Res: L.latLngBounds([18.81864621, 78.58701965], [18.88863799, 78.65470915])

};

// ============================================================
// ZOOM TO LAYER
// ============================================================

function zoomToLayer(layerName) {

    if (MasterPlanboundary[layerName]) {

        map.fitBounds(
            MasterPlanboundary[layerName]
        );

    }

}



// ============================================================
// GEOSERVER WMS URL


var geoserverWMS = "http://104.233.209.179:8080/geoserver/SpatialDataPortalDB/wms";



// ============================================================
// METPALLY ULB BOUNDARY WMS
// ============================================================

var MasterPlan = L.tileLayer.wms("http://104.233.209.179:8080/geoserver/SpatialDataPortalDB/wms",
    {
        layers: "SpatialDataPortalDB:metpally_plu",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        maxZoom: 25

    }
);
// Add to map by default
MasterPlan.addTo(map);
MasterPlan.bringToFront();



// ============================================================
// SHOW / HIDE LAYER
// ============================================================

function Showlayer(icon, layerType) {

    var layer;
    // ----------------------------------------
    // SELECT LAYER
    // ----------------------------------------

    switch (layerType) {

        case "MasterPlan":

            layer = MasterPlan;

            break;


        default:

            return;

    }



    // ----------------------------------------
    // TOGGLE LAYER
    // ----------------------------------------

    if (map.hasLayer(layer)) {

        map.removeLayer(layer);

    }

    else {

        layer.addTo(map);
        layer.bringToFront();

    }


    // ----------------------------------------
    // SYNC EYE ICON WITH LAYER STATE
    // Eye icon is ON when the layer is visible
    // ----------------------------------------

    if (map.hasLayer(layer)) {

        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");

    }

    else {

        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");

    }

}



// ============================================================
// KEEP WMS LAYERS ON TOP
// ============================================================

function keepWMSOnTop() {


    // Metpally ULB

    if (map.hasLayer(MasterPlan)) {

        MasterPlan.bringToFront();
        

    }

}



// ============================================================
// MAP CLICK
// ============================================================

map.on("click", function (e) {


    // ----------------------------------------
    // METPALLY ULB
    // ----------------------------------------

    if (map.hasLayer(MasterPlan)) {

        getFeatureInfo(e, MasterPlan, "SpatialDataPortalDB:metpally_plu");
        

    }



    // ----------------------------------------
    // STATE
    // ----------------------------------------

    // else if (
    //     typeof stateBoundaryLayer !== "undefined" &&
    //     map.hasLayer(stateBoundaryLayer)
    // ) {

    //     getFeatureInfo( e, stateBoundaryLayer, "AdminBoundarys:State_Boundary");

    // }


    // ----------------------------------------
    // NO WMS
    // ----------------------------------------

    else {

        console.log( "No WMS layer is active.");

    }

});



// ============================================================
// GET FEATURE INFO
// ============================================================
function getFeatureInfo(evt, layer, layerName) {


    var attrTable = document.getElementById("attr-table1");

    if (!attrTable) {

        return;

    }

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
        // CQL_FILTER: "class_m='Residential'",
        info_format: "application/json",
        feature_count: 1,

        x: Math.round(point.x),
        y: Math.round(point.y)

    });
    
    fetch(url)
    .then(response => response.json())
    .then(data => {

        if (data.features.length === 0) {

            attrTable.innerHTML =
                "<h3>Attributes</h3><p>No feature selected.</p>";

            return;
        }

        var properties = data.features[0].properties;

        if (layerName === "SpatialDataPortalDB:metpally_plu") {
            L.popup()
            .setLatLng(evt.latlng)
            .setContent("<b>Class:</b> " + properties.class_m)
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

        attrTable.innerHTML = html;

    })
    .catch(function(error){

        console.log(error);

        attrTable.innerHTML =
            "<h3>Attributes</h3><p>Error loading attributes.</p>";

    });

}



// ============================================================
// BASEMAP - OSM
// ============================================================

function showOSM() {


    // Remove Satellite

    if (
        map.hasLayer(
            satelliteLayer
        )
    ) {

        map.removeLayer(
            satelliteLayer
        );

    }


    // Remove Terrain

    if (
        map.hasLayer(
            terrainLayer
        )
    ) {

        map.removeLayer(
            terrainLayer
        );

    }


    // Add OSM

    if (
        !map.hasLayer(
            osmLayer
        )
    ) {

        osmLayer.addTo(map);

    }


    // Keep WMS layers on top

    keepWMSOnTop();

}



// ============================================================
// BASEMAP - SATELLITE
// ============================================================

function showSatellite() {


    // Remove OSM

    if (
        map.hasLayer(
            osmLayer
        )
    ) {

        map.removeLayer(
            osmLayer
        );

    }


    // Remove Terrain

    if (
        map.hasLayer(
            terrainLayer
        )
    ) {

        map.removeLayer(
            terrainLayer
        );

    }


    // Add Satellite

    if (
        !map.hasLayer(
            satelliteLayer
        )
    ) {

        satelliteLayer.addTo(map);

    }


    // Keep WMS layers on top

    keepWMSOnTop();

}



// ============================================================
// BASEMAP - TERRAIN
// ============================================================

function showTerrain() {


    // Remove OSM

    if (
        map.hasLayer(
            osmLayer
        )
    ) {

        map.removeLayer(
            osmLayer
        );

    }


    // Remove Satellite

    if (
        map.hasLayer(
            satelliteLayer
        )
    ) {

        map.removeLayer(
            satelliteLayer
        );

    }


    // Add Terrain

    if (
        !map.hasLayer(
            terrainLayer
        )
    ) {

        terrainLayer.addTo(map);

    }


    // Keep WMS layers on top

    keepWMSOnTop();

}



// ============================================================
// OPTIONAL:
// AUTOMATICALLY KEEP WMS ABOVE BASEMAP AFTER MAP CHANGES
// ============================================================

map.on("layeradd", function () {

        keepWMSOnTop();

    }
);



// ============================================================
// END
// ============================================================