import React from "react";
import { loadModules } from "esri-loader";
import { items } from "./fakeServer";
import { governorate } from "./governorate";
export class WebMapView extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();

    // this.state = {index:-1,location:{}}
  }
  state = {
    data: items,
    govs: governorate,
    currentGov: null,
    curentLocation: null,
    index: -1,
    location: {},
  };
  handleChange = (e) => {
    console.log("hiii");
    const currentGov = e.target.value;
    this.setState({ currentGov }, () => {
      console.log(this.state.currentGov);
    });
    // console.log(e.target.value);
    debugger;
    const govDetail = this.state.govs.find((g) => g.en_name == currentGov);
    const location = govDetail.location;
    this.setState({ curentLocation: location });

    console.log(this.state.curentLocation);
    if (this.state.curentLocation !== null) {
      console.log(this.state.curentLocation.lat);
      console.log(this.state.curentLocation.long);
    }
    this.loadMap();
  };
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
        center:
          this.state.curentLocation == null
            ? [29.9187387, 31.2000924]
            : [this.state.curentLocation.lat, this.state.curentLocation.long],
        zoom: 13,
      });
      console.log(this.mapRef.current);
      var graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);
      this.state.data.map((i, index) => {
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
          this.setState({ index });
          let content = "" + "merchant code : " + i.damen_merchant_code + "";
          return content;
        };
        var popupTemplate = {
          title: "{Name}",
          // content: "" + "merchant code : " + i.damen_merchant_code + "",
          content: getInfo,
        };

        var pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol,
          attributes: attributes,
          popupTemplate: popupTemplate,
          // index:index,
        });

        graphicsLayer.add(pointGraphic);
      });
      var polygon = {
        type: "polygon",
        rings: [
          [30.0228069, 31.2142028],
          [30.029507, 31.212698],
          [30.0281133, 31.2106249],
          [30.0236394, 31.2073342],
          [30.0209446, 31.2057394],
          [30.0175873, 31.2050287],
        ],
      };

      var simpleFillSymbol = {
        type: "simple-fill",
        color: "#aa3a3a",

        outline: {
          color: "#aa3a3a",
          width: 1,
        },
        style: "backward-diagonal",
      };

      var polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
      });

      graphicsLayer.add(polygonGraphic);
    });
  };

  componentDidMount() {

    navigator.geolocation.getCurrentPosition(position=>{

      if(position !== undefined)
      {
        this.setState({location:{lat:position.coords.latitude,long:position.coords.longitude}})
      }
      console.log("lat",position.coords.latitude)
      console.log("long",position.coords.longitude)
    })
    this.loadMap();
  }
  componentDidUpdate() {
    this.view.on("click", function (event) {
      // you must overwrite default click-for-popup
      // behavior to display your own popup
      this.view.popup.autoOpenEnabled = false;

      // Get the coordinates of the click on the view
      var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
      var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
      console.log("beeeeeeeb");
      this.view.popup.open({
        // Set the popup's title to the coordinates of the location
        title: "Reverse geocode: [" + lon + ", " + lat + "]",
        location: event.mapPoint, // Set the location of the popup to the clicked location
        // content: "This is a point of interest"  // content displayed in the popup
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
    console.log("indexxxxxxxxx", this.state.index);

    // this.loadMap()
    return (
      <div>
        <select
          value={this.state.currentGov}
          onChange={(e) => this.handleChange(e)}
        >
          {this.state.govs.map((i) => {
            return <option>{i.en_name}</option>;
          })}
        </select>

        <div style={{display:"flex",flex:1}}>
          <div className="webmap" style={{ height: 1000 ,width:"80%"}} ref={this.mapRef} />
          <div style={{flexDirection:"column"}}>
          {
            this.state.index !== -1 && 
            Object.keys(this.state.data[this.state.index]).map(key=>(

              <div style={{display:"flex",flexDirection:"row"}}>

                <div>{key + " :  "}</div>
                <div>{this.state.data[this.state.index][key]}</div>
              </div>
            ))
          }
          </div>
        </div>
      </div>
    );
  }
}
export default WebMapView;
