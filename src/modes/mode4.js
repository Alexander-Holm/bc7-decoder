import decodeChannel from "../functions/decodeChannel.js";
import getRGB from "../functions/getRGB.js";
import readBits from "../functions/readBits.js";
import getIndex from "../functions/getIndex.js";
import rotateRGBA from "../functions/rotateRGBA.js";

const BIT_PRECISION = {
    ROTATION: 2,
    INDEX_MODE: 1,
    COLOR: 5,
    ALPHA: 6,
    INDEX_PRIMARY: 2,
    INDEX_SECONDARY: 3,
};
const OFFSET = {
    ROTATION: 5,
    INDEX_MODE: 7,
    COLOR: 8,
    ALPHA: 38,
    INDEX_PRIMARY: 50,
    INDEX_SECONDARY: 81
};

export default function mode4(block, yMajor){
    
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

    const indexMode = readBits(block, OFFSET.INDEX_MODE, BIT_PRECISION.INDEX_MODE);
    const indexColor = { bits: null, bitPrecision: null };
    const indexAlpha = { bits: null, bitPrecision: null };
    if(indexMode === 0){
        indexColor.bits = getIndex(block, yMajor, OFFSET.INDEX_PRIMARY, BIT_PRECISION.INDEX_PRIMARY);
        indexColor.bitPrecision = BIT_PRECISION.INDEX_PRIMARY;
        indexAlpha.bits = getIndex(block, yMajor, OFFSET.INDEX_SECONDARY, BIT_PRECISION.INDEX_SECONDARY);
        indexAlpha.bitPrecision = BIT_PRECISION.INDEX_SECONDARY;
    }
    else {
        indexAlpha.bits = getIndex(block, yMajor, OFFSET.INDEX_PRIMARY, BIT_PRECISION.INDEX_PRIMARY);
        indexAlpha.bitPrecision = BIT_PRECISION.INDEX_PRIMARY;
        indexColor.bits = getIndex(block, yMajor, OFFSET.INDEX_SECONDARY, BIT_PRECISION.INDEX_SECONDARY);
        indexColor.bitPrecision = BIT_PRECISION.INDEX_SECONDARY;
    };


    const rgba = new Uint8ClampedArray(4);
    for(let color = 0; color < 3; color++){
        rgba[color] = decodeChannel(
            endpoints[0][color],
            endpoints[1][color],
            BIT_PRECISION.COLOR,
            indexColor.bits,
            indexColor.bitPrecision
        );
    };
    rgba[3] = decodeChannel(
        endpoints[0][3],
        endpoints[1][3],
        BIT_PRECISION.ALPHA,
        indexAlpha.bits,
        indexAlpha.bitPrecision
    );

    const rotation = readBits(block, OFFSET.ROTATION, BIT_PRECISION.ROTATION);
    rotateRGBA(rgba, rotation);

    return rgba;
};