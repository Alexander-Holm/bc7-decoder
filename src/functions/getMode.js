export default function getMode(block){
    let modeByte = block.getUint8(0);

    // Mode 8 is when no bits are set. It is not a valid mode.
    // https://learn.microsoft.com/en-us/windows/win32/direct3d11/bc7-format-mode-reference#remarks
    if(modeByte === 0) return 8

    for(let i = 0; i < 8; i++){
        const lastBit = modeByte & 1;
        
        if(lastBit === 1)
            // Mode = index of last set bit
            return i;
        
        // Shift all bits one step to the right
        modeByte = modeByte >> 1;
    }
}