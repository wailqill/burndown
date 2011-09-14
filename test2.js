var data = [
  { label: '2011-09-12', remaining: 7, added: 0 },
  { label: '2011-09-13', remaining: 7, added: 1 },
  { label: '2011-09-14', remaining: 5, added: 1 },
  { label: '2011-09-15', remaining: 2, added: 0 },
  { label: '2011-09-16', remaining: 0, added: 0 }
]

window.addEventListener('load', function () {
  var r = Raphael("sprint");
  r.g.burndown(0, 0, 500, 400, data, {});
});
