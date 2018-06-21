/* global google */
var Markerclusterer = Markerclusterer || {};
/**
 * Use `Markerclusterer.GoogleMapOverlayViewBehavior` to implement elements that should be displayed on a `google-map` using an overlayview
 * @polymerBehavior Markerclusterer.GoogleMapOverlayViewBehavior
 */
Markerclusterer.GoogleMapOverlayViewBehavior = {
  properties: {

    /**
     * A Maps API object.
     */
    map: {
      type: Object,
      observer: '_mapChanged'
    },

    /**
     * A boolean flag to set the visiblity
     */
    visible: {
      type: Boolean,
      value: true
    },
  },

  created: function () {
    this._initOverlay();
  },

  /**
   * Initializes the overlay if the Google Maps API was properly loaded.
   * Sets the callbacks (onAdd, draw and onRemove) to the current instance
   */
  _initOverlay: function () {
    if (typeof google === 'object' && typeof google.maps === 'object') {
      if (this.overlay && this.overlay instanceof google.maps.OverlayView) {
        return;
      }
      this._overlayView.prototype = new google.maps.OverlayView();
      this._overlayView.prototype.onAdd = this.onAdd.bind(this);
      this._overlayView.prototype.draw = this.draw.bind(this);
      this._overlayView.prototype.onRemove = this.onRemove.bind(this);
      this.overlay = new this._overlayView(this.map);
    }
  },
  /**
   * OverlayView object constructor.
  */
  _overlayView: function (map) {
    if (map && map instanceof google.maps.Map) {
      this.map = map;
    }
  },


  /**
   * Callback when the map is changed. By default this will call `setMap` on the `OverlayView`
  */
  _mapChanged: function (map) {
    this._initOverlay();
    if (this.overlay && this.overlay instanceof google.maps.OverlayView) {
      this.overlay.setMap(map);
    }
  },



  /**
   * draw callback when the overlayview is drawn
   */
  draw: function () { },

  /**
   * onAdd callback when the overlayview is added to the map.
   */
  onAdd: function () {
    var panes = this.overlay.getPanes();
    panes.overlayLayer.appendChild(this);
  },

  /**
   * onRemove callback when the overlayview is removed from the map.
   */
  onRemove: function () {
    Polymer.dom(this.parentNode).removeChild(this);
  },

  /**
   * Returns the position at which to place the DIV depending on the latlng.
   *
   * @param {google.maps.LatLng} latlng The position in latlng.
   * @return {google.maps.Point} The position in pixels.
   */
  getPosFromLatLng: function (latlng) {
    var pos = this.overlay.getProjection().fromLatLngToDivPixel(latlng);
    pos.x = parseInt(pos.x, 10);
    pos.y = parseInt(pos.y, 10);
    return pos;
  },
  /**
   * Returns the current bounds extended by the grid size.
   *
   * @param {google.maps.LatLngBounds} bounds The bounds to extend.
   * @return {google.maps.LatLngBounds} The extended bounds.
   */
  getExtendedBounds: function (bounds, size) {
    if (!this.overlay) return null;
    var projection = this.overlay.getProjection();

    // Turn the bounds into latlng.
    var tr = new google.maps.LatLng(bounds.getNorthEast().lat(),
      bounds.getNorthEast().lng());
    var bl = new google.maps.LatLng(bounds.getSouthWest().lat(),
      bounds.getSouthWest().lng());

    // Convert the points to pixels and the extend out by the grid size.
    var trPix = projection.fromLatLngToDivPixel(tr);
    trPix.x += size;
    trPix.y -= size;

    var blPix = projection.fromLatLngToDivPixel(bl);
    blPix.x -= size;
    blPix.y += size;

    // Convert the pixel points back to LatLng
    var ne = projection.fromDivPixelToLatLng(trPix);
    var sw = projection.fromDivPixelToLatLng(blPix);

    // Extend the bounds to contain the new bounds.
    bounds.extend(ne);
    bounds.extend(sw);

    return bounds;
  },
};

export { Markerclusterer };
