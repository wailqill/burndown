var data = {
  items: [
    { id: "1", title: "Test 1" },
    { id: "2", title: "Test 2" },
    { id: "3", title: "Test 3" },
    { id: "4", title: "Test 4" },
    { id: "5", title: "Test 5" },
    { id: "6", title: "Test 6" }
  ],
  nodes: [
    { date: '2011-09-09', data: [ { id: "1", v: 5 }, { id: "2", v: 2 }, { id: "3", v: 5 }, { id: "4", v: 5 }, { id: "5", v: 2 }, { id: "6", v: 3 } ] },
    { date: '2011-09-10', data: [ { id: "1", v: 4 }, { id: "2", v: 1 }, { id: "3", v: 5 }, { id: "4", v: 4 }, { id: "5", v: 4 }, { id: "6", v: 3 } ] },
    { date: '2011-09-11', data: [ { id: "1", v: 1 }, { id: "2", v: 0 }, { id: "3", v: 5 }, { id: "4", v: 4 }, { id: "5", v: 2 }, { id: "6", v: 3 }, { id: "7", v: 2 } ] },
    { date: '2011-09-12', data: [ { id: "1", v: 0 }, { id: "2", v: 0 }, { id: "3", v: 2 }, { id: "4", v: 1 }, { id: "5", v: 0 }, { id: "6", v: 2 }, { id: "7", v: 2 } ] },
    { date: '2011-09-13', data: [ { id: "1", v: 0 }, { id: "2", v: 0 }, { id: "3", v: 0 }, { id: "4", v: 1 }, { id: "5", v: 0 }, { id: "6", v: 0 }, { id: "7", v: 0 } ] }
  ]
}

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

window.addEventListener('load', function () {
  var r = Raphael("sprint");
  
  var dates = [];
  var remaining = [];
  var added = [];
  var countItemsStart = data.nodes[0].data.length;
  data.nodes.forEach(function(d, i) {
    dates.push(d.date);
    remaining.push(total(d.data.slice(0, countItemsStart), function(p, c) { return p + c.v; }));
    added.push(total(d.data.slice(countItemsStart), function(p, c) { return p + c.v; }));
  });
  
  // temp real data
  dates = "2011-09-13 2011-09-14 2011-09-15 2011-09-18 2011-09-19 2011-09-20 2011-09-21 2011-09-22".split(' ');
  remaining = [146, 144];
  added = [0, 5];
  
  r.g.burndown(0, 0, 500, 400, dates, remaining, added, {});

});
