import { appendFile } from 'fs'
import {mkdir} from '../fileApi/mkdir'

const appendTest = async(filename: string, data: any) => {
    const result = await appendFile(filename, data) 
    console.log(`append ${result} to ${filename}`)
}

mkdir('./data')
    .then(s => appendTest('./data/hello.txt', 'Hi there!'))
    .catch((e: Error) => console.log(e.messasge))