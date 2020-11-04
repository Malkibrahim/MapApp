import React from "react";
import { loadModules } from "esri-loader";
import { items } from "./fakeServer";
export class WebMapView extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();

    this.state = {index:-1,location:{}}
  }


  loadMap = () => {


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
      items.map((i,index) => {
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
            // style:"triangle",
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

        const getInfo = (feature) => {

          this.setState({index})
          let content =  "" + "merchant code : " + i.damen_merchant_code + ""
          return content
        }
        var popupTemplate = {
          title: "{Name}",
          // content: "" + "merchant code : " + i.damen_merchant_code + "",
          content:getInfo
        };


        var pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol,
          attributes: attributes,
          popupTemplate: popupTemplate,
          index:index,
          
          
        });

        graphicsLayer.add(pointGraphic);
        });

      });
  }
  componentDidMount() {
    // lazy load the required ArcGIS API for JavaScript modules and CSS

    // navigator.geolocation.getCurrentPosition((position) =>{

    //   if(position !== undefined)
    //   {
    //     console.log("Latitude is :", position.coords.latitude);
    //     console.log("Longitude is :", position.coords.longitude);
    //     this.setState({location:{lat:position.coords.latitude,long: position.coords.longitude}})
    //   }
      
    // });
 

    this.loadMap()
    
   
  }

  componentWillUnmount() {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }

  render() {

    console.log("indexxxxxxxxx",this.state.index)

    // this.loadMap()
    return (
      <div className="webmap" style={{ height: 1000 }} ref={this.mapRef}/>
    );
  }
}
export default WebMapView;
