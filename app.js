var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

var imageDX = 0;
var imageDY = 0;
var imageWidth, imageHeight;
var draggingImage = false;
var startX;
var startY;

function el(id) {
  return document.getElementById(id);
}

var img = new Image();

function readImage() {
  if (this.files && this.files[0]) {
    var FR = new FileReader();
    FR.onload = function (e) {
      img = new Image();
      img.onload = function () {
        imageWidth = img.width;
        imageHeight = img.height;
        draw();
      };
      img.src = e.target.result;
    };
    FR.readAsDataURL(this.files[0]);
  }
}

function readMutipleImage() {
  if (!this.files) {
    return;
  }
  const reader = [];
  for (let i = 0; i < this.files.length; i++) {
    reader.push(new FileReader());
    reader[i].onload = function (e) {
      var imgs = new Image();
      imgs.onload = function () {
        draws(imgs);
      };
      imgs.src = e.target.result;
    };
    reader[i].readAsDataURL(this.files[i]);
  }
}

el("fileUpload").addEventListener("change", readMutipleImage, false);

function draw() {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw the image
  ctx.drawImage(img, imageDX, imageDY, img.width, img.height);
}

function draws(imgs) {
  // // clear the canvas
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw the image
  ctx.drawImage(imgs, 0, 0, imgs.width, imgs.height);
}
function handleMouseUp(e) {
  draggingImage = false;
  draw(true, false);
}

function hitImage(x, y) {
  return (
    x > imageDX &&
    x < imageDX + imageWidth &&
    y > imageDY &&
    y < imageDY + imageHeight
  );
}

function handleMouseDown(e) {
  startX = parseInt(e.clientX - offsetX);
  startY = parseInt(e.clientY - offsetY);
  draggingImage = hitImage(startX, startY);
}
function handleMouseOut(e) {
  handleMouseUp(e);
}

function handleMouseMove(e) {
  if (draggingImage) {
    imageClick = false;
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // move the image by the amount of the latest drag
    var dx = mouseX - startX;
    var dy = mouseY - startY;
    imageDX += dx;
    imageDY += dy;
    // reset the startXY for next time
    startX = mouseX;
    startY = mouseY;
    // redraw the image with border
    draw();
  }
}

$("#canvas").mousedown(function (e) {
  handleMouseDown(e);
});
$("#canvas").mousemove(function (e) {
  handleMouseMove(e);
});
$("#canvas").mouseup(function (e) {
  handleMouseUp(e);
});
$("#canvas").mouseout(function (e) {
  handleMouseOut(e);
});

class ModelImage {
  constructor(image, dx, dy, imageWidth, imageHeight, ctx, canvas) {
    this.image = image;
    this.dx = dx;
    this.dy = dy;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.draggingImage = false;
    this.ctx = ctx;
    this.canvas = canvas;
    this.startX = 0;
    this.startY = 0;
    draw(ctx);
  }
  static draw(ctx) {
    // clear the canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw the image
    ctx.drawImage(
      this.image,
      this.dx,
      this.dy,
      this.image.width,
      this.image.height
    );
  }
  static HitImage(x, y) {
    return (
      x > this.dx &&
      x < this.dx + this.imageWidth &&
      y > this.dy &&
      y < this.dy + this.imageHeight
    );
  }
  static handleMouseUp(e) {
    this.draggingImage = false;
    draw(ctx);
  }
  static MoveImage(e, offsetX, offsetY) {
    if (draggingImage) {
      imageClick = false;
      mouseX = parseInt(e.clientX - offsetX);
      mouseY = parseInt(e.clientY - offsetY);

      // move the image by the amount of the latest drag
      var dx = mouseX - startX;
      var dy = mouseY - startY;
      this.dx += dx;
      this.dy += dy;
      // reset the startXY for next time
      startX = mouseX;
      startY = mouseY;
      // redraw the image with border
      draw(ctx);
    }
  }
  static handleMouseDown(e, offsetX, offsetY) {
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    draggingImage = hitImage(startX, startY);
  }
  static handleMouseOut(e) {
    handleMouseUp(e);
  }
}
