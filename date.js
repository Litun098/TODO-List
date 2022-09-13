
const date = () => {
    let today = new Date();
    let currentDay = today.getDay();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    return today.toLocaleDateString('en-Us', options);

}

module.exports = {
    date
}