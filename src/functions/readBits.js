// Bit shifting is max 32bit integer
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Right_shift
// Javascript Number is 64bit, make sure number is small enough for 32bit or use DataView.getUint32()

// No error handling for index out of bounds
// Might not work with count larger than 24
export default function readBits(block, offset, count){
    const byteOffset = calculateByteOffset(offset);
    const littleEndian = true;
    // 32 bits is maximum size for bit shifting
    const int32 = block.getUint32(byteOffset, littleEndian);
    // Adjust bit offset to be relative to the int32 instead of the block
    const distanceFromEnd = offset - (byteOffset * 8);

    // 1*count bits from the right set to 1
    // All other bits to the left are 0
    const mask = (1 << count) - 1; // -1 is what sets the bits to 1
    // Place bit range that should be extracted all the way to the right
    // Needs to be unsigned right shift
    let bits = int32 >>> distanceFromEnd; 
    // Apply mask to set all other bits to 0
    bits = bits & mask;

    return bits;
}

function calculateByteOffset(bitOffset){
    let byteOffset = Math.floor(bitOffset / 8);
    // Offset 12 gives the last int32 in the 16 byte block
    // Reading outside of that results in an error
    byteOffset = Math.min(12, byteOffset);
    return byteOffset;
}