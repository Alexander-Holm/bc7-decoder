import ddsRead from "./dds-reader/index.js";
import decodeBC7 from "../src/index.js";

let HTMLelements;

window.onload = () => {
    HTMLelements = {
        fileInput: document.getElementById("file-input"),
        radioModeFilePicker: document.getElementById("mode-file-picker"),
        table: {
            fileName: document.getElementById("file-name"),
            fileSize: document.getElementById("file-size"),
            imageSize: document.getElementById("dimensions"),
            time: document.getElementById("time"),
        },
        canvas: document.getElementById("canvas"),
    }
    toggleFileInput();
}
window.toggleFileInput = () => {
    HTMLelements.fileInput.classList.toggle("hidden", !HTMLelements.radioModeFilePicker.checked);
}

window.fileSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const mode = formData.get("mode");
    let fileName;
    let fileSize;
    let byteArray;
    if(mode === "example"){
        fileName = "example-image.dds";
        const response = await fetch(fileName);
        fileSize = response.headers.get("content-length");
        byteArray = await response.arrayBuffer();
    }
    else{
        const file = formData.get("image-input");
        fileName = file.name;
        fileSize = file.size;
        byteArray = await file.arrayBuffer();
    }
    
    const parsedDds = ddsRead(byteArray);
    const width = parsedDds.header.dwWidth;
    const height = parsedDds.header.dwHeight;

    const startTime = performance.now();
    const rgba8 = decodeBC7(parsedDds.bdata, width, height);
    const elapsedTime = performance.now() - startTime;

    updateHTML(
        rgba8, 
        width, 
        height,
        fileName,
        fileSize,
        elapsedTime
    );
}

function updateHTML(rgba8, width, height, fileName, fileSize, duration){
    const HTMLelements = {
        fileName: document.getElementById("file-name"),
        fileSize: document.getElementById("file-size"),
        imageSize: document.getElementById("dimensions"),
        time: document.getElementById("time"),
        canvas: document.getElementById("canvas"),
    }

    const kiloBytes = Math.pow(10, -3) * fileSize;
    const roundedKB = Math.round(kiloBytes);

    HTMLelements.fileName.innerHTML = fileName;
    HTMLelements.fileSize.innerHTML = roundedKB + " KB";
    HTMLelements.imageSize.innerHTML = width + " x " + height;
    HTMLelements.time.innerHTML = duration + " ms";

    HTMLelements.canvas.width = width;
    HTMLelements.canvas.height = height;
    const canvasContext = HTMLelements.canvas.getContext("2d");
    const imageData = new ImageData(rgba8, width, height);
    canvasContext.putImageData(imageData, 0, 0);
}