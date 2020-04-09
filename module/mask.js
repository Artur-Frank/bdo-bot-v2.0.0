function compares(str, mask) {
    try {
        if ((str.length == 0 || str.length == undefined) && (mask.length == 0 || mask.length == undefined)) {
            return false;
        }
        let res = str.match(mask);
        if (res != null) {
            if (res[0] == str) {
                return true;
            }
            else { return false; }
        }
        else { return false; }
    } catch {
        return false;
    }
}

async function parse(match, mask, char = "[data]", callback) {
    try {
        if ((match.length == 0 || match.length == undefined) && (mask.length == 0 || mask.length == undefined) && (char.length == 0 || char.length == undefined)) {
            return callback(new Error('Incorrect data was transmitted.'));
        }
        let string = mask.split('[data]');
        string.pop();

        let result = [];

        for (const [index, value] of string.entries()) {
            result.push(match.split(value)[1].split(string[index + 1])[0]);
            let a = match.replace(value, '').replace(result[index], '');
            match = a.replace(result[index], '');
        }

        return callback(null, result);
    } catch {
        return callback(new Error('Parsing failed.'))
    }
}

module.exports = { parse, compares }