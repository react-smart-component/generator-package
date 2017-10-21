import path from 'path';
import execa from 'execa';
import * as configs from './config';

const base = configs.cwdPath;
const output = configs.outputPath;
const registry = configs.registry;

const shell = async(file, args) => {
    const {
        code,
        stdout,
    } = await execa(file, args);
    if (code === 0) {
        return stdout.split('\n')[0];
    } else {
        return null;
    }
};

const publish = async() => {
    const { version } = require('../../package.json');
    const branch = await shell('git', ['symbolic-ref', '--short', 'HEAD']);
    await execLog('npm', ['run', 'build']);
    const outputPath = path.join(base, output);
    process.chdir(outputPath);
    const publishCommands = ['publish', `--registry=${registry}`];
    if (version.indexOf('-') >= 0) {
        publishCommands.push(
            '--tag',
            'beta',
        );
    }
    if (branch !== 'master' && version.indexOf('-') === -1) {
        throw new Error(`version ${version} is an incorrect beta version`);
    } else {
        await execLog('npm', publishCommands);
    }
    process.chdir(base);
};

publish().catch(function(err) {
    console.error(err);
});
