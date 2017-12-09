function timeDiff(left, right) {
    const lt = new Date(left);
    const rt = new Date(right);
    return Math.floor((lt - rt) / 1000);
}
function strEqual(left, right) {
    return new String(left).valueOf() == new String(right).valueOf()
}
module.exports = { timeDiff, strEqual }