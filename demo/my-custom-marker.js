import '../google-map-overlayview-marker-behavior.js';
import './my-css-pie.js';
class MyCustomMarker extends Polymer.mixinBehaviors([Markerclusterer.GoogleMapOverlayViewMarkerBehavior], Polymer.Element) {
  static get is() { return 'my-custom-marker'; }

  constructor() {
    super();
    this.pieChart = null;
    this.infoWindow = null;
    this.data = [10, 20, 40, 30];
    this._onClickMarkerListener = this.onClickMarker.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    Polymer.Gestures.addListener(this, 'tap', this._onClickMarkerListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    Polymer.Gestures.removeListener(this, 'tap', this._onClickMarkerListener);
  }

  onAdd() {
    this.style.cursor = "pointer";
    this.pieChart = document.createElement('my-css-pie')
    Polymer.dom(this).appendChild(this.pieChart);
    this.pieChart.data = this.data;
    this.pieChart.size = 25;
    var panes = this.overlay.getPanes();
    panes.overlayMouseTarget.appendChild(this);
  }

  onClickMarker() {
    if (!this.infoWindow) {
      this.infoWindow = new google.maps.InfoWindow();
    }
    var divContainer = document.createElement("div");
    divContainer.style.width = "150px";
    divContainer.style.height = "140px";
    var pieChart = document.createElement('my-css-pie');
    pieChart.data = this.data;
    pieChart.size = 100;
    divContainer.appendChild(pieChart);
    this.infoWindow.setContent(divContainer);
    this.infoWindow.setPosition(this.position);
    this.infoWindow.open(this.overlay.getMap());
  }

  onRemove() {
    this.removeChild(this.pieChart);
    this.infoWindow = null;
  }
}

window.customElements.define(MyCustomMarker.is, MyCustomMarker);
