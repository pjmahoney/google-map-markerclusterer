import { Polymer } from '@polymer/polymer/polymer-legacy.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { LegacyElementMixin } from '@polymer/polymer/lib/legacy/legacy-element-mixin.js';
import { mixinBehaviors } from '../../node_modules/@polymer/polymer/lib/legacy/class.js';
import { Markerclusterer } from  './google-map-overlayview-behavior.js';
/*
The `google-map-markercluster` is an internal element that is used by `google-map-markerclusterer`. By default it wraps
a `<google-map-defaulticon>` element.
*/
class GoogleMapMarkercluster extends mixinBehaviors([Markerclusterer.GoogleMapOverlayViewBehavior],LegacyElementMixin(PolymerElement)) {
  static get template() {
    return html`
    <style>
      :host {}
    </style>

    <div hidden\$="{{hidden}}">
      <slot id="overlayContent" name="overlay-content"></slot>
    </div>
`;
  }

  static get is() { return 'google-map-markercluster'; }
  static get properties() {
    return {
      /**
       * The center position of the cluster element (lat,lon)
       */
      center: { type: Object, value: null, notify: true },
      /**
       * When set the cluster icon is hidden
       */
      hidden: { type: Boolean, value: false }
    };
  }

  constructor() {
    super();
    this.markers = [];
    this._listeners = {};
  }

