import addPbits from "../functions/addPbits.js";
import getIndex from "../functions/getIndex.js";
import readBits from "../functions/readBits.js";
import decodeChannel from "../functions/decodeChannel.js";
import getRGB from "../functions/getRGB.js";
import getSubsetNumber from "../functions/getSubsetNumber.js";

const MODE = 3;
const BIT_PRECISION = {
    PARTITION: 6,
    COLOR: 7,
    INDEX: 2,    
};
const OFFSET = {
    PARTITION: 4,
    COLOR: 10,
    INDEX: 98,
};
const NUM_SUBSETS = 2;
const  PBITS = true;

export default function mode3(block, yMajor){

    const partitionNumber = readBits(block, OFFSET.PARTITION, BIT_PRECISION.PARTITION);
    const subsetNumber = getSubsetNumber(yMajor, NUM_SUBSETS, partitionNumber);

    let endpointNumber = subsetNumber * 2;
    // No alpha
    const endpoints = [
        getRGB(block, endpointNumber, BIT_PRECISION.COLOR, OFFSET.COLOR, NUM_SUBSETS),
        getRGB(block, ++endpointNumber, BIT_PRECISION.COLOR, OFFSET.COLOR, NUM_SUBSETS),
    ];
    addPbits(block, MODE, endpoints, subsetNumber);

    const index = getIndex(block, yMajor, OFFSET.INDEX, BIT_PRECISION.INDEX, NUM_SUBSETS, partitionNumber);

    const rgba = new Uint8ClampedArray(4);
    for(let color = 0; color < 3; color++){
        rgba[color] = decodeChannel(
            endpoints[0][color],
            endpoints[1][color],
            BIT_PRECISION.COLOR,
            index,
            BIT_PRECISION.INDEX,
            PBITS
        );
    };
    rgba[3] = 255; // alpha

    return rgba;
}