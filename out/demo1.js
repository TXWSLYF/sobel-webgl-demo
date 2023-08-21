"use strict";
const imageInput = document.getElementById("file-input");
const canvas = document.getElementById("canvas1");
const gl = canvas.getContext("webgl");
// 创建一个用于绘制图像的WebGL着色器程序
const vertexShaderSource = `
            attribute vec2 a_position;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
                v_texCoord = a_position * 0.5 + 0.5;
            }
        `;
const fragmentShaderSource = `
            precision mediump float;
            uniform sampler2D u_image;
            varying vec2 v_texCoord;
            void main() {
                gl_FragColor = texture2D(u_image, v_texCoord);
            }
        `;
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
// 获取顶点位置的attribute变量
const positionLocation = gl.getAttribLocation(program, "a_position");
const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
// 创建一个纹理
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
// 将纹理绑定到framebuffer
// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, 0);
// 设置纹理参数，这里假设图像是非重复的
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
// 创建一个带有两个三角形的矩形，用于绘制纹理
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
// 获取纹理的uniform变量
const imageLocation = gl.getUniformLocation(program, "u_image");
imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    console.log(file);
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        // 将图像绑定到纹理
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        // 绘制图像
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
});
