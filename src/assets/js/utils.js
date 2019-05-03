
export default {
    count(number) {
        if (number > 10 ** 10) return `${Math.floor(number / (10 ** 9))} B`;
        if (number > 10 ** 9) return `${Math.floor(number / (10 ** 8)) / 10} B`;
        if (number > 10 ** 7) return `${Math.floor(number / (10 ** 6))} M`;
        if (number > 10 ** 6) return `${Math.floor(number / (10 ** 5)) / 10} M`;
        if (number > 10 ** 4) return `${Math.floor(number / (10 ** 3))} K`;
        if (number > 10 ** 3) return `${Math.floor(number / (10 ** 2)) / 10} K`;
        return number;
    },
};
