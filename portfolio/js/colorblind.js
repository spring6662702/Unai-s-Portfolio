(function () {
  var MODES = [
    { id: "normal",        name: "Normal",        desc: "Default colors",       color: "#8e7fd6" },
    { id: "protanopia",    name: "Protanopia",    desc: "Red-weak",             color: "#ffd23f" },
    { id: "deuteranopia",  name: "Deuteranopia",  desc: "Green-weak",           color: "#ff9f1c" },
    { id: "tritanopia",    name: "Tritanopia",    desc: "Blue-weak",            color: "#ff6b6b" },
    { id: "achromatopsia", name: "Achromatopsia", desc: "No color / high contrast", color: "#ffffff" }
  ];
  var KEY = "cb-mode";
  var root = document.documentElement;

  function apply(id) {
    if (id === "normal") root.removeAttribute("data-cb");
    else root.setAttribute("data-cb", id);
    try { localStorage.setItem(KEY, id); } catch (e) {}
    options.forEach(function (o) {
      o.el.setAttribute("aria-pressed", o.id === id ? "true" : "false");
    });
  }

  var wrap = document.createElement("div");
  wrap.className = "cb-wrap";

  var toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "cb-toggle";
  toggle.textContent = "◐ COLORBLIND MODE";
  toggle.setAttribute("aria-haspopup", "true");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Colorblind mode");

  var panel = document.createElement("div");
  panel.className = "cb-panel";
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", "Colorblind mode options");

  var options = MODES.map(function (m) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "cb-option";
    b.setAttribute("aria-pressed", "false");
    b.innerHTML =
      '<span class="cb-swatch" style="background:' + m.color + '"></span>' +
      '<span><span class="cb-name">' + m.name + '</span><span class="cb-desc">' + m.desc + "</span></span>";
    b.addEventListener("click", function () { apply(m.id); });
    panel.appendChild(b);
    return { id: m.id, el: b };
  });

  function setOpen(open) {
    panel.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  toggle.addEventListener("click", function () { setOpen(!panel.classList.contains("open")); });
  document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });

  // el cursor personalizado también reacciona sobre estos botones
  [toggle].concat(options.map(function (o) { return o.el; })).forEach(function (el) {
    el.addEventListener("mouseenter", function () { document.body.classList.add("hovering"); });
    el.addEventListener("mouseleave", function () { document.body.classList.remove("hovering"); });
  });

  wrap.appendChild(panel);
  wrap.appendChild(toggle);
  document.body.appendChild(wrap);

  var saved = "normal";
  try { saved = localStorage.getItem(KEY) || "normal"; } catch (e) {}
  if (!MODES.some(function (m) { return m.id === saved; })) saved = "normal";
  apply(saved);
})();