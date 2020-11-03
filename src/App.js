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
        center: [31.2105881, 30.0282734],
        zoom: 8,
      });
      var graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);
      items.map((i) => {
        var point = {
          type: "point",
          longitude: i.y_coordinate,
          latitude: i.x_coordinate,
        };

        var simpleMarkerSymbol = {
          color: [0, 150, 50],
          outline: {
            color: "#f6f5f1",
            width: 1,
          },
        };
        var attributes = {
          Name: "My point",
          Location: " Point Dume State Beach",
        };

        var popupTemplate = {
          title: "{ Name}",
          content: "" + i.damen_merchant_code + "",
        };

        var pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol,

          attributes: attributes,
          popupTemplate: popupTemplate,
        });

        graphicsLayer.add(pointGraphic);
      });
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
