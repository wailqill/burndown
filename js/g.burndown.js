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
      , columnWidth = availWidth / data.length
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
          center: gutter.left + columnWidth * (i + .5),
          right: gutter.left + columnWidth * (i + 1)
        }
      }
      if (d.remaining !== undefined) {
        o.remaining = d.remaining;
        o.baseRemaining = d.remaining - accAdded;
      }
      if (d.added !== undefined) {
        o.added = d.added;
      }
    
      o.hasData = o.remaining !== undefined;
    
      return o;
    });

    points.totalAdded             = data.reduce(function(t, c) { return t + (c.added || 0); }, 0);
    points.originalRemaining      = data[0] ? data[0].remaining || 0 : 0;
    points.uppermostBaseRemaining = data.reduce(function(t, c) { return Math.max(t, c.baseRemaining || 0); }, 0);
    points.total                  = points.totalAdded + points.uppermostBaseRemaining;

    // If no data. exit.
    if (!data.some(function(d) { return d.hasData; }))
      return;

    axis.deltaPoints              = calculatePointDelta(points.total);
    axis.upPoints                 = Math.ceil(points.uppermostBaseRemaining / axis.deltaPoints) * axis.deltaPoints;
    axis.downPoints               = Math.ceil(points.totalAdded / axis.deltaPoints) * axis.deltaPoints;
    axis.totalPoints              = axis.upPoints + axis.downPoints;
    axis.deltaY                   = availHeight / (axis.upPoints + axis.downPoints);

    var baseOriginal  = gutter.top + (availHeight * (axis.upPoints / axis.totalPoints));
    var baseAdded     = baseOriginal + accAdded * axis.deltaY;
  
    data = data.map(function(d, i) {
      d.coords.top = baseOriginal - d.baseRemaining*axis.deltaY;
      d.coords.bottom = baseOriginal + d.accAdded*axis.deltaY;
    
      return d;
    });
  
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
      var y = baseOriginal - point*axis.deltaY;
    
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
      .move(corners.left, baseOriginal)
      .line(corners.right, baseOriginal)
    ).attr({
      'stroke': colors.axis,
      'opacity': .5
    }));

    // Draw accAdded base line
    sets.axis.push(this.path(new Path()
      .move(corners.left, baseAdded)
      .line(corners.right, baseAdded)
    ).attr('stroke', colors.axis));
  
  
    var paths = {
      top: new Path(),
      bottom: new Path(),
      topShadow: new Path(),
      bottomShadow: new Path()
    };
    for (var i=0; d=data[i]; i++) {
    
      // Draw column helper lines
      this.path(new Path()
        .move(d.coords.right, corners.top)
        .line(d.coords.right, corners.bottom)
      ).attr({
        'stroke': colors.columnHelper
      });
    
      // Draw dates as labels
      this.text(d.coords.center, corners.bottom + gutter.bottom/2, d.label).rotate(300);
    
      if (!d.hasData) continue;
    
      // Dot remaining
      this.circle(d.coords.center, d.coords.top, 4).attr({
        'fill': colors.remaining,
        'stroke': 'none'
      });
    
      // Dot added
      this.circle(d.coords.center, d.coords.bottom, 4).attr({
        'fill': colors.added,
        'stroke': 'none'
      });
    
      // Find path function to use
      var f = i === 0 ? Path.prototype.move : Path.prototype.line;
    
      // Set line paths
      f.call(paths.top, d.coords.center, d.coords.top);
      f.call(paths.bottom, d.coords.center, d.coords.bottom);
    
      // Special treatment for shadows
      if (i === 0) {
        paths.topShadow.move(d.coords.center, baseOriginal);
        paths.bottomShadow.move(d.coords.center, baseOriginal);
      }
      paths.topShadow.line(d.coords.center, d.coords.top);
      paths.bottomShadow.line(d.coords.center, d.coords.bottom);
    }
    
    var lastWithData = data.filter(function(d){ return d.hasData; }).pop();
    paths.topShadow.line(lastWithData.coords.center, baseOriginal).close();
    paths.bottomShadow.line(lastWithData.coords.center, baseOriginal).close();

    this.path(paths.topShadow).attr({
      'fill': colors.remaining,
      'stroke': 'none',
      'opacity': colors.shadowOpacity
    });
    this.path(paths.bottomShadow).attr({
      'fill': colors.added,
      'stroke': 'none',
      'opacity': colors.shadowOpacity
    });
    this.path(paths.top).attr({
      'stroke': colors.remaining,
      'stroke-width': '2px'
    });
    this.path(paths.bottom).attr({
      'stroke': colors.added,
      'stroke-width': '2px'
    });

    
    // Draw optimal burn down line
    this.path(new Path()
      .move(data[0].coords.center, data[0].coords.top)
      .line(corners.right - .5 * columnWidth, baseOriginal + accAdded * axis.deltaY)
    ).attr({
      'stroke': colors.optimal
    }).toBack();

  };
  
})();