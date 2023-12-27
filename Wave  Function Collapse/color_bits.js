const R_POSITION_IN_BITS = 0;
const G_POSITION_IN_BITS = 8;
const B_POSITION_IN_BITS = 8 * 2;

function ConvertToColorCode(...args) {
    let col = color(...args);

    let colCode = 0;
    colCode += col[0] << R_POSITION_IN_BITS;
    colCode += col[1] << G_POSITION_IN_BITS;
    colCode += col[2] << B_POSITION_IN_BITS;

    console.log(ConvertNumberToBitString(colCode));
    return colCode;
}
function ConvertNumberToBitString(no) {
    return (no << 0).toString(16);
}