import { CanvasImage } from "./canvasImage.js";

LoadData("stand");
LoadData("run");
LoadData("fall");
LoadData("fly");
LoadData("skillstand");
LoadData("inju");

function LoadData(idClass) {
  const parent = document.getElementById(idClass);
  const typeId = parent.getAttribute("data-typeId");
  var head = localStorage.getItem("head");
  var body = localStorage.getItem("body");
  var leg = localStorage.getItem("leg");
  if (head == null || body == null || leg == null) return;

  head = JSON.parse(head);
  body = JSON.parse(body);
  leg = JSON.parse(leg);

  for (let i = 0; i < typeId; i++) {
    if (idClass === "stand") {
      const canvas = new CanvasImage(
        parent,
        leg[1],
        body[1],
        head[0],
        300,
        350
      );
    } else if (idClass === "run") {
      const canvas = new CanvasImage(
        parent,
        leg[i + 2],
        body[i + 2],
        head[1],
        300,
        350
      );
    } else if (idClass === "fall") {
      const canvas = new CanvasImage(
        parent,
        leg[8],
        body[8],
        head[0],
        300,
        350
      );
    } else if (idClass === "fly") {
      const canvas = new CanvasImage(
        parent,
        leg[0],
        body[7],
        head[0],
        300,
        350
      );
    } else if (idClass === "skillstand") {
      if (i === 0) {
        const canvas = new CanvasImage(
          parent,
          leg[9],
          body[2],
          head[1],
          300,
          350
        );
      } else if (i > 0 && i <= 4) {
        if (i === 1) {
          const canvas = new CanvasImage(
            parent,
            leg[11],
            body[i + 8],
            head[1],
            300,
            350
          );
        } else if (i === 4) {
          const canvas = new CanvasImage(
            parent,
            leg[10],
            body[i + 8],
            head[1],
            300,
            350
          );
        } else {
          const canvas = new CanvasImage(
            parent,
            leg[9],
            body[i + 8],
            head[1],
            300,
            350
          );
        }
      } else if (i == 5) {
        const canvas = new CanvasImage(
          parent,
          leg[12],
          body[12],
          head[1],
          300,
          350
        );
      } else if (i === 9) {
        const canvas = new CanvasImage(
          parent,
          leg[9],
          body[7],
          head[0],
          300,
          350
        );
      } else {
        const canvas = new CanvasImage(
          parent,
          leg[9],
          body[i + 7],
          head[1],
          300,
          350
        );
      }
    } else if (idClass === "inju") {
      const canvas = new CanvasImage(
        parent,
        leg[7],
        body[0],
        head[0],
        300,
        350
      );
    } else {
      const canvas = new CanvasImage(
        parent,
        "/part/596.png",
        "/part/581.png",
        "/part/18.png",
        300,
        350
      );
    }
  }
}

// Hàm để thêm ảnh vào local storage
function addImageToLocalStorage(file, key) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const imageData = {
      urlImage: event.target.result, // Base64 encoded image data
      id: file.name.match(/^\d+/)[0],
      x: 0, // Initial x position
      y: 0, // Initial y position
    };
    var x = [];
    if (localStorage.getItem(key) === null) {
      x.push(imageData);
      localStorage.setItem(key, JSON.stringify(x));
    } else {
      x = localStorage.getItem(key);
      x = JSON.parse(x);
      x.push(imageData);
      localStorage.setItem(key, JSON.stringify(x));
    }
  };
  reader.readAsDataURL(file); // Đọc ảnh dưới dạng Base64
}

// Sự kiện được gọi khi chọn ảnh từ hộp thoại
document
  .getElementById("partHead")
  .addEventListener("change", function (event) {
    const files = event.target.files; // Lấy danh sách ảnh đã chọn
    for (let i = 0; i < files.length; i++) {
      localStorage.removeItem("head");
      addImageToLocalStorage(files[i], "head"); // Thêm từng ảnh vào local storage
    }
  });

document
  .getElementById("partBody")
  .addEventListener("change", function (event) {
    const files = event.target.files; // Lấy danh sách ảnh đã chọn
    for (let i = 0; i < files.length; i++) {
      localStorage.removeItem("body");
      addImageToLocalStorage(files[i], "body"); // Thêm từng ảnh vào local storage
    }
  });

document.getElementById("partLeg").addEventListener("change", function (event) {
  const files = event.target.files; // Lấy danh sách ảnh đã chọn
  for (let i = 0; i < files.length; i++) {
    localStorage.removeItem("leg");
    addImageToLocalStorage(files[i], "leg"); // Thêm từng ảnh vào local storage
  }
});
