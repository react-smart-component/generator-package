
import path from 'path';
import fse from 'fs-extra';

const clean = async function(args) {
    const {
        base,
        src,
    } = args;
    const cleanPath = path.join(base, src);
    await fse.remove(cleanPath);
};

export default clean;
