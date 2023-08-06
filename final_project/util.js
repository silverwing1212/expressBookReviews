const forEachEntry = (map, iterator) => {
    const keys = Object.keys(map);
    keys.forEach((key, index) => iterator(key, map[key]));
}

const queryValues = (map, predicate) => {
    const values = []
    forEachEntry(map, (key, value) => {
        if (predicate(key, value)) {
            values.push(value)
        }
    })
    return values;
}

const queryIndex = (list, predicate) => {
    const targetItem = { value: -1 };
    list.forEach((item, index) => {
        if (targetItem.value === -1 && predicate(item)) {
            targetItem.value = index;
        }
    })
    return targetItem.value;
}

module.exports.forEachEntry = forEachEntry;
module.exports.queryValues = queryValues;
module.exports.queryIndex = queryIndex;