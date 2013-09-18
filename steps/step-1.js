var canvas;

var gl; // WebGL Context

(function init() {
	canvas = document.getElementById("mainCanvas");

	gl = canvas.getContext("webgl") 
		|| canvas.getContext("experimental-webgl");

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	drawScene();
})();

/**
 * Renders the scene
 */
function drawScene() {
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// We will add rendering code here.
}