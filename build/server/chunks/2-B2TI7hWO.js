import { readFileSync } from 'fs';
import { e as error } from './index-D1hZvBrU.js';
import { i as isCabanaBooked } from './state-K1-PcqLz.js';

const load = async ({ locals }) => {
  const { mapPath } = locals;
  let mapContent;
  try {
    mapContent = readFileSync(mapPath, "utf-8");
  } catch (e) {
    throw error(500, `Failed to read map file: ${mapPath}`);
  }
  const lines = mapContent.trim().split("\n");
  const tiles = [];
  const cabanaPositions = [];
  let cabanaCount = 0;
  let bookedCount = 0;
  for (let row = 0; row < lines.length; row++) {
    const line = lines[row];
    for (let col = 0; col < line.length; col++) {
      const char = line[col];
      let cabanaId = null;
      let isBooked = false;
      if (char === "W") {
        cabanaId = `${row}_${col}`;
        cabanaCount++;
        isBooked = isCabanaBooked(cabanaId);
        if (isBooked) bookedCount++;
        cabanaPositions.push({ row, col, cabanaId });
      }
      tiles.push({ row, col, type: char, cabanaId, isBooked });
    }
  }
  return {
    tiles,
    cabanaPositions,
    cabanaCount,
    bookedCount
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CxbhulW3.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/2.Cpbm62Ya.js","_app/immutable/chunks/DQcNJ_vx.js","_app/immutable/chunks/CxS66hID.js","_app/immutable/chunks/eMwiPP65.js","_app/immutable/chunks/KY83uNOt.js","_app/immutable/chunks/B_psyUf5.js"];
const stylesheets = ["_app/immutable/assets/2.B8mkuKs7.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-B2TI7hWO.js.map
