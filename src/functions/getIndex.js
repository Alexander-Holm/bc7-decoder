import readBits from "./readBits.js";

/**
 * @param {*} block 128 bit BC7 block
 * @param {Number} yMajor { x + y * 4 }, x and y relative to the block
 * @param {Number} indexStart Index of the first index bit within the block
 * @param {Number} bitPrecision Number of bits to get
 * @param {Number} numberOfSubsets Optional
 * @param {Number} partitionNumber Optional
 * @returns {Number} Bits for use in interpolating between the same channel of a subset (two endpoints)
 */
export default function getIndex(block, yMajor, indexStart, bitPrecision, numberOfSubsets = 1, partitionNumber = 0){
    // Offset into the index bits
    let offset = yMajor * bitPrecision;
    // Total offset into the block
    offset += indexStart;

    // First anchor index is always 0.
    // Rest are set to 255 so that they are always greater than yMajor.
    // They may be overwritten depending on the number of subsets.
    //const anchorIndexes = new Uint8Array([0, 255, 255]);    
    let anchorIndexes;
    switch(numberOfSubsets){
        case 1: anchorIndexes = new Uint8Array([0]); break;
        case 2: anchorIndexes = new Uint8Array([0, A2_SUBSET_2[partitionNumber]]); break;
        case 3: anchorIndexes = new Uint8Array([0, A3_SUBSET_2[partitionNumber], A3_SUBSET_3[partitionNumber]]); break;
    };
    anchorIndexes.forEach(anchorIndex => {
        // Anchor indexes are one bit less than the others so the 
        // offset needs to be adjusted if reading bits after the anchor index.
        if(yMajor > anchorIndex)
            offset--;
        // Anchor indexes should be unique so this should not trigger more than one
        if(yMajor === anchorIndex)
            bitPrecision--;
    });

    const index = readBits(block, offset, bitPrecision);
    return index;
};

// Anchor indexes
// Table.A2, Table.A3a, Table.A3b in documentation:
// https://registry.khronos.org/OpenGL/extensions/ARB/ARB_texture_compression_bptc.txt
// See also: https://registry.khronos.org/DataFormat/specs/1.3/dataformat.1.3.html#bptc_bc7
// First subset always has an anchor index of 0, does not have a table

// Two subset partitioning
const A2_SUBSET_2 = [
    15,15,15,15,15,15,15,15,
    15,15,15,15,15,15,15,15,
    15, 2, 8, 2, 2, 8, 8,15,
     2, 8, 2, 2, 8, 8, 2, 2,
    15,15, 6, 8, 2, 8,15,15,
     2, 8, 2, 2, 2,15,15, 6,
     6, 2, 6, 8,15,15, 2, 2,
    15,15,15,15,15, 2, 2,15,
];
// Three subset partitioning
const A3_SUBSET_2 = [
    3, 3,15,15, 8, 3,15,15,
    8, 8, 6, 6, 6, 5, 3, 3,
    3, 3, 8,15, 3, 3, 6,10,
    5, 8, 8, 6, 8, 5,15,15,
    8,15, 3, 5, 6,10, 8,15,
   15, 3,15, 5,15,15,15,15,
    3,15, 5, 5, 5, 8, 5,10,
    5,10, 8,13,15,12, 3, 3,
];
const A3_SUBSET_3 = [
    15, 8, 8, 3,15,15, 3, 8,
    15,15,15,15,15,15,15, 8,
    15, 8,15, 3,15, 8,15, 8,
     3,15, 6,10,15,15,10, 8,
    15, 3,15,10,10, 8, 9,10,
     6,15, 8,15, 3, 6, 6, 8,
    15, 3,15,15,15,15,15,15,
    15,15,15,15, 3,15,15, 8,
]