/**
 * @param {Number} e0channel Channel from endpoint 0
 * @param {Number} e1channel Channel from endpoint 1
 * @param {Number} channelPrecision Number of bits in one channel
 * @param {Number} index 
 * @param {Number} indexPrecision Number of bits in index
 * @param {Boolean} pbits If channel bits contain pbits
 */
export default function decodeChannel(e0channel, e1channel, channelPrecision, index, indexPrecision, pbits = false){
    // bitPrecision includes p-bit
    if(pbits) channelPrecision++;
    e0channel = finalizeBitOrder(e0channel, channelPrecision);
    e1channel = finalizeBitOrder(e1channel, channelPrecision);
    
    const channel = interpolate(
        e0channel,
        e1channel,
        index,
        indexPrecision
    );

    return channel;
}

function finalizeBitOrder(channel, bitPrecision){
    // From fully_decode_endpoints(endpoint_array, mode, block) https://learn.microsoft.com/en-us/windows/win32/direct3d11/bc7-format
    // First left shift endpoint components so that their MSB lies in bit 7
    // Then replicate each component's MSB into the LSBs revealed by the left-shift operation above
    channel = channel << (8 - bitPrecision);
    channel = channel | channel >> bitPrecision;
    return channel;
};

const weight_table2 = [0, 21, 43, 64];
const weight_table3 = [0, 9, 18, 27, 37, 46, 55, 64];
const weight_table4 = [0, 4, 9, 13, 17, 21, 26, 30, 34, 38, 43, 47, 51, 55, 60, 64];
function interpolate(e0channel, e1channel, index, indexBitSize){    
    let weight;
    switch(indexBitSize){
        case 2: weight = weight_table2[index]; break;
        case 3: weight = weight_table3[index]; break;
        case 4: weight = weight_table4[index]; break;
    }
    const output = ((64 - weight) * e0channel + weight * e1channel + 32) >> 6;
    return output;
};