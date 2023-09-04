import getMode from "./functions/getMode.js";
import mode0 from "./modes/mode0.js";
import mode1 from "./modes/mode1.js";
import mode2 from "./modes/mode2.js";
import mode3 from "./modes/mode3.js";
import mode4 from "./modes/mode4.js";
import mode5 from "./modes/mode5.js";
import mode6 from "./modes/mode6.js";
import mode7 from "./modes/mode7.js";


const blockSize = 16; // Bytes
// rgba8: one byte per channel (red, green, blue, alpha)
const bytesPerPixel = 4; 

export default function decodeBC7(data, width, height){
    let byteOffset = 0;
    let block = new DataView(data, byteOffset, blockSize);
    let mode = getMode(block);
    
    // Array in the format: [ r0, g0, b0, a0, r1, g1, b1, a1, ...]
    // Only one dimension,
    // Goes by rows from top left (0,0) = "y-major" (x + y * 4)
    const rgbaArray = new Uint8ClampedArray(width * height * bytesPerPixel);
    let pixelIndex = 0; // Index in rgbaArray for red channel of a pixel
    let pixel;

    let xInBlock = 0;
    let yInBlock = 0;
    let yMajorBlock = 0;
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            
            byteOffset = calculateBlockByteOffset(x, y, width, blockSize);
            if(byteOffset !== block.byteOffset){
                block = new DataView(data, byteOffset, blockSize);
                mode = getMode(block);
            };

            xInBlock = x % 4;
            yInBlock = y % 4;
            yMajorBlock = xInBlock + (yInBlock * 4);
            
            switch(mode){
                case 0: pixel = mode0(block, yMajorBlock); break;
                case 1: pixel = mode1(block, yMajorBlock); break;
                case 2: pixel = mode2(block, yMajorBlock); break;
                case 3: pixel = mode3(block, yMajorBlock); break;
                case 4: pixel = mode4(block, yMajorBlock); break;
                case 5: pixel = mode5(block, yMajorBlock); break;
                case 6: pixel = mode6(block, yMajorBlock); break;
                case 7: pixel = mode7(block, yMajorBlock); break;
                default: pixel = new Uint8ClampedArray( [250,0,0,250] ); break;
            };

            addPixel(rgbaArray, pixel, pixelIndex);
            pixelIndex += bytesPerPixel;
        }
    }
    return rgbaArray;
}

function calculateBlockByteOffset(x, y, width, blockSize){
    return blockSize * (Math.ceil(width/4) * Math.floor(y/4) + Math.floor(x/4));
}

function addPixel(rgbaArray, rgbaPixel, pixelIndex){
    for(let i = 0; i < 4; i++){
        rgbaArray[pixelIndex + i] = rgbaPixel[i];
    }
}