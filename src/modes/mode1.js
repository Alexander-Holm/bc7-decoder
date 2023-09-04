import addPbits from "../functions/addPbits.js";
import decodeChannel from "../functions/decodeChannel.js";
import getIndex from "../functions/getIndex.js";
import getRGB from "../functions/getRGB.js";
import getSubsetNumber from "../functions/getSubsetNumber.js";
import readBits from "../functions/readBits.js";

const MODE = 1;
const BIT_PRECISION = {
    PARTITION: 6,
    COLOR: 6,
    INDEX: 3,    
};
const OFFSET = {
    PARTITION: 2,
    COLOR: 8,
    INDEX: 82,
};
const NUM_SUBSETS = 2;
const PBITS = true;

export default function mode1(block, yMajor){
    const partitionNumber = readBits(block, OFFSET.PARTITION, BIT_PRECISION.PARTITION);
    const subsetNumber = getSubsetNumber(yMajor, NUM_SUBSETS, partitionNumber);

    let endpointNumber = 2 * subsetNumber;
    const rgb = [
        getRGB(block, endpointNumber, BIT_PRECISION.COLOR, OFFSET.COLOR, NUM_SUBSETS),
        getRGB(block, ++endpointNumber, BIT_PRECISION.COLOR, OFFSET.COLOR, NUM_SUBSETS),
    ];
    addPbits(block, MODE, rgb, subsetNumber);

    const index = getIndex(block, yMajor, OFFSET.INDEX, BIT_PRECISION.INDEX, NUM_SUBSETS, partitionNumber);

    const rgba = new Uint8ClampedArray(4);
    for(let color = 0; color < 3; color++){
        rgba[color] = decodeChannel(
            rgb[0][color],
            rgb[1][color],
            BIT_PRECISION.COLOR,
            index,
            BIT_PRECISION.INDEX,
            PBITS
        );
    };
    rgba[3] = 255; // alpha

    return rgba;
}