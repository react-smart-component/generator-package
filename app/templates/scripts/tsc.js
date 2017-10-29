import * as ts from 'typescript';
import globPromise from 'glob-promise';
import path from 'path';

const compile = function (fileNames, options) {
    return new Promise((resolve, reject) => {
        const program = ts.createProgram(fileNames, options);
        const emitResult = program.emit();
        const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        let errorMsg = '';
        allDiagnostics.forEach(function (diagnostic) {
            if (diagnostic.file) {
                const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                const message = ts.flattenDiagnosticMessageText(diagnostic.messageText);
                errorMsg += `in [tsc] at ${diagnostic.file.fileName}:${line}:${character} \r\n ${message} \r\n `;
            }
        });
        if (errorMsg) {
            reject(new Error(errorMsg));
        } else {
            resolve();
        }
    });
};

const tsc = async function (args) {
    const {
        base,
        src,
        output,
    } = args;
    const outputPath = path.join(base, output);
    const sourceFiles = await globPromise(path.join(base, src, '**', '*.ts'));
    let tsconfigPath = path.join(base, 'tsconfig.json');
    const compilerOptions = require(tsconfigPath).compilerOptions;
    const parsed = ts.convertCompilerOptionsFromJson(compilerOptions, outputPath);
    parsed.options.outDir = outputPath;
    parsed.options.declaration = true;
    await compile(sourceFiles, parsed.options);
};

export default tsc;
