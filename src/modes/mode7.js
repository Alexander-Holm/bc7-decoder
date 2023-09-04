import addPbits from "../functions/addPbits.js";
import decodeChannel from "../functions/decodeChannel.js";
import getIndex from "../functions/getIndex.js";
import getRGB from "../functions/getRGB.js";
import getSubsetNumber from "../functions/getSubsetNumber.js";
import readBits from "../functions/readBits.js";

const MODE = 7;
const NUM_SUBSETS = 2;
const PBITS = true;
const BIT_PRECISION = {
    PARTITION: 6,
    COLOR: 5,
    ALPHA: 5,
    INDEX: 2,    
};
const OFFSET = {
    PARTITION: 8,
    COLOR: 14,
    ALPHA: 74,
    INDEX: 98,
};

export default function mode7(block, yMajor){
    const partitionNumber = readBits(block, OFFSET.PARTITION, BIT_PRECISION.PARTITION);
    const subsetNumber = getSubsetNumber(yMajor, NUM_SUBSETS, partitionNumber);
    let endpointNumber = subsetNumber * 2;

    const alphaOffsets = [
        OFFSET.ALPHA + (endpointNumber * BIT_PRECISION.ALPHA), 
        OFFSET.ALPHA + (endpointNumber * BIT_PRECISION.ALPHA) + BIT_PRECISION.ALPHA
    ];
    const endpoints = [
        new Uint8ClampedArray(4),
        new Uint8ClampedArray(4)
    ];
    for(let i = 0; i < 2; i++){
        const rgb = getRGB(block, endpointNumber++, BIT_PRECISION.COLOR, OFFSET.COLOR, NUM_SUBSETS);
        endpoints[i].set(rgb);
        endpoints[i][3] = readBits(block, alphaOffsets[i], BIT_PRECISION.ALPHA);
    };
    addPbits(block, MODE, endpoints, subsetNumber);

    const index = getIndex(        
        block, yMajor,
        OFFSET.INDEX, BIT_PRECISION.INDEX,
        NUM_SUBSETS, partitionNumber
    );

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