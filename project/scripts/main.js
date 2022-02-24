export const track = [];
export const camera = {x: 0, y: 50, z: 0, d: 1};

export function GenerateTrack(runtime, length) {
	for (let n = 0; n < length; n++) {
		track.push({
			p1: { 
				world:     { x: 0, y: 0, z: n * runtime.globalVars.SEGMENT_LENGTH }, 
				translate: { x: 0, y: 0, z: 0 }, 
				screen:    { x: 0, y: 0, w: 0 } 
			},
       		p2: { 
				world:     { x: 0, y: 0, z: (n+1) * runtime.globalVars.SEGMENT_LENGTH }, 
				translate: { x: 0, y: 0, z: 0 },
				screen:    { x: 0, y: 0, w: 0 } 
			},
       		color: Math.floor(n / runtime.globalVars.RUMBLE_LENGTH) % 2 ? 
			   runtime.globalVars.COLOR_DARK : runtime.globalVars.COLOR_LIGHT
		});
	}
}

export function RenderTrack(runtime) {
	runtime.callFunction("DrawingCanvas.Clear");
	
	const base_segment = Math.floor(camera.z / runtime.globalVars.SEGMENT_LENGTH);
	
	for (let n = 0; n < runtime.globalVars.DRAW_DISTANCE; n++) {
		const segment = track[(base_segment + n) % track.length];
		const has_looped = track.indexOf(segment) < base_segment ? true : false;

		ProjectPoint(segment.p1, runtime, has_looped);
		ProjectPoint(segment.p2, runtime, has_looped);

		RenderSegment(segment, runtime);
	}
}

export function ProjectPoint(p, runtime, has_looped) {
	const w = runtime.objects.DrawingCanvas.getFirstInstance().surfaceDeviceWidth;
	const h = runtime.objects.DrawingCanvas.getFirstInstance().surfaceDeviceHeight;
	const r_w = runtime.globalVars.ROAD_WIDTH;

	p.translate.x = p.world.x - camera.x;
	p.translate.y = p.world.y - camera.y;
	p.translate.z = p.world.z - camera.z;
	
	
	if (has_looped) {
		p.translate.z += track.length * runtime.globalVars.SEGMENT_LENGTH;
	}
	
	const scale = camera.d / p.translate.z;

	p.screen.x = Math.round(w / 2 + scale * p.translate.x * w / 2);
	p.screen.y = Math.round(h / 2 - scale * p.translate.y * h / 2);
	p.screen.w = Math.round(scale * r_w * w / 2);
}

export function RenderSegment(segment, runtime) {
	runtime.callFunction("DrawingCanvas.AddPoint", segment.p1.screen.x - segment.p1.screen.w / 2, segment.p1.screen.y);
	runtime.callFunction("DrawingCanvas.AddPoint", segment.p2.screen.x - segment.p2.screen.w / 2, segment.p2.screen.y);
	runtime.callFunction("DrawingCanvas.AddPoint", segment.p2.screen.x + segment.p2.screen.w / 2, segment.p2.screen.y);
	runtime.callFunction("DrawingCanvas.AddPoint", segment.p1.screen.x + segment.p1.screen.w / 2, segment.p1.screen.y);
	runtime.callFunction("DrawingCanvas.FillAndResetPoly", segment.color);
}