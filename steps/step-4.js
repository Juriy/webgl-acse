// Canvas object
var canvas;

// The WebGL context
var gl;

// The only shader program that we'll use
var shaderProgram;

// Projection and modelview matrices
var modelViewMatrix = mat4.create();
var projectionMatrix = mat4.create();

// Location of parameters in shader program
var pMatrixUniform;
var mvMatrixUniform;
var vertexPositionAttribute;

// ADDED
var vertexColorAttribute;

var vertexShaderSource =
				"attribute vec3 aPos;" +
				"attribute vec4 aCol;" +

				"uniform mat4 uMVMatrix;" +
				"uniform mat4 uPMatrix;" +

				"varying vec4 vColor;" +

				"void main(void) {" +
					"gl_Position = uPMatrix * uMVMatrix * vec4(aPos, 1.0);" +
					"vColor = aCol;" +
				"}";

var fragmentShaderSource =
				"precision mediump float;" +
				"varying vec4 vColor;" +

				"void main(void) {" +
					"gl_FragColor = vColor;" +
				"}";

(function init() {
	canvas = document.getElementById("mainCanvas");

	gl = canvas.getContext("webgl") 
		|| canvas.getContext("experimental-webgl");

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	initShaders();
	initModel(cube);
	animate()
})();

function animate() {
	requestAnimationFrame(animate);
	cube.rx += 0.05;
	drawScene();
}

function initShaders() {
	var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
	var vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Error initializing shaders");
	}

	gl.useProgram(shaderProgram);

	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPos");
	gl.enableVertexAttribArray(vertexPositionAttribute);

	// ADDED COLOR ATTRIBUTE
	vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aCol");
	gl.enableVertexAttribArray(vertexColorAttribute);

	pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function createShader(shaderType, source) {
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function initModel(model) {
	model.vertexBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

	model.faceBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.faceBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(model.faces), gl.STATIC_DRAW);

	// Added colors
	model.colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.colors), gl.STATIC_DRAW);
}

function drawScene() {
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(45, canvas.width / canvas.height, 0.1, 100.0, projectionMatrix);
	mat4.identity(modelViewMatrix);
	drawModel(cube);
}

function drawModel(model) {
	mat4.translate(modelViewMatrix, [model.x, model.y, model.z]);

	if (model.rx)
		mat4.rotateX(modelViewMatrix, model.rx);

	if (model.ry)
		mat4.rotateY(modelViewMatrix, model.ry);

	if (model.rz)
		mat4.rotateZ(modelViewMatrix, model.rz);

	gl.uniformMatrix4fv(pMatrixUniform, false, projectionMatrix);
	gl.uniformMatrix4fv(mvMatrixUniform, false, modelViewMatrix);

	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	// Added color attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
	gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.faceBuffer);
	gl.drawElements(gl.TRIANGLES, model.faces.length, gl.UNSIGNED_SHORT, 0);
}


