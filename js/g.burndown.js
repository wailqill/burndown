(function(undefined) {
  
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


  var calculatePointDelta = function(total) {
    var markings = total, delta = 0;
    while (markings > 16) {
      markings = Math.round(markings / 4) * 2;
      delta = Math.ceil(total / markings);
    }
    return delta;
  }

  var Path = function() {
    this.path = "";
  }
  Path.prototype.toString = function() { return this.path.substr(1); }
  Path.prototype.move = function(x, y) { this.path += " M " + r(x) + " " + r(y); return this; }
  Path.prototype.line = function(x, y) { this.path += " L " + r(x) + " " + r(y); return this; }
  Path.prototype.close = function() { this.path += " Z"; return this; }

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
    , axis = {}
    , colors = {
        shadowOpacity: .3,
        axis: 'hsl(0, 0, 40%)',
        remaining: 'blue',
        added: 'red',
        optimal: 'green',
        actual: 'purple',
        columnHelper: 'rgba(0, 0, 0, .1)'
      }
    ;
  
  var accAdded = 0;
  data = data.map(function(d, i) {
    accAdded += d.added || 0;
    var o = {
      label: d.label,
      accAdded: accAdded,
      coords: {
        left: gutter.left + columnWidth * i,
        center: gutter.left + columnWidth * (i + .5)
      }
    }
    if (d.remaining !== undefined) {
      o.remaining = d.remaining;
      o.baseRemaining = d.remaining - accAdded;
    }
    if (d.added !== undefined) {
      o.added = d.added;
    }
    
    return o;
  });

  points.totalAdded             = data.reduce(function(t, c) { return t + (c.added || 0); }, 0);
  points.originalRemaining      = data[0] ? data[0].remaining || 0 : 0;
  points.uppermostBaseRemaining = data.reduce(function(t, c) { return Math.max(t, c.baseRemaining || 0); }, 0);
  points.total                  = points.totalAdded + points.uppermostBaseRemaining;

  axis.deltaPoints              = calculatePointDelta(points.total);
  axis.upPoints                 = Math.ceil(points.uppermostBaseRemaining / axis.deltaPoints) * axis.deltaPoints;
  axis.downPoints               = Math.ceil(points.totalAdded / axis.deltaPoints) * axis.deltaPoints;
  axis.totalPoints              = axis.upPoints + axis.downPoints;
  axis.deltaY                   = availHeight / (axis.upPoints + axis.downPoints);

  // If no data. exit.
  if (points.total === 0)
    return;

  var columnWidth = availWidth / data.length;
  var base        = gutter.top + (availHeight * (axis.upPoints / axis.totalPoints));
  var baseAdded   = base + accAdded * axis.deltaY;
  
  var sets = {
    axis: this.set(),
  };
  
  // Draw point axis line
  sets.axis.push(this.path(new Path()
    .move(corners.left, corners.top)
    .line(corners.left, corners.bottom)
  ).attr('stroke', colors.axis));
  
  // Draw point axis markings
  var point = -axis.downPoints;
  while (point <= axis.upPoints) {
    // Calc y pos
    var y = base - point*axis.deltaY;
    
    // Draw line
    sets.axis.push(this.path(new Path()
      .move(corners.left - 2, y)
      .line(corners.left + 2, y)
    ).attr('stroke', colors.axis));
    
    // Draw text
    sets.axis.push(this.text(gutter.left / 2, y, Math.abs(point)));
    
    point += axis.deltaPoints;
  }
    
  // Draw base line
  sets.axis.push(this.path(new Path()
    .move(corners.left, base)
    .line(corners.right, base)
  ).attr({
    'stroke': colors.axis,
    'opacity': .5 
  }));

  // Draw accAdded base line
  sets.axis.push(this.path(new Path()
    .move(corners.left, baseAdded)
    .line(corners.right, baseAdded)
  ).attr('stroke', colors.axis));
  
  var above = { path: new Path() },
      below = { path: new Path() };
  
  for (var i=0,d; d=data[i]; i++) {
    var x = gutter.left + (i + .5) * columnWidth;
    
    // Draw column helper lines
    this.path(new Path()
      .move(x + .5 * columnWidth, corners.top)
      .line(x + .5 * columnWidth, corners.bottom)
    ).attr({
      'stroke': colors.columnHelper
    });
    
    // Draw dates as labels
    this.text(x, corners.bottom + gutter.bottom/2, d.label).rotate(300);

    if (d.baseRemaining !== undefined) {

      above.x = below.x = x;
      
      // Above
      above.y = base - d.baseRemaining * axis.deltaY;
      var f = i > 0 ? above.path.line : above.path.move;
      f.call(above.path, above.x, above.y);
    
      // Dots
      this.circle(above.x, above.y, 4).attr({
        'fill': colors.remaining,
        'stroke': 'none'
      });
  
      // Below
      below.y = base + d.accAdded * axis.deltaY;
      var f = i > 0 ? below.path.line : below.path.move;
      f.call(below.path, below.x, below.y);
      
      // Dots
      this.circle(below.x, below.y, 4).attr({
        'fill': colors.added,
        'stroke': 'none'
      });
    }
  }
  
  // Draw optimal burn down line
  this.path(new Path()
    .move(corners.left + .5 * columnWidth, base - data[0].baseRemaining * axis.deltaY)
    .line(corners.right - .5 * columnWidth, base + accAdded * axis.deltaY)
  ).attr({
    'stroke': colors.optimal
  }).toBack();

  this.path(above.path).attr({
    'stroke': colors.remaining,
    'stroke-width': '2px'
  });
  above.path.line(above.x, base).line(corners.left + .5 * columnWidth, base).close();
  this.path(above.path).attr({
    'fill': colors.remaining,
    'stroke': 'none',
    'opacity': colors.shadowOpacity
  }).toBack();
  
  this.path(below.path).attr({
    'stroke': colors.added,
    'stroke-width': '2px'
  });
  below.path.line(below.x, base).line(corners.left + .5 * columnWidth, base).close();
  this.path(below.path).attr({
    'fill': colors.added,
    'stroke': 'none',
    'opacity': colors.shadowOpacity
  }).toBack();
  

  
  
  
    
return this.set(sets.axis);

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