const forEachEntry = (map, iterator) => {
    const keys = Object.keys(map);
    keys.forEach((key, index) => iterator(key, map[key]));
}

const queryKey = (map, predicate) => {
    const targetItem = { value: null};
    forEachEntry(map, (key, value) => {
        if (targetItem.value === null && predicate(key, value)) {
            targetItem.value = key;
        }
    })
    return targetItem.value;
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
module.exports.queryKey = queryKey;
module.exports.queryIndex = queryIndex;