/* Fondo de componentes de PC: parallax suave con scroll y ratón */
(function () {
  var layer = document.querySelector(".hw-layer");
  if (!layer) return;
  var items = [].slice.call(layer.querySelectorAll(".hw"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mx = 0, my = 0, queued = false;

  function fitLayer() {
    layer.style.height = "0px";
    layer.style.height = Math.max(document.documentElement.scrollHeight, window.innerHeight) + "px";
  }

  function update() {
    queued = false;
    var sy = window.scrollY, vh = window.innerHeight;
    items.forEach(function (el) {
      var speed = parseFloat(el.dataset.speed) || 0;
      var rot = parseFloat(el.dataset.rot) || 0;
      var spin = parseFloat(el.dataset.spin) || 0;
      if (reduce) { el.style.transform = "rotate(" + rot + "deg)"; return; }
      var center = el.offsetTop + el.offsetHeight / 2;
      var ty = (sy + vh / 2 - center) * speed + my * speed * 160;
      var tx = mx * speed * 160;
      el.style.transform = "translate3d(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px,0) rotate(" + (rot + sy * spin).toFixed(2) + "deg)";
    });
  }

  function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", function () { fitLayer(); queue(); });
  window.addEventListener("load", function () { fitLayer(); queue(); });
  if (!reduce) {
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      queue();
    });
  }
  fitLayer();
  queue();
})();