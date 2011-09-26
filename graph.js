var data = [
  { label: '2011-09-13', remaining: 146 },
  { label: '2011-09-14', remaining: 125, added: 5 },
  { label: '2011-09-15', remaining: 110, added: 1 },
  { label: '2011-09-16', remaining: 101 },
  { label: '2011-09-19', remaining: 94, added: 3 },
  { label: '2011-09-20', remaining: 83, added: 3 },
  { label: '2011-09-21', remaining: 79 },
  { label: '2011-09-22', remaining: 66, added: 3 },
  { label: '2011-09-23', remaining: 24 }
];

var data = [
  { label: 'Initial', remaining: 96 },
  { label: '2011-09-26' },
  { label: '2011-09-27' },
  { label: '2011-09-28' },
  { label: '2011-09-29' },
  { label: '2011-09-30' }
];



window.addEventListener('load', function () {
  var r = Raphael("sprint");
  r.g.burndown(0, 0, 700, 500, data, {});
});
