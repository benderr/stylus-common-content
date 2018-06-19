const fs = require('fs')
const path = require('path');


function getMarkupCommon(rootPath, markupCommonPath) {
    let markup_common;
    const variants = [
        '../modul.markup.ui-kit/',
        'node_modules/modul.markup.ui-kit/',
    ];
    if (markupCommonPath)
        variants.push(markupCommonPath);

    var i = variants.length - 1;

    while (i >= 0 && !markup_common) {
        var _path = path.resolve(rootPath, variants[i]);
        if (fs.existsSync(_path))
            markup_common = _path;
        i--;
    }

    if (!markup_common)
        throw 'Не удалось найти папку node_modules/modul.markup.ui-kit/';

    return markup_common;
}

const createPlugin = function (rootPath, markupCommonPath, stylus) {
    return function () {
        return function (style) {

            const markup_common = getMarkupCommon(rootPath, markupCommonPath);
            const images = path.resolve(markup_common, 'markup', 'images');
            console.log('Папка с картинками - ', images);

            const func = function (url, enc) {
                const urlFunc = stylus.resolver({paths: [images]});
                return urlFunc.call(this, url);
            };

            func.raw = true;

            style.define('common-url', func);
        };
    }
};

module.exports = {
    getMarkupCommon,
    createPlugin
};