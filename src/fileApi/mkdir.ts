import mkdirp from 'mkdirp';
import {fileExists} from './fileExists';

export const mkdir = (dirname: string): Promise<string> =>
    new Promise(async (resolve, reject) => {
        const alreadyExists = await fileExists(dirname)
            alreadyExists ? resolve(dirname) : 
                mkdirp(dirname).then(resolve).catch(reject)
    })