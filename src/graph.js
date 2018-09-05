let container = document.querySelector('#graph');
let data = {nodes, edges};
let options = {
  nodes: {
    shape: 'dot',
    size: 16,
  },
  physics: {
    forceAtlas2Based: {
      gravitationalConstant: -26,
      centralGravity: 0.005,
      springLength: 230,
      springConstant: 0.18,
    },
    maxVelocity: 146,
    solver: 'forceAtlas2Based',
    timestep: 0.35,
    stabilization: {iterations: 150},
  }
};

let graph = new vis.Network(container, data, options);

graph.on("click", function (params) {
  let slug = this.getNodeAt(params.pointer.DOM);
  if (slug) {
    window.location.hash = slug;
  } else {
    window.location.hash = '';
  }
});

graph.on("doubleClick", function (params) {
  let slug = this.getNodeAt(params.pointer.DOM);
  if (slug) {
    window.location.href = `./${slug}.html`;
  }
});

if (location.hash) {
  graph.selectNodes([location.hash.replace(/^#/, '')]);
}
