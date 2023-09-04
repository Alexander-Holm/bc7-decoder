import readBits from "./readBits.js";

export default function addPbits(block, mode, endpointPair, subsetNumber = 0){
    leftShiftChannels(endpointPair);
    const pbitPair = getPbits(block, mode, subsetNumber);
    insertPbits(endpointPair, pbitPair);
};


function leftShiftChannels(endpointPair){
    endpointPair.forEach(endpoint => {
        endpoint.forEach((channelValue, i) => {
            endpoint[i] = channelValue << 1;
        })
    })
}
function insertPbits(endpointPair, pbits){
    endpointPair.forEach((endpoint, endpointIndex) => {
        endpoint.forEach((channelValue, i) => {
            endpoint[i] |= pbits[endpointIndex];
        })
    })
}
function getPbits(block, mode, subsetNumber){
    let offset = subsetNumber * 2;
    let sharedPbits = false;

    switch(mode){
        case 0: offset += 77; break;
        case 1: 
            offset += 80;
            sharedPbits = true;
            break;
        case 3: offset += 94; break;
        case 6: offset += 63; break;
        case 7: offset += 94; break;
    };

    let pbits = new Uint8Array(2);
    if(sharedPbits){
        const pbit = readBits(block, offset, 1);
        pbits.set([pbit, pbit]);
    }
    else {        
        pbits[0] = readBits(block, offset, 1);
        pbits[1] = readBits(block, ++offset, 1);
    }

    return pbits;
}