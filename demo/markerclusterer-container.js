import '../google-map-markerclusterer.js';
var BASE_IMAGE_URL = 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/';
var _STYLES = [[{
  url: BASE_IMAGE_URL + 'people35.png',
  width: "35px",
  height: "35px",
  textColor: '#ff00ff',
  textSize: "10px"
}, {
  url: BASE_IMAGE_URL + 'people45.png',
  width: "45px",
  height: "45px",
  textColor: '#ff0000',
  textSize: "11px"
}, {
  url: BASE_IMAGE_URL + 'people55.png',
  width: "55px",
  height: "55px",
  textColor: '#ffffff',
  textSize: "12px"
}], [{
  url: BASE_IMAGE_URL + 'conv30.png',
  width: "30px",
  height: "27px",
  anchorText: ["-3px", "0px"],
  anchorIcon: ["27px", "28px"],
  textColor: '#ff00ff',
  textSize: "10px"
}, {
  url: BASE_IMAGE_URL + 'conv40.png',
  width: "40px",
  height: "36px",
  anchorText: ["-4px", "0px"],
  anchorIcon: ["36px", "37px"],
  textColor: '#ff0000',
  textSize: "11px"
}, {
  url: BASE_IMAGE_URL + 'conv50.png',
  width: "50px",
  height: "45px",
  anchorText: ["-5px", "0px"],
  anchorIcon: ["45px", "46px"],
  textColor: '#0000ff',
  textSize: "12px"
}], [{
  url: BASE_IMAGE_URL + 'heart30.png',
  width: "30px",
  height: "26px",
  anchorIcon: ["26px", "15px"],
  textColor: '#ff00ff',
  textSize: "10px"
}, {
  url: BASE_IMAGE_URL + 'heart40.png',
  width: "40px",
  height: "35px",
  anchorIcon: ["35px", "20px"],
  textColor: '#ff0000',
  textSize: "11px"
}, {
  url: BASE_IMAGE_URL + 'heart50.png',
  width: "50px",
  height: "44px",
  anchorIcon: ["44px", "25px"],
  textSize: "12px"
}]];

class MarkerclustererContainer extends Polymer.Element {
  static get template() {
    return `
    <style>
      #map {
        width: 800px;
        height: 400px;
      }

      #map-container {
        padding: 6px;
        border-width: 1px;
        border-style: solid;
        border-color: #ccc #ccc #999 #ccc;
        -webkit-box-shadow: rgba(64, 64, 64, 0.5) 0 2px 5px;
        -moz-box-shadow: rgba(64, 64, 64, 0.5) 0 2px 5px;
        box-shadow: rgba(64, 64, 64, 0.1) 0 2px 5px;
        width: 800px;
        height: 400px;
      }

      #minimumClusterSize {
        width: 50px;
      }

      google-map {
        display: block;
        height: 100%;
      }
    </style>

    <div id="map-container">
      <google-map latitude="39.91" map="{{map}}" id="mapelement" longitude="116.38" zoom="2"></google-map>
      <google-map-markerclusterer map="{{map}}" max-zoom="{{maxZoom}}" minimum-cluster-size="{{minimumClusterSize}}" grid-size="{{gridSize}}" markers="{{markersToDisplay}}" average-center="{{averageCenter}}" styles="{{styles}}">
        <slot id="custom_cluster_icon" name="custom-cluster-icon" slot="cluster-icon"></slot>
      </google-map-markerclusterer>
    </div>
    <div id="inline-actions">
      <span>Max zoom level:
        <select id="zoom" value="{{maxZoom::change}}">
          <option value="null">No limit</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
        </select>
      </span>
      <span>Minimum clustersize:
        <input id="minimumClusterSize" value-as-number="{{minimumClusterSize::change}}" type="number">
      </span>
      <span class="item">Cluster size:
        <select id="size" value="{{gridSize::change}}">
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="60">60</option>
          <option value="70">70</option>
          <option value="80">80</option>
        </select>
      </span>
      <span class="item" id="styleContainer" hidden\$="{{_isStyleVisible()}}">Cluster style:
        <select id="style" value="{{activeStyle::change}}">
          <option value="-1">Default</option>
          <option value="0">People</option>
          <option value="1">Conversation</option>
          <option value="2">Heart</option>
        </select>
      </span>
      <span class="item">Average center
        <input type="checkbox" checked="{{averageCenter::change}}">
      </span>
      <input id="refresh" type="button" value="Refresh Map" class="item" on-click="refresh">
      <input id="clear" type="button" value="Clear" on-click="clickClear">
    </div>
`;
  }

  static get is() { return 'markerclusterer-container'; }
  static get properties() {
    return {
      markers: { type: Array, value: function () { return []; }, observer: 'markersChanged' },
      markersToDisplay: { type: Array, value: function () { return []; } },
      selectedStyle: { type: Number, value: 0 },
      maxZoom: { type: Number, value: null },
      minimumClusterSize: { type: Number, value: 2 },
      gridSize: { type: Number, value: 60, observer: '_changeGridSize' },
      averageCenter: { type: Boolean, value: false },
      activeStyle: { type: Number, value: -1, observer: '_changeStyle' },
      map: { type: Object, value: null }
    };
  }

  _isStyleVisible() {
    return Polymer.dom(this.$.custom_cluster_icon).getDistributedNodes().length > 0;
  }

  refresh() {
    this.markersToDisplay = this.markers;
  }

  markersChanged(newValue, oldValue) {
    this.markersToDisplay = newValue;
  }

  clickClear() {
    this.markersToDisplay = [];
  }

  _changeGridSize(gridSize) {
    if (typeof gridSize == "string") {
      this.gridSize = Number(gridSize);
    }
  }

  _changeStyle(newValue, oldValue) {
    newValue = Number(newValue);
    if (newValue == -1) {
      this.styles = null;
    }
    else {
      this.styles = _STYLES[newValue];
    }
  }
}

window.customElements.define(MarkerclustererContainer.is, MarkerclustererContainer);
