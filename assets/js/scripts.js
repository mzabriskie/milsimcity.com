// Analytics
(function () {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-59138567-1', 'auto');
  ga('send', 'pageview');
})();

// Navigation
(function () {
  var nav = document.getElementById('navigation');
  nav.onclick = function (e) {
    if (e.target.nodeName === 'A') {
      var id = e.target.getAttribute('data-target');
      var target = document.getElementById(id);
      if (target) {
        morph(document.body, 250, {
          scrollTop: target.offsetTop
        }, function () {
          location.hash = '#' + id;
        });
      }
    }
  };
})();

// Shop
(function () {
  var items = [
    { name: 'Gift Cards', desc: '$10, $20, $50', image: 'assets/img/shop/gift-cards.png' },
    { name: 'Ammo', desc: '10k, 20k, and 50k', image: 'assets/img/shop/ammo.png' },
    { name: 'Caps', desc: '3 Colors', image: 'assets/img/shop/caps.png' },
    { name: 'Masks', desc: 'Simple and Custom', image: 'assets/img/shop/masks.png' },
    { name: 'Armor and apparel', desc: 'Full body, & t-shirts',  image: 'assets/img/shop/armor.png' },
    { name: 'Guns', desc: 'Pistols and rifles', image: 'assets/img/shop/guns.png' }
  ];

  var container = document.getElementById('shop-content');
  for (var i=0, l=items.length; i<l; i++) {
    var li = document.createElement('li');
    var img = document.createElement('img');
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var strong = document.createElement('strong');
    var span = document.createElement('span');
    var a = document.createElement('a');

    container.appendChild(li);
    li.appendChild(img);
    li.appendChild(div1);
    li.appendChild(document.createElement('br'));
    li.appendChild(div2);
    div1.appendChild(strong);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(span);
    div2.appendChild(a);

    img.src = items[i].image;
    a.href = 'https://squareup.com/market/milsimcity';
    a.target = '_blank';

    strong.appendChild(document.createTextNode(items[i].name));
    span.appendChild(document.createTextNode(items[i].desc));
    a.appendChild(document.createTextNode('View now'));
  }
})();

// Calendar
(function () {
  // var GOOGLE_APIS_CALENDAR_URL = 'https://www.googleapis.com/calendar/v3/calendars/milsimcity.com_sfs1p883sebddvfq5vl90gdigs%40group.calendar.google.com/events?fields=description%2Citems(description%2Csummary%2Cstart%2Cend)%2Csummary&key=';
  // axios.get(GOOGLE_APIS_CALENDAR_URL)
    // .then(function (res) {
      // console.log(res);
    // })
    // .catch(function (err) {
      // console.log(err);
    // });

  var events = [
    { date: '01/31/2015', name: 'Preferred Customer Night', desc: 'Bring two players that have not played at MilSim City yet and you all play for $20/ea' },
    { date: '02/14/2015', name: 'Ladies Night', desc: 'Free admission for all ladies' },
  ];
  
  var container = document.getElementById('calendar-content');
  for (var i=0, l=events.length; i<l; i++) {
    var dt = document.createElement('dt');
    var dd = document.createElement('dd');
    var strong = document.createElement('strong');
    
    dt.appendChild(document.createTextNode(events[i].date));
    dd.appendChild(strong);
    dd.appendChild(document.createTextNode(' ' + events[i].desc));
    strong.appendChild(document.createTextNode(events[i].name));

    container.appendChild(dt);
    container.appendChild(dd);
    container.appendChild(document.createElement('br'));
  }
})();

// Simiple animations
var morph = (function (window) {
  var FRAMES_PER_SECOND = 60;
  var MILLIS_PER_SECOND = 1000;
  var MILLIS_PER_FRAME = MILLIS_PER_SECOND / FRAMES_PER_SECOND;

  var props = ['scrollLeft', 'scrollRight', 'scrollTop', 'scrollBottom'];

  function indexOf(arr, val) {
    var index = -1;
    if (typeof arr.indexOf === 'function') {
      index = arr.indexOf(val);
    } else {
      for (var i=0, l=arr.length; i<l; i++) {
        if (arr[i] === val) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  function getProp(el, key) {
    return indexOf(props, key) >= 0 ? el[key] : parseInt(el.style[key], 10) || 0;
  }

  function setProp(el, key, val) {
    return indexOf(props, key) >= 0 ? el[key] = val : (el.style[key] = val + 'px');
  }

  function done(idx, arr, callback) {
    arr[idx] = true;

    var finish = true;
    var i = arr.length;

    while(i--) {
      if (arr[i] === false) {
        finish = false;
        break;
      }
    }

    if (finish && typeof callback === 'function') {
      callback();
    }
  }

  function schedule(el, duration, key, val, idx, arr, callback) {
    var last = [];
    var diff = val - getProp(el, key);
    var step = (diff / ((duration / MILLIS_PER_SECOND) * FRAMES_PER_SECOND));

    (function animate() {
      var temp = getProp(el, key) + step;

      if (last.length === 0 || temp !== last[0]) {
        last = [temp];
      } else if (last.length < 2) {
        last.push(temp);
      } else {
        done(idx, arr, callback);
        return;
      }

      setProp(el, key, (step < 0 ? Math.max(temp, val) : Math.min(temp, val)));
      if (getProp(el, key) === val) {
        done(idx, arr, callback);
       } else {
         window.requestAnimationFrame(animate);
       }
    })();
  }

  function morph(el, duration, styles, callback) {
    var counter = 0, tracker = [];
    for (var key in styles) {
      if (!styles.hasOwnProperty(key)) { continue; }
      if (getProp(el, key) === styles[key]) { continue; }

      var val = styles[key];
      if (styles[key] instanceof Array) {
          setProp(el, key, styles[key][0]);
          val = styles[key][1];
      }

      tracker.push(false);
      schedule(el, duration, key, val, counter++, tracker, callback);
    }
  }

  // requestAnimationFrame polyfill
  // https://gist.github.com/paulirish/1579671
  (function() {
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x=0; x<vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback) {
        return setTimeout(callback, MILLIS_PER_FRAME);
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  })();

  return morph;
})(window);

