module.exports = config;

const fs = require('fs');
const path = require('path');

/**
 * config() Return a Language's tokens or if not specified all tokens available
 *
 * @param {String} lang [optional] ISO 639-1 Code - If not specified return object of all codes
 * @param {Boolean} singletons [optional] whether to include single-entry abbreviation list items. These are not used for substitution but can be useful for string comparison. Defaults to false.
 *
 * @return {Array|Object} Return an array for a single lang tokens or an object map of all tokens by ISO code
 */
function config(lang, singletons) {
    singletons = !!singletons;

    if (lang && (typeof lang !== 'string' || lang.length != 2)) throw Error('optional lang param must be string containing 2 letter ISO 639-1 Code');

    if (lang) {
        if (!fs.statSync(path.resolve(__dirname, `./tokens/${lang}.json`))) {
            if (!fs.statSync(path.resolve(__dirname, `./tokens/${lang}.json`))) {
                return [];
            } else {
                let tokenjs = require(`./tokens/${lang}`);

                return singletons ? tokenjs() : removeSingletons(tokenjs());
            }
        } else {
            let tokenjson = require(`./tokens/${lang}.json`);

            return singletons ? tokenjson : removeSingletons(tokenjson);
        }
    }

    const tokens = {};

    fs.readdirSync(path.resolve(__dirname, './tokens/')).forEach((token) => {
        if (token.match(/\.json$/)) {
            let json = require(`./tokens/${token}`);

            tokens[token.replace(/\.json/, '')] = singletons ? json : removeSingletons(json);
        } else if (token.match(/\.js$/)) {
            let js = require(`./tokens/${token.replace('\.js$', '')}`);

            tokens[token.replace(/\.js/, '')] = singletons ? js() : removeSingletons(js());
        } else {
            return;
        } 
    });

    return tokens;
}

function removeSingletons(tokens) {
    if (!(tokens instanceof Array)) return tokens;

    return tokens.filter((token) => { return token instanceof Array && token.length > 1; });
}
