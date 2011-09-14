(function() {
  
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
  var r = function(f) {
    return Math.round(f) + .5;
  }


  var Path = function() {
    this.path = "";
  }
  Path.prototype.toString = function() { return this.path.substr(1); }
  Path.prototype.move = function(x, y) { this.path += " M " + r(x) + " " + r(y); return this; }
  Path.prototype.line = function(x, y) { this.path += " L " + r(x) + " " + r(y); return this; }
  Path.prototype.clone = function() { this.path += " Z"; return this; }




/**

data = [
  { label: '2011-09-12', remaining: 7, added: 0 },
  { label: '2011-09-13', remaining: 7, added: 1 },
  { label: '2011-09-14', remaining: 5, added: 1 },
  { label: '2011-09-15', remaining: 2, added: 0 },
  { label: '2011-09-16', remaining: 0, added: 0 }
]

**/

Raphael.fn.g.burndown = function (x, y, width, height, data) {

  var gutter = {
        top: 10,
        right: 30,
        bottom: 80,
        left: 30
      }
    , availWidth = width - gutter.left - gutter.right
    , availHeight = height - gutter.top - gutter.bottom
    , corners = {
        top: gutter.top
      , right: gutter.left + availWidth
      , bottom: gutter.top + availHeight
      , left: gutter.left
      }
    , points = {}
    , colors = {
        axis: 'black'
      }
    ;
  
  var accAdded = 0;
  data = data.map(function(d, i) {
    accAdded += d.added;
    return {
      label: d.label,
      remaining: d.remaining,
      baseRemaining: d.remaining - accAdded,
      added: d.added,
      coords: {
        left: gutter.left + columnWidth * i,
        center: gutter.left + columnWidth * (i + .5)
      }
    }
  });

  points.totalAdded = data.reduce(function(t, c) { return t + (c.added || 0); }, 0);
  points.originalRemaining = data[0] ? data[0].remaining || 0 : 0;
  points.uppermostRemaining = data.reduce(function(t, c) { return Math.max(t, c.baseRemaining); });
  points.total = points.totalAdded + points.uppermostRemaining;
  points.axisDelta = 
  
  var columnWidth = availWidth / data.length;
  
  var chart = this.set(),
      axis = this.set();
  
  // Draw chart axis
  axis.push(this.path(new Path()
    .move(corners.left, corners.top)
    .line(corners.left, corners.bottom)
  ));
  
  // Check if we have data for at least the first day.
  if (points.total) {
    
    var base = gutter.top + (availHeight * (points.originalRemaining / points.total));
    
    // Draw base line
    axis.push(this.path(new Path()
      .move(corners.left, base)
      .line(corners.right, base)
    ));
  }
  
  
  // var maxOriginalPoints = max(original);
  // var maxAddedPoints = max(added);
  // var maxTotalPoints = maxAddedPoints + maxOriginalPoints;
  // var availHeight = height - gutter.top - gutter.bottom;
  // var availWidth = width - gutter.left - gutter.right;
  // 
  // var axisPointsMax = Math.ceil(maxOriginalPoints / 5) * 5;
  // var axisPointsMin = Math.floor(-maxAddedPoints / 5) * 5;
  // var axisPointsTotal = axisPointsMax - axisPointsMin;
  // 
  // var heightOriginal = axisPointsMax !== 0 ? availHeight * (axisPointsMax / axisPointsTotal) : 0;
  // var heightAdded = maxAddedPoints !== 0 ? availHeight * (-axisPointsMin / axisPointsTotal) : 0;
  // 
  //   // function (x, y, length, from, to, steps, orientation, labels, type, dashsize) {
  //     // orientation: 0:hor,below, 1:ver:left, 2:hor:above, 3: ver:right
  // var steps = axisPointsTotal / 10;
  // 
  // this.g.axis(gutter.left, gutter.top + heightOriginal + heightAdded, heightOriginal + heightAdded, axisPointsMin, axisPointsMax, steps, 1);
  // this.g.axis(width - gutter.right, gutter.top + heightOriginal + heightAdded, heightOriginal + heightAdded, axisPointsMin, axisPointsMax, steps, 3);
  // 
  // var origo = {
  //   x: gutter.left,
  //   y: gutter.top + heightOriginal
  // };
  // 
  // this.path(new Path()
  //   .M(origo.x, origo.y)
  //   .L(width - gutter.right, origo.y)
  // );
  // 
  // var dx = availWidth/dates.length;
  // 
  // for (var i=0, d, x; (d=dates[i]) && (x=gutter.left+i*dx); i++) {
  //   // Text
  //   var text = this.text(x+dx/2, height-40, d);
  //   text.rotate(31).attr({
  //     'font-size': '12px'
  //   });
  //   
  //   if (i === 0) continue;
  //   
  //   // Line
  //   this.path(new Path().M(x, gutter.top).L(x, height - gutter.bottom)).attr({
  //     opacity: .5
  //   });
  // }
  // 
  // var lines = this.set();
  // var p, x, y, c = this.g.colors[0];
  // for (var i=0, val; val=original[i]; i++) {
  //   x = gutter.left + dx/2 + dx*i;
  //   y = origo.y - (val/axisPointsMax) * heightOriginal;
  //   
  //   if (p === undefined) {
  //     p = new Path().M(x, y);
  //   } else {
  //     p.L(x, y);
  //   }
  //   
  //   this.g.disc(x, y, 5).attr({
  //     fill: c,
  //     stroke: 'none'
  //   });
  // }
  // // Line
  // this.path(p).attr({
  //   'stroke': c,
  //   'stroke-width': 2
  // });
  // // Shadow
  // p.L(x, origo.y).L(gutter.left + dx/2, origo.y).Z();
  // this.path(p).attr({
  //   'stroke': 'none',
  //   'fill': c,
  //   'opacity': .5
  // });
  
    
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

})();

