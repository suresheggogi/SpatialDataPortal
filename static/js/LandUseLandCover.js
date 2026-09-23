

// // ================================
// // OPEN STREET MAP
// // ================================

var osmLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors"
    }
);


// // ================================
// // ESRI SATELLITE
// // ================================

var satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        maxZoom: 22,
        attribution: "Tiles &copy; Esri"
    }
);


// // ================================
// // TERRAIN
// // ================================

var terrainLayer = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 22,
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

var map = L.map("map").setView(
    [17.1, 79.3], 8);


// ============================================================
// LAYER BOUNDS
// ============================================================

const layerBounds = {

    Res: L.latLngBounds(
        [18.81864621, 78.58701965],
        [18.88863799, 78.65470915]
    )

};

// ============================================================
// ZOOM TO LAYER
// ============================================================

function zoomToLayer(layerName) {

    if (layerBounds[layerName]) {

        map.fitBounds(
            layerBounds[layerName]
        );

    }

}



// ============================================================
// GEOSERVER WMS URL
// ============================================================

var geoserverWMS = "http://104.233.209.179:8080/geoserver/SpatialDataPortalDB/wms";



// ============================================================
// METPALLY ULB BOUNDARY WMS
// ============================================================

var ResidentialAreas = L.tileLayer.wms("http://104.233.209.179:8080/geoserver/SpatialDataPortalDB/wms",
    {
        layers: "SpatialDataPortalDB:metpally_plu_f",
        format: "image/png",
        transparent: true,
        version: "1.1.1"

    }
);
// Add to map by default
ResidentialAreas.addTo(map);
ResidentialAreas.bringToFront();



// ============================================================
// SHOW / HIDE LAYER
// ============================================================

function Showlayer(icon, layerType) {

    var layer;
    // ----------------------------------------
    // SELECT LAYER
    // ----------------------------------------

    switch (layerType) {

        case "Res":

            layer = ResidentialAreas;

            break;


        default:

            return;

    }



    // ----------------------------------------
    // SHOW LAYER
    // ----------------------------------------

    if (!map.hasLayer(layer)) {

        layer.addTo(map);
        layer.bringToFront();
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");

        // Zoom to layer

        if (layerBounds[layerType]) {

            map.fitBounds(
                layerBounds[layerType]
            );

        }

    }


    // ----------------------------------------
    // HIDE LAYER
    // ----------------------------------------

    else {

        map.removeLayer(layer);


        // Change eye icon

        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");

    }

}



// ============================================================
// KEEP WMS LAYERS ON TOP
// ============================================================

function keepWMSOnTop() {


    // Metpally ULB

    if (map.hasLayer(ResidentialAreas)) {

        ResidentialAreas.bringToFront();

    }


    // // State

    // if (
    //     typeof stateBoundaryLayer !== "undefined" &&
    //     map.hasLayer(stateBoundaryLayer)
    // ) {

    //     stateBoundaryLayer.bringToFront();

    // }


    // // District

    // if (
    //     typeof districtBoundaryLayer !== "undefined" &&
    //     map.hasLayer(districtBoundaryLayer)
    // ) {

    //     districtBoundaryLayer.bringToFront();

    // }


    // // Mandal

    // if (
    //     typeof mandalBoundaryLayer !== "undefined" &&
    //     map.hasLayer(mandalBoundaryLayer)
    // ) {

    //     mandalBoundaryLayer.bringToFront();

    // }


    // // Village

    // if (
    //     typeof villageBoundaryLayer !== "undefined" &&
    //     map.hasLayer(villageBoundaryLayer)
    // ) {

    //     villageBoundaryLayer.bringToFront();

    // }


    // // Ward

    // if (
    //     typeof WardBoundaryLayer !== "undefined" &&
    //     map.hasLayer(WardBoundaryLayer)
    // ) {

    //     WardBoundaryLayer.bringToFront();

    // }

}



// ============================================================
// MAP CLICK
// ============================================================

