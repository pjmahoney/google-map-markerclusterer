var DEFAULT_COLORS20 = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];
var DEFAULT_COLORS10 = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

class MyCssPie extends Polymer.Element {
  static get template() {
    return `
    <style>
      :host {
        display: block;
      }

      #background {
        position: relative;
      }

      .slice {
        position: absolute;
        top: 0px;
        left: 0px;
      }

      .pie {
        position: absolute;
        top: 0px;
        left: 0px;
      }
    </style>

    <div id="container">
      <div id="background" style\$="{{_computeContainerStyle(size,baseColor)}}">
        <template is="dom-repeat" items="{{_computeSlices(colors,data,size)}}">
          <div class="slice" style\$="{{_computeOuterStyle(item,size)}}">
            <div class="pie" style\$="{{_computeInnerStyle(item,size)}}">
            </div>
          </div>
          <template is="dom-if" if="{{item.isRight}}" restamp="true">
            <div class="slice" style\$="{{_computeSecondOuterStyle(item,size,index)}}">
              <div class="pie" style\$="{{_computeSecondInnerStyle(item,size,index)}}">
              </div>
            </div>
          </template>
        </template>
      </div>
  </div>
`;
  }

  static get is() { return 'my-css-pie'; }
  static get properties() {
    return {
      /**
    * The `colors` attribute specifies the colors to be used for each slice.
    * If no colors are specified then the default-colors are used.
    * 
    * @attribute colors
    */
      colors: { type: Array, value: function () { return []; } },

      /**
      * The `size` property specifies the size of the piechart (Default: 50).
      * 
      * @attribute size
      */
      size: { type: Number, value: 50 },

      /**
       * The `data` property specifies the values for each slice.
       * 
       * @attribute data
      */
      data: { type: Array, value: function () { return []; } },
      /**
       * The `baseColor` property specifies the base-color of the contaner.
      */
      baseColor: { type: String, value: 'transparent' }
    };
  }

  _computeContainerStyle(size, baseColor) {
    return "width:" + size + "px;height:" + size + "px;border-radius:" + size + "px;background-color:" + baseColor + ";";
  }

  _computeOuterStyle(slice, size) {
    if (slice.isRight) {
      return "-webkit-transform:rotate(" + slice.beforeDegree + "deg);transform:rotate(" + slice.beforeDegree + "deg);clip:rect(0px," + size + "px," + size + "px," + (size - 100) / 2 + "px);width:" + size + "px;height:" + size + "px;border-radius :" + size + "px";
    }
    return "-webkit-transform:rotate(" + slice.beforeDegree + "deg);transform:rotate(" + slice.beforeDegree + "deg);clip:rect(0px," + size + "px," + size + "px," + size / 2 + "px);width:" + size + "px;height:" + size + "px;border-radius :" + size + "px;";

  }

  _computeSecondOuterStyle(slice, size, index) {
    var beforeDegree = 180 + (index == 0 ? slice.beforeDegree : (slice.beforeDegree - 1));
    return "-webkit-transform:rotate(" + beforeDegree + "deg);transform:rotate(" + beforeDegree + "deg);clip:rect(0px," + size + "px," + size + "px," + size / 2 + "px);width:" + size + "px;height:" + size + "px;border-radius:" + size + "px;";
  }

  _computeSecondInnerStyle(slice, size, index) {
    var degree = (index == 0 ? slice.degree : (slice.degree + 1));
    return "-webkit-transform:rotate(" + degree + "deg);transform:rotate(" + degree + "deg);clip:rect(0px," + size / 2 + "px," + size + "px,0px);background-color:" + slice.backgroundColor + ";width:" + size + "px;height:" + size + "px;border-radius:" + size + "px;";
  }

  _computeInnerStyle(slice, size) {
    if (slice.isRight) {
      return "-webkit-transform:rotate(180deg);transform:rotate(180deg);background-color:" + slice.backgroundColor + ";width:" + size + "px;height:" + size + "px;border-radius :" + size + "px;clip:rect(0px," + size / 2 + "px," + size + "px,0px)";
    }
    return "-webkit-transform:rotate(" + slice.degree + "deg);transform:rotate(" + slice.degree + "deg);clip:rect(0px," + size / 2 + "px," + size + "px,0px);background-color:" + slice.backgroundColor + ";width:" + size + "px;height:" + size + "px;border-radius :" + size + "px;";
  }

  _getColors(colors) {
    if (!colors || colors.length == 0) {
      colors = this.data.length > 10 ? DEFAULT_COLORS20 : DEFAULT_COLORS10;
    }
    return colors;
  }

  _calculateTotal(data) {
    var total = 0;
    for (var i = 0; i < data.length; i++) {
      total += data[i];
    }
    return total;
  }

  _calculatePercentages(data) {
    var percentages = [];
    var total = this._calculateTotal(data);
    for (var i = 0; i < data.length; i++) {
      percentages.push(100 * data[i] / total);
    }
    return percentages;
  }

  _computeSlices(colors, data, size) {
    var backGroundColors = this._getColors(colors);
    var percentages = this._calculatePercentages(data);
    var slices = [];
    var beforeDegree = 0;
    var degree = 0;
    for (var i = 0; i < percentages.length; i++) {
      var piePercentage = percentages[i];
      var slice = { percentage: piePercentage, size: size, backgroundColor: backGroundColors[i], isRight: false };
      if (piePercentage <= 50) {
        degree = parseFloat((180 * piePercentage) / 50);
        slice.beforeDegree = beforeDegree;
        slice.degree = degree;
        beforeDegree += degree;
      }
      else {
        degree = parseFloat(((piePercentage - 50) * 180) / 50);
        slice.beforeDegree = beforeDegree;
        slice.degree = degree;
        beforeDegree += (180 + degree);
        slice.isRight = true;
      }
      slices.push(slice);
    }
    return slices;
  }
}

window.customElements.define(MyCssPie.is, MyCssPie);
