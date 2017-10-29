import path from 'path';
import fse from 'fs-extra';
import globPromise from 'glob-promise';
import * as babelCore from 'babel-core';

const babelTransformFile = function (filePath) {
    return new Promise(function (resolve, reject) {
        babelCore.transformFile(filePath, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const outputTransformFile = function(filePath, content) {
    return new Promise(function(resolve, reject) {
        fse.writeFile(filePath, content, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const complie = async function (sourceFolder, outputFolder) {
    const sourceFiles = await globPromise(path.join(sourceFolder, '**', '*.js'));
    const transformJobs = sourceFiles.map(function (sourceFile) {
        return babelTransformFile(sourceFile);
    });
    const transformResults = await Promise.all(transformJobs);
    const ouputJobs = transformResults.map(function(transformResult) {
        const {
            options,
            code,
        } = transformResult;
        const { base: fileName } = path.parse(options.filename);
        const outputFileName = path.join(outputFolder, fileName);
        return outputTransformFile(outputFileName, code);
    });
    await Promise.all(ouputJobs);
};

const babel = async function (args) {
    const {
        base,
        src,
        output,
    } = args;
    const sourceFolder = path.join(base, src);
    const outputFolder = path.join(base, output);
    return await complie(sourceFolder, outputFolder);
};

export default babel;
