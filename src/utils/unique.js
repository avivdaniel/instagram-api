const makeUniqueImageName = () => {
    return Math.random().toString(36).substr(2, 9) + '.jpg';
}

module.exports = makeUniqueImageName;