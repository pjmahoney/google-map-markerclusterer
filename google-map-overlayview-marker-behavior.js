import { Markerclusterer } from './google-map-overlayview-behavior.js';
/* global google */
/**
 * Use `Markerclusterer.GoogleMapOverlayViewMarkerBehavior` to implement elements that should be displayed as `Marker` on a `google-map` using an overlayview
 * Users should either override the `_update` if they need to customize the positioning.
 * @polymerBehavior Markerclusterer.GoogleMapOverlayViewMarkerBehavior
 */
Markerclusterer.GoogleMapOverlayViewMarkerBehaviorImpl = {
  properties: {
          /**
           * The position of the marker on the map
           */
    position: Object,
          /**
           * The size of the marker
           */
    size: Number,
          /**
           * Set to true if the marker should be draggable
           */
    draggable: Boolean
  },

  attached: function () {
    this.size = 25;
    this.draggable = false;
  },

  ready: function () {
    this.style.position = 'absolute';
  },
      /**
       * Returns the position of the marker
       */
  getPosition: function () {
    return this.position;
  },

      /**
       * Returns whether marker is draggable.
       */
  getDraggable: function () {
    return this.draggable;
  },

      /**
       * Returns the map instance.
       */
  getMap: function () {
    if (this.overlay) {
      return this.overlay.getMap();
    }
    return null;
  },
      /**
       * Sets the map instance
       */
  setMap: function (map) {
    if (this.overlay && this.overlay instanceof google.maps.OverlayView) {
      this.overlay.setMap(map);
    }
  },

      /**
       * Draw callback forwarded to the function `update`.
       */
  draw: function () {
    this.update(this.position, this.size);
  },
      /**
       * Override this function to implement custom positioning.
       * By default will `left` and `top` CSS settings are used to position the element.
       */
  update: function (position, size) {
    var projection = this.overlay.getProjection();
    var mapPos = projection.fromLatLngToDivPixel(position);
    this.style.left = (mapPos.x - size / 2) + 'px';
    this.style.top = (mapPos.y - size / 2) + 'px';
  }
};
/** @polymerBehavior GoogleMapOverlayViewMarkerBehavior */
Markerclusterer.GoogleMapOverlayViewMarkerBehavior = [Markerclusterer.GoogleMapOverlayViewBehavior, Markerclusterer.GoogleMapOverlayViewMarkerBehaviorImpl];

export { Markerclusterer };
