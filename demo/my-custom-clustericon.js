import '../google-map-markercluster-icon-behavior.js';
import './my-css-pie.js';
class MyCustomClustericon extends Polymer.mixinBehaviors([Markerclusterer.ClusterIconBehavior], Polymer.Element) {
  static get template() {
    return `
    <style>
      :host {
        position: absolute;
        top: -15px;
        left: -15px;
      }

      .icon {
        position: absolute;
        left: 0;
        top: 0;
      }

      .text {
        position: absolute;
        text-align: center;
        font-family: Arial, sans-serif;
        font-weight: bold;
        font-style: normal;
        text-decoration: none;
        font-size: 16px;
        width: 30px;
        line-height: 30px;
        color: black;
        top: 0;
        left: 0;
      }
    </style>

    <div class="icon" id="icon">
      <my-css-pie id="pie" size="30"></my-css-pie>
    </div>
    <div class="text" id="text">{{text}}</div>
`;
  }

  static get is() { return 'my-custom-clustericon'; }
  static get properties() {
    return {
      iconOffset: { type: Array, value: function () { return ["15px", "15px"] } },
      textOffset: { type: Array, value: function () { return [0, 0] } }
    };
  }

  constructor() {
    super();
    this.pieChart = null;
  }

  ready() {
    super.ready();
    this.pieChart = this.$.pie;
  }

  updateMarkers(markers) {
    this.pieChart.data = [10, 20, 40, 30];
    this.text = markers.length;
  }
}

window.customElements.define(MyCustomClustericon.is, MyCustomClustericon);
