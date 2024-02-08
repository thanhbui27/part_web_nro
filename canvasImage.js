export class CanvasImage {
  constructor(
    parentElement,
    imgLeg,
    imgBody,
    imgHead,
    widthCanvas,
    heightCanvas
  ) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = widthCanvas;
    this.canvas.height = heightCanvas;
    parentElement.appendChild(this.canvas);
    this.canvasWidth = widthCanvas;
    this.canvasHeight = heightCanvas;
    this.head = imgHead;
    this.body = imgBody;
    this.leg = imgLeg;
    this.listImg = [];
    this.initListImg(imgLeg.urlImage ?? "", this.leg.x, this.leg.y, "leg");
    this.initListImg(imgBody.urlImage ?? "", this.body.x, this.body.y, "body");
    this.initListImg(imgHead.urlImage ?? "", this.head.x, this.head.y, "head");
    this.isDragging = false;
    this.draggedImage = null;

    this.offsetX = 0;
    this.offsetY = 0;
    this.selectedImage = null; // Hình ảnh được chọn
    this.borderWidth = 2;
    this.deltaX = 0;
    this.deltaY = 0;
    this.initTextLocation();
    this.canvas.addEventListener("mousedown", this.selectImage.bind(this));

    document.addEventListener("mouseup", this.stopDragging.bind(this));
    document.addEventListener("mousemove", this.drag.bind(this));
    document.addEventListener("keydown", this.moveImage.bind(this));
  }

  initTextLocation() {
    this.ctx.font = "20px serif";
    this.ctx.fillStyle = "black";

    this.ctx.fillText(
      `Đầu : (${Math.round(this.head.x / 10)}, ${Math.round(
        this.head.y / 10
      )})`,
      10,
      30
    );
    this.ctx.fillText(
      `Body : (${Math.round(this.body.x / 10)}, ${Math.round(
        this.body.y / 10
      )})`,
      10,
      50
    );
    this.ctx.fillText(
      `Leg : (${Math.round(this.leg.x / 10)}, ${Math.round(this.leg.y / 10)})`,
      10,
      70
    );
  }

  initListImg(imageUrl, x, y, body) {
    const image = new Image();
    image.src = imageUrl;

    if (body === "leg") {
      this.listImg.push({
        image,
        type: 2,
        x: this.canvasWidth / 2 - image.width / 2 + x,
        y: this.canvasHeight / 2 - image.height / 2 - y,
      });
      image.onload = () => {
        this.ctx.drawImage(
          image,
          this.canvasWidth / 2 - image.width / 2 + x,
          this.canvasHeight / 2 - image.height / 2 - y
        );
      };
    }
    if (body === "body") {
      this.listImg.push({
        image,
        type: 1,
        x: this.canvasWidth / 2 - image.width / 2 + x,
        y: this.canvasHeight / 2 - image.height / 2 - y,
      });
      image.onload = () => {
        this.ctx.drawImage(
          image,
          this.canvasWidth / 2 - image.width / 2 + x,
          this.canvasHeight / 2 - image.height / 2 - y
        );
      };
    }
    if (body === "head") {
      this.listImg.push({
        image,
        type: 0,
        x: this.canvasWidth / 2 - image.width / 2 + x,
        y: this.canvasHeight / 2 - image.height / 2 - y,
      });
      image.onload = () => {
        this.ctx.drawImage(
          image,
          this.canvasWidth / 2 - image.width / 2 + x,
          this.canvasHeight / 2 - image.height / 2 - y
        );
      };
    }
  }

  startDragging(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    for (let i = this.listImg.length - 1; i >= 0; i--) {
      const { x, y, image } = this.listImg[i];
      if (
        mouseX >= x &&
        mouseX <= x + image.width &&
        mouseY >= y &&
        mouseY <= y + image.height
      ) {
        this.isDragging = true;
        this.draggedImage = this.listImg[i];
        this.offsetX = mouseX - x;
        this.offsetY = mouseY - y;
        return;
      }
    }
  }

  moveImage(e) {
    e.preventDefault();
    if (this.selectedImage) {
      if (this.selectedImage) {
        const { type } = this.selectedImage;
        switch (e.key) {
          case "ArrowUp":
            this.checkType(type, e.key);
            this.selectedImage.y -= 1;
            break;
          case "ArrowDown":
            this.checkType(type, e.key);
            this.selectedImage.y += 1;
            break;
          case "ArrowLeft":
            this.checkType(type, e.key);
            this.selectedImage.x -= 1;
            break;
          case "ArrowRight":
            this.checkType(type, e.key);
            this.selectedImage.x += 1;
            break;
        }
        this.saveToLocalStorage();
        this.redrawCanvas();
      }
    }
  }

  checkType(type, key) {
    let target = null;
    switch (type) {
      case 0:
        target = this.head;
        break;
      case 1:
        target = this.body;
        break;
      case 2:
        target = this.leg;
        break;
      default:
        return;
    }
    switch (key) {
      case "ArrowUp":
        target.y += 1;
        break;
      case "ArrowDown":
        target.y -= 1;
        break;
      case "ArrowLeft":
        target.x -= 1;
        break;
      case "ArrowRight":
        target.x += 1;
        break;
    }
  }

  selectImage(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Kiểm tra xem có click vào hình ảnh nào không
    for (let i = this.listImg.length - 1; i >= 0; i--) {
      const { x, y, image } = this.listImg[i];
      if (
        mouseX >= x &&
        mouseX <= x + image.width &&
        mouseY >= y &&
        mouseY <= y + image.height
      ) {
        this.selectedImage = this.listImg[i];
        this.redrawCanvas();
        return;
      }
    }

    // Nếu không click vào hình ảnh nào, hủy chọn hình ảnh
    this.selectedImage = null;
    this.redrawCanvas();
  }
  stopDragging() {
    this.isDragging = false;
    this.draggedImage = null;
  }
  drag(e) {
    if (this.isDragging) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.draggedImage.x = mouseX - this.offsetX;
      this.draggedImage.y = mouseY - this.offsetY;
      this.redrawCanvas();
    }
  }

  redrawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.listImg.forEach(({ image, x, y }) => {
      this.drawImage(image, x, y);

      if (this.selectedImage && this.selectedImage.image === image) {
        // Vẽ đường biên xung quanh hình ảnh được chọn
        this.ctx.strokeStyle = "red"; // Màu đường biên
        this.ctx.lineWidth = this.borderWidth; // Độ rộng của đường biên
        this.ctx.strokeRect(
          x - this.borderWidth / 2,
          y - this.borderWidth / 2,
          image.width + this.borderWidth,
          image.height + this.borderWidth
        );
      }
    });
    this.initTextLocation();
  }
  drawImage(img, x, y) {
    this.ctx.drawImage(img, x, y);
  }

  saveToLocalStorage() {
    var head = JSON.parse(localStorage.getItem("head"));
    var body = JSON.parse(localStorage.getItem("body"));
    var leg = JSON.parse(localStorage.getItem("leg"));
    head = head.map((item) =>
      item.id === this.head.id ? (item = this.head) : item
    );
    body = body.map((item) =>
      item.id === this.body.id ? (item = this.body) : item
    );
    leg = leg.map((item) =>
      item.id === this.leg.id ? (item = this.leg) : item
    );

    localStorage.setItem("head", JSON.stringify(head));
    localStorage.setItem("leg", JSON.stringify(leg));
    localStorage.setItem("body", JSON.stringify(body));
  }
}

// [0,[[12356,0,-9],[12357,-2,-8],[2955,0,0]]],
// [1,[[12358,1,0],[12359,0,-4],[12360,-2,-4],[12361,0,-3],[12362,1,-3],[12363,1,-2],[12364,1,-3],[12365,1,-3],[12366,0,-2],[12367,2,-2],[12368,2,-2],[12369,-1,-3],[12370,-1,-3],[12371,3,-3],[12372,-1,-3],[12373,1,-4],[2955,0,0]]],
// [2,[[12374,7,4],[12375,1,-1],[12376,0,0],[12377,1,-1],[12378,0,-2],[12379,1,-1],[12380,1,-1],[12381,1,1],[12382,-3,0],[12383,1,-1],[12384,-2,0],[12385,-2,-1],[12386,0,-1],[2955,0,0]]],
