import { c as ensure_array_like, d as attr, f as escape_html } from './renderer-BPGUkFst.js';

function Legend($$renderer) {
  const items = [
    { symbol: "W", label: "Cabana" },
    { symbol: "p", label: "Pool" },
    { symbol: "#", label: "Path" },
    { symbol: "c", label: "Chalet" },
    { symbol: ".", label: "Empty space" }
  ];
  const assetMap = {
    "W": "/assets/cabana.png",
    "p": "/assets/pool.png",
    "#": "/assets/parchmentBasic.png",
    "c": "/assets/houseChimney.png",
    ".": "/assets/parchmentBasic.png"
  };
  $$renderer.push(`<div class="legend svelte-1wfxrff"><h3 class="svelte-1wfxrff">Map Legend</h3> <div class="legend-items svelte-1wfxrff"><!--[-->`);
  const each_array = ensure_array_like(items);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    if (item.symbol != ".") {
      $$renderer.push("<!--[0-->");
      $$renderer.push(`<div class="legend-item svelte-1wfxrff"><img${attr("src", assetMap[item.symbol])}${attr("alt", item.label)} class="svelte-1wfxrff"/> <span class="svelte-1wfxrff"><strong>${escape_html(item.symbol)}</strong> = ${escape_html(item.label)}</span></div>`);
    } else if (item.symbol === ".") {
      $$renderer.push("<!--[1-->");
      $$renderer.push(`<div class="legend-item svelte-1wfxrff"><span class="svelte-1wfxrff"><strong>${escape_html(item.symbol)}</strong> = ${escape_html(item.label)}</span></div>`);
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(`<!--]-->`);
  }
  $$renderer.push(`<!--]--></div></div>`);
}
function _layout($$renderer, $$props) {
  let { children } = $$props;
  $$renderer.push(`<div class="app svelte-12qhfyh"><header class="svelte-12qhfyh"><h1 class="svelte-12qhfyh">Resort Map</h1></header> <main class="svelte-12qhfyh">`);
  children($$renderer);
  $$renderer.push(`<!----></main> <footer class="svelte-12qhfyh">`);
  Legend($$renderer);
  $$renderer.push(`<!----></footer></div>`);
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-Bh99wU07.js.map