map.on("click", function (e) {


    // ----------------------------------------
    // METPALLY ULB
    // ----------------------------------------

    if (map.hasLayer(ResidentialAreas)) {

        getFeatureInfo(
            e,
            ResidentialAreas,
            "metpally_ulb_boundary"
        );

    }


    // ----------------------------------------
    // VILLAGE
    // ----------------------------------------

    else if (
        typeof villageBoundaryLayer !== "undefined" &&
        map.hasLayer(villageBoundaryLayer)
    ) {

        getFeatureInfo(
            e,
            villageBoundaryLayer,
            "metpally_ulb_boundary"
        );

    }


    // ----------------------------------------
    // WARD
    // ----------------------------------------

    else if (
        typeof WardBoundaryLayer !== "undefined" &&
        map.hasLayer(WardBoundaryLayer)
    ) {

        getFeatureInfo(
            e,
            WardBoundaryLayer,
            "metpally_ulb_boundary"
        );

    }


    // ----------------------------------------
    // MANDAL
    // ----------------------------------------

    else if (
        typeof mandalBoundaryLayer !== "undefined" &&
        map.hasLayer(mandalBoundaryLayer)
    ) {

        getFeatureInfo(
            e,
            mandalBoundaryLayer,
            "AdminBoundarys:Mandal_Boundary"
        );

    }


    // ----------------------------------------
    // DISTRICT
    // ----------------------------------------

    else if (
        typeof districtBoundaryLayer !== "undefined" &&
        map.hasLayer(districtBoundaryLayer)
    ) {

        getFeatureInfo(
            e,
            districtBoundaryLayer,
            "AdminBoundarys:District_Boundary"
        );

    }


    // ----------------------------------------
    // STATE
    // ----------------------------------------

    else if (
        typeof stateBoundaryLayer !== "undefined" &&
        map.hasLayer(stateBoundaryLayer)
    ) {

        getFeatureInfo(
            e,
            stateBoundaryLayer,
            "AdminBoundarys:State_Boundary"
        );

    }


    // ----------------------------------------
    // NO WMS
    // ----------------------------------------

    else {

        console.log(
            "No WMS layer is active."
        );

    }

});



// ============================================================
// GET FEATURE INFO
// ============================================================

function getFeatureInfo(
    evt,
    layer,
    layerName
) {


    // ----------------------------------------
    // CLICK POINT
    // ----------------------------------------

    var point =
        map.latLngToContainerPoint(
            evt.latlng
        );


    // ----------------------------------------
    // MAP SIZE
    // ----------------------------------------

    var size =
        map.getSize();


    // ----------------------------------------
    // MAP BOUNDARY
    // ----------------------------------------

    var bbox =
        map.getBounds().toBBoxString();


    // ----------------------------------------
    // GET FEATURE INFO URL
    // ----------------------------------------

    var url =
        layer._url +
        L.Util.getParamString({

            request: "GetFeatureInfo",

            service: "WMS",

            version: "1.1.1",

            srs: "EPSG:32644",

            styles: "",

            transparent: true,

            format: "image/png",

            bbox: bbox,

            width: size.x,

            height: size.y,

            layers: layerName,

            query_layers: layerName,

            info_format:
                "application/json",

            feature_count: 1,

            x: Math.round(
                point.x
            ),

            y: Math.round(
                point.y
            )

        });



    // ----------------------------------------
    // DEBUG URL
    // ----------------------------------------

    console.log(
        "GetFeatureInfo URL:",
        url
    );



    // ----------------------------------------
    // FETCH DATA
    // ----------------------------------------

    fetch(url)

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "HTTP Error: " +
                    response.status
                );

            }

            return response.json();

        })


        // ----------------------------------------
        // PROCESS JSON
        // ----------------------------------------

        .then(function (data) {


            console.log(
                "GetFeatureInfo Response:",
                data
            );


            // ----------------------------------------
            // NO FEATURE
            // ----------------------------------------

            if (
                !data.features ||
                data.features.length === 0
            ) {

                document.getElementById(
                    "attr-table1"
                ).innerHTML =

                    "<h3>Attributes</h3>" +

                    "<p>No feature selected.</p>";

                return;

            }



            // ----------------------------------------
            // FIRST FEATURE
            // ----------------------------------------

            var properties =
                data.features[0].properties;



            // ----------------------------------------
            // CREATE TABLE
            // ----------------------------------------

            var html =
                "<h3>Attributes</h3>";


            html +=
                "<table>";


            html +=
                "<tr>" +
                "<th>Field</th>" +
                "<th>Value</th>" +
                "</tr>";



            // ----------------------------------------
            // ADD ATTRIBUTES
            // ----------------------------------------

            for (
                var key in properties
            ) {


                html +=
                    "<tr>";


                html +=
                    "<td>" +
                    key +
                    "</td>";


                html +=
                    "<td>" +
                    (
                        properties[key] !== null
                            ? properties[key]
                            : ""
                    ) +
                    "</td>";


                html +=
                    "</tr>";

            }



            html +=
                "</table>";



            // ----------------------------------------
            // DISPLAY TABLE
            // ----------------------------------------

            document.getElementById(
                "attr-table1"
            ).innerHTML = html;


        })


        // ----------------------------------------
        // ERROR
        // ----------------------------------------

        .catch(function (error) {


            console.error(
                "GetFeatureInfo Error:",
                error
            );


            document.getElementById(
                "attr-table1"
            ).innerHTML =

                "<h3>Attributes</h3>" +

                "<p>Error loading attributes.</p>";

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

map.on(
    "layeradd",
    function () {

        keepWMSOnTop();

    }
);



// ============================================================
// END
// ============================================================