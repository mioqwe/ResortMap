const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["assets/arrowCornerSquare.png","assets/arrowCrossing.png","assets/arrowEnd.png","assets/arrowSplit.png","assets/arrowStraight.png","assets/cabana.png","assets/houseChimney.png","assets/parchmentBasic.png","assets/pool.png","assets/textureWater.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.DyW7V5mM.js",app:"_app/immutable/entry/app.oVOLl1lK.js",imports:["_app/immutable/entry/start.DyW7V5mM.js","_app/immutable/chunks/CnJbt4Yb.js","_app/immutable/chunks/CxS66hID.js","_app/immutable/chunks/DvxSn6gZ.js","_app/immutable/entry/app.oVOLl1lK.js","_app/immutable/chunks/CxS66hID.js","_app/immutable/chunks/DQcNJ_vx.js","_app/immutable/chunks/DvxSn6gZ.js","_app/immutable/chunks/eMwiPP65.js","_app/immutable/chunks/B_psyUf5.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-Kfik82L-.js')),
			__memo(() => import('./chunks/1-D9QvJgkf.js')),
			__memo(() => import('./chunks/2-B2TI7hWO.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/bookings",
				pattern: /^\/api\/bookings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CqBkcprW.js'))
			},
			{
				id: "/api/book",
				pattern: /^\/api\/book\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BpFvkIC7.js'))
			},
			{
				id: "/api/map",
				pattern: /^\/api\/map\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-D75QRaE9.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
