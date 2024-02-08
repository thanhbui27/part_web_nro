var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

var listImage = [];
let indexDrag;
function el(id) {
  return document.getElementById(id);
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
        var m = new ModelImage(i, imgs, 0, 0, imgs.width, imgs.height);
        m.draw(ctx);
        listImage.push(m);
      };

      imgs.src = e.target.result;
    };
    reader[i].readAsDataURL(this.files[i]);
  }
}

el("fileUpload").addEventListener("change", readMutipleImage, false);

function draws(imgs) {
  // // clear the canvas
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw the image
  ctx.drawImage(imgs, 0, 0, imgs.width, imgs.height);
}

$("#canvas").mousedown(function (e) {
  indexDrag = null; // Reset indexDrag
  for (let i = listImage.length - 1; i >= 0; i--) {
    var images = listImage[i];
    if (images.HitImage(e.clientX - offsetX, e.clientY - offsetY)) {
      images.handleMouseDown(e, offsetX, offsetY);
      indexDrag = i; // Set indexDrag to the selected image
      break; // Exit the loop after finding the selected image
    }
  }
});
$("#canvas").mousemove(function (e) {
  if (listImage[indexDrag] != undefined) {
    listImage[indexDrag].MoveImage(e, offsetX, offsetY, ctx);
  }
});
$("#canvas").mouseup(function (e) {
  if (listImage[indexDrag] != undefined) {
    listImage[indexDrag].handleMouseUp();
    indexDrag = null;
  }
});

class ModelImage {
  constructor(id, image, dx, dy, imageWidth, imageHeight) {
    this.id = id;
    this.image = image;
    this.dx = dx;
    this.dy = dy;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.draggingImage = false;
    this.startX = 0;
    this.startY = 0;
  }
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.dx,
      this.dy,
      this.imageWidth,
      this.imageHeight
    );
  }
  HitImage(x, y) {
    return (
      x > this.dx &&
      x < this.dx + this.imageWidth &&
      y > this.dy &&
      y < this.dy + this.imageHeight
    );
  }
  handleMouseUp() {
    this.draggingImage = false;
  }
  MoveImage(e, offsetX, offsetY, ctx) {
    if (this.draggingImage) {
      var mouseX = parseInt(e.clientX - offsetX);
      var mouseY = parseInt(e.clientY - offsetY);

      // move the image by the amount of the latest drag
      var dx = mouseX - this.startX;
      var dy = mouseY - this.startY;
      this.dx += dx;
      this.dy += dy;
      // reset the startXY for next time
      this.startX = mouseX;
      this.startY = mouseY;
      // redraw the image with border
      drawM();
    }
  }
  handleMouseDown(e, offsetX, offsetY) {
    this.startX = parseInt(e.clientX - offsetX);
    this.startY = parseInt(e.clientY - offsetY);
    this.draggingImage = this.HitImage(this.startX, this.startY);
  }
  handleMouseOut(e) {
    handleMouseUp(e);
  }
}

function drawM() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa toàn bộ canvas

  for (let i = 0; i < listImage.length; i++) {
    const image = listImage[i];
    image.draw(ctx);
  }

  requestAnimationFrame(drawM);
}

