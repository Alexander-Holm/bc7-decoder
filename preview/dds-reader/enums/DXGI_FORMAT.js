// https://learn.microsoft.com/en-us/windows/win32/api/dxgiformat/ne-dxgiformat-dxgi_format
export var DXGI_FORMAT;
(function (DXGI_FORMAT) {
    // Block compressed
    DXGI_FORMAT[DXGI_FORMAT["BC1_TYPELESS"] = 70] = "BC1_TYPELESS";
    DXGI_FORMAT[DXGI_FORMAT["BC1_UNORM"] = 71] = "BC1_UNORM";
    DXGI_FORMAT[DXGI_FORMAT["BC1_UNORM_SRGB"] = 72] = "BC1_UNORM_SRGB";
    DXGI_FORMAT[DXGI_FORMAT["BC2_TYPELESS"] = 73] = "BC2_TYPELESS";
    DXGI_FORMAT[DXGI_FORMAT["BC2_UNORM"] = 74] = "BC2_UNORM";
    DXGI_FORMAT[DXGI_FORMAT["BC2_UNORM_SRGB"] = 75] = "BC2_UNORM_SRGB";
    DXGI_FORMAT[DXGI_FORMAT["BC3_TYPELESS"] = 76] = "BC3_TYPELESS";
    DXGI_FORMAT[DXGI_FORMAT["BC3_UNORM"] = 77] = "BC3_UNORM";
    DXGI_FORMAT[DXGI_FORMAT["BC3_UNORM_SRGB"] = 78] = "BC3_UNORM_SRGB";
    DXGI_FORMAT[DXGI_FORMAT["BC4_TYPELESS"] = 79] = "BC4_TYPELESS";
    DXGI_FORMAT[DXGI_FORMAT["BC4_UNORM"] = 80] = "BC4_UNORM";
    DXGI_FORMAT[DXGI_FORMAT["BC4_SNORM"] = 81] = "BC4_SNORM";
    DXGI_FORMAT[DXGI_FORMAT["BC5_TYPELESS"] = 82] = "BC5_TYPELESS";
    DXGI_FORMAT[DXGI_FORMAT["BC5_UNORM"] = 83] = "BC5_UNORM";
    DXGI_FORMAT[DXGI_FORMAT["BC5_SNORM"] = 84] = "BC5_SNORM";
    DXGI_FORMAT[DXGI_FORMAT["BC6H_TYPELESS"] = 94] = "BC6H_TYPELESS";
    DXGI_FORMAT[DXGI_FORMAT["BC6H_UF16"] = 95] = "BC6H_UF16";
    DXGI_FORMAT[DXGI_FORMAT["BC6H_SF16"] = 96] = "BC6H_SF16";
    DXGI_FORMAT[DXGI_FORMAT["BC7_TYPELESS"] = 97] = "BC7_TYPELESS";
    DXGI_FORMAT[DXGI_FORMAT["BC7_UNORM"] = 98] = "BC7_UNORM";
    DXGI_FORMAT[DXGI_FORMAT["BC7_UNORM_SRGB"] = 99] = "BC7_UNORM_SRGB";
    // Legacy
    DXGI_FORMAT[DXGI_FORMAT["R8G8_B8G8_UNORM"] = 68] = "R8G8_B8G8_UNORM";
    DXGI_FORMAT[DXGI_FORMAT["G8R8_G8B8_UNORM"] = 69] = "G8R8_G8B8_UNORM";
    DXGI_FORMAT[DXGI_FORMAT["YUY2"] = 107] = "YUY2";
})(DXGI_FORMAT || (DXGI_FORMAT = {}));
