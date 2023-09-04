import addPbits from "../functions/addPbits.js";
import decodeChannel from "../functions/decodeChannel.js";
import getIndex from "../functions/getIndex.js";
import getRGB from "../functions/getRGB.js";
import readBits from "../functions/readBits.js";

const MODE = 6;
const PBITS = true;
const BIT_PRECISION = {
    COLOR: 7,
    ALPHA: 7,
    INDEX: 4,    
};
const OFFSET = {
    COLOR: 7,
    ALPHA: 49,
    INDEX: 65,
};

export default function mode6(block, yMajor){    

    const alphaOffsets = [
        OFFSET.ALPHA, 
        OFFSET.ALPHA + BIT_PRECISION.ALPHA
    ];
    const endpoints = [
        new Uint8ClampedArray(4),
        new Uint8ClampedArray(4)
    ];
    for(let i = 0; i < 2; i++){
        const rgb = getRGB(block, i, BIT_PRECISION.COLOR, OFFSET.COLOR);
        endpoints[i].set(rgb);
        endpoints[i][3] = readBits(block, alphaOffsets[i], BIT_PRECISION.ALPHA);
    };
    addPbits(block, MODE, endpoints);

    const index = getIndex(block, yMajor, OFFSET.INDEX, BIT_PRECISION.INDEX);

    const rgba = new Uint8ClampedArray(4);
    for(let color = 0; color < 3; color++){
        rgba[color] = decodeChannel(
            endpoints[0][color], endpoints[1][color],
            BIT_PRECISION.COLOR,
            index, BIT_PRECISION.INDEX,
            PBITS
        );
    };
    rgba[3] = decodeChannel(
        endpoints[0][3], endpoints[1][3], 
        BIT_PRECISION.ALPHA,
        index, BIT_PRECISION.INDEX,
        PBITS
    );    

    return rgba;
}