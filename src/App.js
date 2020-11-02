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
      ["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"],
      { css: true }
    ).then(([ArcGISMap, MapView, FeatureLayer]) => {
      const map = new ArcGISMap({
        basemap: "topo-vector",
      });
      var trailheadsRenderer = {
        type: "simple",
        symbol: {
          type: "picture-marker",
          url:
            "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
          width: "18px",
          height: "18px",
        },
      };
      this.view = new MapView({
        container: this.mapRef.current,
        map: map,
        center: [-118, 34],
        zoom: 8,
      });
      var trailheadsLabels = {
        symbol: {
          type: "text",
          color: "#FFFFFF",
          haloColor: "#5E8D74",
          haloSize: "2px",
          font: {
            size: "12px",
            family: "Noto Sans",
            style: "italic",
            weight: "normal",
          },
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
          expression: `${items[0].governorate_code}`,
        },
      };
      var trailheads = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
        renderer: trailheadsRenderer,
        labelingInfo: [trailheadsLabels],
      });
      var trailsRenderer = {
        type: "simple",
        symbol: {
          color: "#BA55D3",
          type: "simple-line",
          style: "solid",
        },
        visualVariables: [
          {
            type: "size",
            field: "ELEV_GAIN",
            minDataValue: 0,
            maxDataValue: 2300,
            minSize: "3px",
            maxSize: "7px",
          },
        ],
      };
      var trails = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
        renderer: trailsRenderer,
        opacity: 0.75,
      });
      var bikeTrailsRenderer = {
        type: "simple",
        symbol: {
          type: "simple-line",
          style: "short-dot",
          color: "#FF91FF",
          width: "1px",
        },
      };
      var bikeTrails = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
        renderer: bikeTrailsRenderer,
        definitionExpression: "USE_BIKE = 'YES'",
      });

      map.add(trails, 0);
      map.add(trailheads);
      map.add(bikeTrails, 1);
      function createFillSymbol(value, color) {
        return {
          value: value,
          symbol: {
            color: color,
            type: "simple-fill",
            style: "solid",
            outline: {
              style: "none",
            },
          },
          label: value,
        };
      }

      var openSpacesRenderer = {
        type: "unique-value",
        field: "TYPE",
        uniqueValueInfos: [
          createFillSymbol("Natural Areas", "#9E559C"),
          createFillSymbol("Regional Open Space", "#A7C636"),
          createFillSymbol("Local Park", "#149ECE"),
          createFillSymbol("Regional Recreation Park", "#ED5151"),
        ],
      };
      var openspaces = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
        renderer: openSpacesRenderer,
        opacity: 0.2,
      });
      map.add(openspaces, 0);
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
