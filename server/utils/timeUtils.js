function getCurTimeColored() {
    const now = new Date();

    const day = getTimeEdited(now.getDate());
    const month = getTimeEdited(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = getTimeEdited(now.getHours());
    const minutes = getTimeEdited(now.getMinutes());
    const seconds = getTimeEdited(now.getSeconds());

    return `\x1b[36m${day}/${month}/${year} ${hours}:${minutes}:${seconds}\x1b[37m`;
}

function getTimeEdited(time) {
    return time.toString().padStart(2, '0');
}

module.exports = {
    getCurTimeColored
};
