import React, { Component, PropTypes } from 'react';
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js';
import mapboxgl from 'mapbox-gl';
import * as clusterIcons from './clusterIcons';
import './deviceMap.css';

class LbsMap extends Component {

  componentDidMount() {
    MapboxGl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
    const map=  new MapboxGl.Map({
      container: this.container,
      style: 'mapbox://styles/mapbox/dark-v9'
    });

    map.on('load', function() {
    map.addSource("earthquakes", {
        type: "geojson",
        data: "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson",
        cluster: true,
        clusterMaxZoom: 40, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "earthquakes",
        filter: ["has", "point_count"],
        paint: {
            "circle-color": {
                property: "point_count",
                type: "interval",
                stops: [
                    [0, "gray"],
                    [10, "#ffff99"],
                    [50, "#c2d6d6"]
                ]
            },
            "circle-radius": {
                property: "point_count",
                type: "interval",
                stops: [
                    [0, 20],
                    [100, 30],
                    [750, 40]
                ]
            }
        }
    });

    map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12
        }
    });

    map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!has", "point_count"],
        paint: {
            "circle-color": "#11b4da",
            "circle-radius": 5,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff"
        }
    });
  });
  }

  render() {
    return (
      <div>
        <div className="mapbox-missing-css">Missing CSS</div>
        <div id='map' ref={(x) => { this.container = x }}></div>
      </div>
    )
  }
}

export default LbsMap;
