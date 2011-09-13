/*!
 * g.Raphael 0.4.2 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.fn.g.burndown = function (x, y, width, height, dates, original, added, opts) {

  var max = function(a, f) {
    f = f || function(p, c) {
      return p < c ? c : p;
    }
    return a.reduce(f, 0);
  }
  var total = function(a, f) {
    f = f || function(p, c) {
      return p + c;
    }
    return a.reduce(f, 0);
  }
  
  var gutter = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 20
    // top: 10,
    // right: 10,
    // bottom: 50,
    // left: 20
  };

  var chart = this.set();
  
  var maxOriginalY = max(original);
  var maxAddedY = max(added);
  var totalY = maxAddedY + maxOriginalY;
  
  var heightOriginal = maxOriginalY !== 0 ? (height - gutter.top - gutter.bottom) * (maxOriginalY / totalY) : 0;
  var heightAdded = maxAddedY !== 0 ? (height - gutter.top - gutter.bottom) * (maxAddedY / totalY) : 0;

    // function (x, y, length, from, to, steps, orientation, labels, type, dashsize) {
      // orientation: 0:hor,below, 1:ver:left, 2:hor:above, 3: ver:right
  
  this.g.axis(gutter.left, gutter.top + heightOriginal, heightOriginal, 0, maxOriginalY, 0, 1);

    
return chart;

    chart.push(lines, shades, symbols, axis, columns, dots);
    chart.lines = lines;
    chart.shades = shades;
    chart.symbols = symbols;
    chart.axis = axis;
    chart.hoverColumn = function (fin, fout) {
        !columns && createColumns();
        columns.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.clickColumn = function (f) {
        !columns && createColumns();
        columns.click(f);
        return this;
    };
    chart.hrefColumn = function (cols) {
        var hrefs = that.raphael.is(arguments[0], "array") ? arguments[0] : arguments;
        if (!(arguments.length - 1) && typeof cols == "object") {
            for (var x in cols) {
                for (var i = 0, ii = columns.length; i < ii; i++) if (columns[i].axis == x) {
                    columns[i].attr("href", cols[x]);
                }
            }
        }
        !columns && createColumns();
        for (i = 0, ii = hrefs.length; i < ii; i++) {
            columns[i] && columns[i].attr("href", hrefs[i]);
        }
        return this;
    };
    chart.hover = function (fin, fout) {
        !dots && createDots();
        dots.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.click = function (f) {
        !dots && createDots();
        dots.click(f);
        return this;
    };
    chart.each = function (f) {
        createDots(f);
        return this;
    };
    chart.eachColumn = function (f) {
        createColumns(f);
        return this;
    };
    return chart;
};
