export const getFullDateFormat = (date: Date) => {
    return `${date.toDateString()} ${date.toLocaleTimeString()}`;
};

export const getCurrentTimestamp = () => {
    return  Math.floor(new Date(Date.now()).getTime() / 1000);
};