  connectedCallback() {
    super.connectedCallback();
    Polymer.RenderStatus.beforeNextRender(this, function () {
      var contents = this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true }).filter(n => n.nodeType === Node.ELEMENT_NODE);
      if (contents.length > 0) {
        this.clusterSubIcon = contents[0];
        this.clusterSubIcon.markers = this.markers;
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.map = null;
  }

  /**
   * draw callback when the cluster is drawn.
   */
  draw() {
    try {
      if (this.visible) {
        var pos = this.getPosFromLatLng(this.center);
        this.style.top = pos.y + 'px';
        this.style.left = pos.x + 'px';
      }
    } catch (err) { }
  }

  /**
   * Update the icon when a marker is added
   */
  _updateIcon() {
    var mCount = this.markers.length;
    if (this.maxZoom !== null && this.map.getZoom() > this.maxZoom) {
      this.hidden = true;
      return;
    }

    if (mCount < this.minimumClusterSize) {
      // Min cluster size not yet reached.
      this.hidden = true;
      return;
    }
    if (this.clusterSubIcon) {
      this.clusterSubIcon.markers = this.markers;
    }
    this.hidden = false;
  }

  /**
   * Check if the marker was already added
   */
  _isMarkerAlreadyAdded(marker) {
    var i;
    if (this.markers.indexOf) {
      return this.markers.indexOf(marker) !== -1;
    } else {
      for (i = 0; i < this.markers.length; i++) {
        if (marker === this.markers[i]) {
          return true;
        }
      }
    }
    return false;
  }

  /**
  * Calculates the extended bounds that is given by the contained markers.
  */
  _calculateBounds() {
    var bounds = new google.maps.LatLngBounds(this.center, this.center);
    this.bounds = this.getExtendedBounds(bounds, this.gridSize);
  }

  /**
   * Check if marker is inside the extended bounds.
   */
  isMarkerInClusterBounds(marker) {
    return this.bounds && this.bounds.contains(marker.getPosition());
  }

  /**
   * Calculates the bounds that is given by the contained markers.
   */
  _getBounds() {
    var i;
    var bounds = new google.maps.LatLngBounds(this.center, this.center);
    for (i = 0; i < this.markers.length; i++) {
      bounds.extend(this.markers[i].getPosition());
    }
    return bounds;
  }

  /**
   * Adds a marker to the cluster and updates the cluster icon
   */
  addMarker(marker) {
    var i;
    var mCount;
    var mz;
    if (this._isMarkerAlreadyAdded(marker)) {
      return false;
    }
    if (!this.center) {
      this.center = marker.getPosition();
      this._calculateBounds();
    } else {
      if (this.averageCenter) {
        var l = this.markers.length + 1;
        var lat = (this.center.lat() * (l - 1) + marker.getPosition().lat()) / l;
        var lng = (this.center.lng() * (l - 1) + marker.getPosition().lng()) / l;
        this.center = new google.maps.LatLng(lat, lng);
        this._calculateBounds();
      }
    }
    marker.isAdded = true;
    this.markers.push(marker);

    mCount = this.markers.length;
    mz = this.maxZoom;
    if (mz !== null && this.map.getZoom() > mz) {
      // Zoomed in past max zoom, so show the marker.
      if (marker.getMap() !== this.map) {
        marker.setMap(this.map);
      }
    } else if (mCount < this.minimumClusterSize) {
      // Min cluster size not reached so show the marker.
      if (marker.getMap() !== this.map) {
        marker.setMap(this.map);
      }
    } else if (mCount === this.minimumClusterSize) {
      // Hide the markers that were showing.
      for (i = 0; i < mCount; i++) {
        this.markers[i].setMap(null);
      }
    } else {
      marker.setMap(null);
    }

    this._updateIcon();
    return true;
  }

  /**
   * onRemove callback when the cluster is removed.
   * Clears the event listeners.
   */
  onRemove() {
    this._clearListener('mouseout');
    this._clearListener('mouseover');
    this._clearListener('click');
    this._clearListener('mousedown');
    this._clearListener('boundsChanged');
    google.maps.event.clearInstanceListeners(this);
    if (this.parentNode) {
      Polymer.dom(this.parentNode).removeChild(this);
    }
    this.markers = [];
  }

  /**
   * onAdd callback when the cluster is added.
   * Event listeners for various events are setup.
   */
  onAdd() {
    this.style.position = 'absolute';
    this.style.cursor = 'pointer';
    var cMouseDownInCluster;
    var cDraggingMapByCluster;

    this.overlay.getPanes().overlayMouseTarget.appendChild(this);

    // Fix for Issue 157
    this.map && (this._listeners.boundsChanged = google.maps.event.addListener(this.map, 'bounds_changed', function () {
      cDraggingMapByCluster = cMouseDownInCluster;
    }));

    this._listeners.mousedown = google.maps.event.addDomListener(this, 'mousedown', function () {
      cMouseDownInCluster = true;
      cDraggingMapByCluster = false;
    });

    this._listeners.click = google.maps.event.addDomListener(this, 'click', function (e) {
      cMouseDownInCluster = false;
      this.fire('google-map-markercluster-click');
      if (!cDraggingMapByCluster) {
        var theBounds;
        var mz;
        if (!this.zoomOnClick) {
          return;
        }
        mz = this.maxZoom;
        theBounds = this._getBounds();
        this.map.fitBounds(theBounds);
        // There is a fix for Issue 170 here:
        /* this.async(function() {
           this.map.fitBounds(theBounds);
           // Don't zoom beyond the max zoom level

         },null,100);*/
        if (mz !== null && (this.map.getZoom() > mz)) {
          this.map.setZoom(mz + 1);
        }
        // Prevent event propagation to the map:
        e.cancelBubble = true;
        if (e.stopPropagation) {
          e.stopPropagation();
        }
      }
    }.bind(this));


    this._forwardEvent('mouseover');
    this._forwardEvent('mouseout');

  }

  _forwardEvent(name) {
    this._listeners[name] = google.maps.event.addDomListener(this, name, function () {
      this.fire('google-map-markercluster-' + name);
    }.bind(this));
  }

  _clearListener(name) {
    if (this._listeners[name]) {
      google.maps.event.removeListener(this._listeners[name]);
      this._listeners[name] = null;
    }
  }
}

window.customElements.define(GoogleMapMarkercluster.is, GoogleMapMarkercluster);
