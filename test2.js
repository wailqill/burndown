var data = [
  { label: '2011-09-13', remaining: 146, added: 0 },
  { label: '2011-09-14', remaining: 125, added: 5 },
  { label: '2011-09-15', remaining: 110, added: 1 },
  { label: '2011-09-16' },
  { label: '2011-09-19' },
  { label: '2011-09-20' },
  { label: '2011-09-21' },
  { label: '2011-09-22' },
  { label: '2011-09-23' }
]

window.addEventListener('load', function () {
  var r = Raphael("sprint");
  r.g.burndown(0, 0, 500, 400, data, {});
});
