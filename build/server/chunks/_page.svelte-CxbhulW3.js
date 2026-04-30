import { c as ensure_array_like, a6 as derived, ab as attr_class, d as attr } from './renderer-BPGUkFst.js';

function MapTile($$renderer, $$props) {
  let { tileType, isBooked = false } = $$props;
  const assetMap = {
    "W": "/assets/cabana.png",
    "p": "/assets/pool.png",
    "#": "/assets/parchmentBasic.png",
    "c": "/assets/houseChimney.png",
    ".": "/assets/parchmentBasic.png"
  };
  const src = derived(() => assetMap[tileType]);
  $$renderer.push(`<div${attr_class("tile svelte-1yg5952", void 0, { "booked": isBooked && tileType === "W" })}>`);
  if (isBooked && tileType === "W") {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="booked-overlay svelte-1yg5952">✕</div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--> `);
  if (tileType != ".") {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<img${attr("src", src())}${attr("alt", tileType)} class="svelte-1yg5952"/>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
function CabanaPopup($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const rows = derived(() => () => {
      const maxRow = Math.max(...data.tiles.map((t) => t.row));
      const maxCol = Math.max(...data.tiles.map((t) => t.col));
      const grid = [];
      for (let r = 0; r <= maxRow; r++) {
        const row = [];
        for (let c = 0; c <= maxCol; c++) {
          const tile = data.tiles.find((t) => t.row === r && t.col === c);
          row.push(tile || { row: r, col: c, type: ".", cabanaId: null, isBooked: false });
        }
        grid.push(row);
      }
      return grid;
    });
    $$renderer2.push(`<div class="map-container svelte-1uha8ag">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="map svelte-1uha8ag"><!--[-->`);
    const each_array = ensure_array_like(rows()());
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let row = each_array[$$index_1];
      $$renderer2.push(`<div class="row svelte-1uha8ag"><!--[-->`);
      const each_array_1 = ensure_array_like(row);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let tile = each_array_1[$$index];
        if (tile.type === "W" && tile.cabanaId) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<button class="tile-button svelte-1uha8ag">`);
          MapTile($$renderer2, { tileType: tile.type, isBooked: tile.isBooked });
          $$renderer2.push(`<!----></button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          MapTile($$renderer2, { tileType: tile.type, isBooked: false });
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    CabanaPopup($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CxbhulW3.js.map
