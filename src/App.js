import React from "react";
import { loadModules } from "esri-loader";
import { items } from "./fakeServer";
export class WebMapView extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
      ],
      { css: true }
    ).then(([ArcGISMap, MapView, FeatureLayer, Graphic, GraphicsLayer]) => {
      const map = new ArcGISMap({
        basemap: "topo-vector",
      });
      this.view = new MapView({
        container: this.mapRef.current,
        map: map,
        center: [30.0282734, 31.2105881],
        zoom: 13,
      });
      var graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);
      items.map((i) => {
        var point = {
          type: "point",
          longitude: i.y_coordinate,
          latitude: i.x_coordinate,
        };
        if (i.y_coordinate <= 30) {
          var simpleMarkerSymbol = {
            type: "simple-marker",
            color: [0, 150, 50],
            outline: {
              color: [255, 255, 255],
              width: 2,
            },
            size: 10,
          };
        } else if (i.y_coordinate >= 30) {
          var simpleMarkerSymbol = {
            type: "simple-marker",
            color: "#aa3a3a",
            outline: {
              color: [255, 255, 255],
              width: 2,
            },
            size: 10,
          };
        }

        var attributes = {
          Name: "" + "governorate code : " + i.governorate_code + "",
          Location: " Point Dume State Beach",
        };
        var popupTemplate = {
          title: "{Name}",
          content: "" + "merchant code : " + i.damen_merchant_code + "",
        };

        var pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol,
          attributes: attributes,
          popupTemplate: popupTemplate,
        });

        // var pointGraphic = new Graphic({
        //   geometry: point,
        //   symbol: simpleMarkerSymbol,
        // });

        graphicsLayer.add(pointGraphic);
      });

      // var simpleLineSymbol = {
      //   //*** UPDATE ***//
      //   color: [255,0,0],
      //   width: 2,
      //   //*** ADD ***//
      //   style: "dash"
      // };

      // var polyline = {
      //   type: "polyline",
      //   paths: [
      //     [31.2105881, 30.0282734],
      //     [31.2409168, 29.9863887],
      //     [31.210583, 30.0282015],
      //   ],
      // };

      // var polylineGraphic = new Graphic({
      //   geometry: polyline,
      //   symbol: simpleLineSymbol,
      // });

      // graphicsLayer.add(polylineGraphic);
      // var polygon = {
      //   type: "polygon",
      //   rings: [
      //     [31.2105881, 30.0282734],
      //     [31.2409168, 29.9863887],
      //     [31.210583, 30.0282015],
      //   ],
      // };

      // var simpleFillSymbol = {
      //   // *** UPDATE ***//
      //   color: [50,100,255,.5],
      //   outline: {
      //     color: [50, 100, 255],
      //     width: 1
      //   },
      //   //*** ADD ***//
      //   style: "backward-diagonal"
      // };

      // var polygonGraphic = new Graphic({
      //   geometry: polygon,
      //   symbol: simpleFillSymbol,
      // });

      // graphicsLayer.add(polygonGraphic);
      //
      // var trailheadsRenderer = {
      //   type: "simple",
      //   symbol: {
      //     type: "picture-marker",
      //     url:
      //       "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
      //     width: "18px",
      //     height: "18px",
      //   },
      // };
      // var trailheadsLabels = {
      //   symbol: {
      //     type: "text",
      //     color: "#FFFFFF",
      //     haloColor: "#5E8D74",
      //     haloSize: "2px",
      //     font: {
      //       size: "12px",
      //       family: "Noto Sans",
      //       style: "italic",
      //       weight: "normal",
      //     },
      //   },
      //   labelPlacement: "above-center",
      //   labelExpressionInfo: {
      //     expression: `${items[0].governorate_code}`,
      //   },
      // };
      // var trailheads = new FeatureLayer({
      //   url:
      //     "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
      //   renderer: trailheadsRenderer,
      //   labelingInfo: [trailheadsLabels],
      // });
      // var trailsRenderer = {
      //   type: "simple",
      //   symbol: {
      //     color: "#BA55D3",
      //     type: "simple-line",
      //     style: "solid",
      //   },
      //   visualVariables: [
      //     {
      //       type: "size",
      //       field: "ELEV_GAIN",
      //       minDataValue: 0,
      //       maxDataValue: 2300,
      //       minSize: "3px",
      //       maxSize: "7px",
      //     },
      //   ],
      // };
      // var trails = new FeatureLayer({
      //   url:
      //     "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
      //   renderer: trailsRenderer,
      //   opacity: 0.75,
      // });
      // var bikeTrailsRenderer = {
      //   type: "simple",
      //   symbol: {
      //     type: "simple-line",
      //     style: "short-dot",
      //     color: "#FF91FF",
      //     width: "1px",
      //   },
      // };
      // var bikeTrails = new FeatureLayer({
      //   url:
      //     "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
      //   renderer: bikeTrailsRenderer,
      //   definitionExpression: "USE_BIKE = 'YES'",
      // });

      // map.add(trails, 0);
      // map.add(trailheads);
      // map.add(bikeTrails, 1);
      // function createFillSymbol(value, color) {
      //   return {
      //     value: value,
      //     symbol: {
      //       color: color,
      //       type: "simple-fill",
      //       style: "solid",
      //       outline: {
      //         style: "none",
      //       },
      //     },
      //     label: value,
      //   };
      // }

      // var openSpacesRenderer = {
      //   type: "unique-value",
      //   field: "TYPE",
      //   uniqueValueInfos: [
      //     createFillSymbol("Natural Areas", "#9E559C"),
      //     createFillSymbol("Regional Open Space", "#A7C636"),
      //     createFillSymbol("Local Park", "#149ECE"),
      //     createFillSymbol("Regional Recreation Park", "#ED5151"),
      //   ],
      // };
      // var openspaces = new FeatureLayer({
      //   url:
      //     "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
      //   renderer: openSpacesRenderer,
      //   opacity: 0.2,
      // });
      // map.add(openspaces, 0);
    });
  }

  componentWillUnmount() {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }

  render() {
    return (
      <div className="webmap" style={{ height: 1000 }} ref={this.mapRef} />
    );
  }
}
export default WebMapView;
