// Personal Perference, I just don't like to have to put .js in TS files
import {
    existsSync,
    readdirSync,
    lstatSync,
    writeFileSync,
    readFileSync
} from 'fs';
import {
    join
} from 'path';

function fromDir(startPath, filter) {
    if (!existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    const filenames = [];
    const files = readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = join(startPath, files[i]);
        const stat = lstatSync(filename);
        if (stat.isDirectory()) {
            filenames.push(...fromDir(filename, filter)); //recurse
        } else if (filename.endsWith(filter)) {
            filenames.push(filename);
        };
    };
    return filenames;
};

const files = fromDir('./dist', '.js');
files.forEach((file) => {
    let content = readFileSync(file).toString();
    content = content.replace(/(import\s+|from\s+)(["'])(?!.*\.js)(\.?\.\/.*)(["'])/g, '$1$2$3.js$4');
    content = content.replace(/@pictogrammers\/element/, './../element.js');
    writeFileSync(file, content, { encoding: 'utf8' });
});
