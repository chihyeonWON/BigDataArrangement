# BigDataBatch
Build Big Data Batch Program by using React &amp; Typescript ( 리액트와 타입스크립트를 이용한 빅데이터 집단 프로그램 개발)

## 노드제이에스에서 프로그램 명령 줄 인수 읽기

```typescript
process.argv.forEach((val: string, index: number) => {
    console.log(index + ':' + val)
})
```

실행 명령 뒤에 여러 개의 매개변수를 입력
```typescript
ts-node src/test/processArgs-test.ts data/fake.csv 100000
```

![processArgs](https://user-images.githubusercontent.com/58906858/141070644-365c1a57-7dd0-4a19-8856-384119662fa1.png)

```typescript
export type FileNameAndNumber = [string, number]

export const getFileNameAndNumber = (defaultFilename: string,
    defaultNumberOfFakeData: number): FileNameAndNumber => {
        const [bin, node, filename, numberOfFakeData] = process.argv
        return [filename || defaultFilename, numberOfFakeData ?
            parseInt(numberOfFakeData, 10) : defaultNumberOfFakeData]
    }
```

```typescript
import { getFileNameAndNumber } from "../utils/getFileNameAndNumber";

const [filename, numberOfFakeItems] = getFileNameAndNumber('data/fake.csv', 100000)
console.log(filename, numberOfFakeItems)
```

### 명령
```typescript
ts-node ./src/test/getFileNameAndNumber-test.ts data/fake.csv 100000
```

### 실행결과
```typescript
data/fake.csv 100000
```

### 파일 처리 비동기 함수를 프로미스로 구현하기

#### fs.access API로 디렉터리나 파일 확인하기

src/fileApi/fileExists.ts
```typescript
import * as fs from 'fs'

export const fileExists = (filepath: string): Promise<boolean> => 
    new Promise(resolve => fs.access(filepath, error => resolve(error ? false : true)))

```
#### 테스트 파일 생성
src/test/fileExists-test.ts
```typescript
import { fileExists } from "../fileApi/fileExists";

const exists = async(filepath) => {
    const result = await fileExists(filepath)
    console.log(`${filepath} ${result ? 'exists' : 'not exists'}`)
}

exists('./package.json')
exists('./package')
```

#### 테스트 결과 확인 명령
```typescript 
ts-node ./src/test/fileExists-test.ts 
```

#### 테스트 결과
```typescript
./package.json exists
./package not exists
```

### mkdirp 패키지로 디렉터리 생성 함수 만들기
```typescript
import mkdirp from 'mkdirp';
import {fileExists} from './fileExists';

export const mkdir = (dirname: string): Promise<string> =>
    new Promise(async (resolve, reject) => {
        const alreadyExists = await fileExists(dirname)
            alreadyExists ? resolve(dirname) : 
                mkdirp(dirname).then(resolve).catch(reject)
    })
```

#### 테스트 파일 생성
```typescript
import {mkdir} from '../fileApi/mkdir';

const makeDataDir = async(dirname: string) => {
    let result = await mkdir(dirname)
    console.log(`'${result}' dir created`) // './data/today' dir created
}

makeDataDir('./data/today')
```

#### 실행 명령 코드
```typescript
ts-node ./src/test/mkdir-test.ts   
```

#### 실행결과

./data/today 디렉터리가 생성된다

src/fileApi/rmdir.ts
### rimraf 패키지로 디렉터리 삭제 함수 만들기
```typescript
import rimraf from 'rimraf'
import {fileExists} from './fileExists'

export const rmdir = (dirname: string): Promise<string> =>
    new Promise(async(resolve, reject) => {
    const alreadyExists = await fileExists(dirname)
        !alreadyExists ? resolve(dirname) : 
        rimraf(dirname, error => error ? reject(error) : resolve(dirname))
})
```
#### 테스트 파일 생성
src/test/rmdir-test.ts
```typescript
import {rmdir} from '../fileApi/rmdir'

const deleteDataDir = async (dir) => {
    const result = await rmdir(dir)
    console.log(`'${result}' dir deleted.`) // './data/today' dir deleted.
}
deleteDataDir('./data/today')
```

#### 테스트 파일 실행 코드
```typescript
ts-node ./src/test/rmdir-test.ts
```

### fs.writeFile API로 파일 생성하기

#### 파일 생성 함수 writeFile 생성

src/file/writeFile.ts
```typescript
import * as fs from 'fs'

export const writeFile = (filename: string, data: any): Promise<any> =>
    new Promise((resolve, reject) => {
        fs.writeFile(filename, data, 'utf8', (error: Error) => {
            error ? reject(error) : resolve(data)
    })
})
```

#### ./data 디렉터리를 생성하고 hello.txt와 test.json 파일을 writeFile 함수로 생성하는 코드

src/test/writeFile-test.ts
```typescript
import * as path from 'path'
import {writeFile} from '../fileApi/writeFile'
import {mkdir} from '../fileApi/mkdir'
import mkdirp = require('mkdirp')

const writeTest = async(filename: string, data: any) => {
    const result = await writeFile(filename, data)
    console.log(`write ${result} to ${filename}`)
}

mkdir('./data')
    .then(s => writeTest('./data/hello.txt', 'hello world'))
    .then(s => writeTest('./data/test.json', JSON.stringify({name: 'Jack', age: 32}, null, 2)))
    .catch((e: Error) => console.log(e.message))
```

#### writeFile-test.ts 파일 실행 코드
```typescript
ts-node src/test/writeFile-test.ts
```

#### 실행결과
./data 디렉터리와 hello.txt, test.json 파일을 생성한다.
```typescript
write hello world to ./data/hello.txt
write {
  "name": "Jack",
  "age": 32
} to ./data/test.json
```

#### fs.readFile API로 파일 내용 읽는 함수 생성

src/fileApi/readFile.ts
```typescript
import * as fs from 'fs'

export const readFile = (filename: string): Promise<any> => 
    new Promise<any>((resolve, reject) => {
        fs.readFile(filename, 'utf8', (error: Error, data: any) => {
            error ? reject(error) : resolve(data)
     })
})
```

#### readFile 함수 테스트 파일 생성

src/test/readFile-test.ts
```typescript
import {readFile} from '../fileApi/readFile'

const readTest = async(filename: string) => {
    const result = await readFile(filename)
    console.log(`read '${result}' from ${filename} file.`)
}

readTest('./data/hello.txt')
    .then(s => readTest('./data/test.json'))
    .catch((e: Error) => console.log(e.message))
```

#### readFile API 테스트 코드
```typescript
ts-node ./src/test/readFile-test.ts
```

#### 실행결과
```typescript
read 'hello world' from ./data/hello.txt file.
read '{
  "name": "Jack",
  "age": 32
}' from ./data/test.json file.
```

### fs.appendFile API로 기존 파일 내용에 내용 추가하기

src/fileApi/appendFile.ts
```typescript
import * as fs from 'fs'

export const appendFile = (filename: string, data: any): Promise<any> => 
    new Promise((resolve, reject) => {
    fs.appendFile(filename, data, 'utf8', (error: Error) => {
        error ? reject(error) : resolve(data)
    })
})
```

#### appendFile 함수 테스트 파일 생성

src/test/appnedFile-test.ts
```typescript
import * as path from 'path'
import {appendFile} from '../fileApi/appendFile'
import {mkdir} from '../fileApi/mkdir'

const appendTest = async(filename: string, data: any) => {
    const result = await appendFile(filename, data) 
    console.log(`append ${result} to ${filename}`)
}

mkdir('./data')
    .then(s => appendTest('./data/hello.txt', 'Hi there!'))
    .catch((e: Error) => console.log(e.message))
```

#### 테스트 실행 코드
```typescript
ts-node ./src/test/appendFile-test.ts
```

#### 테스트 코드 실행 결과
```typescript 
append Hi there! to ./data/hello.txt
```
### fs.unlink API로 파일 삭제하기

#### ./data 디렉터리와 ./data 파일에 생성된 hello.txt 파일과 test.json 파일을 삭제하는 deleteFile 파일 생성
src/fileApi/deleteFile.ts
```typescript
import * as fs from 'fs'
import {fileExists} from './fileExists'

export const deleteFile = (filename: string): Promise<string> =>
    new Promise<any>(async(resolve, reject) => {
    const alreadyExists = await fileExists(filename)
    !alreadyExists ? resolve(filename) : 
        fs.unlink(filename, (error: Error) => error ? reject(error) : resolve(filename))
})
```

#### deleteFile 함수 테스트 파일 생성

src/test/deleteFile-test.ts
```typescript
import {deleteFile} from '../fileApi/deleteFile'
import {rmdir} from '../fileApi/rmdir'

const deleteTest = async(filename: string) => {
    const result = await deleteFile(filename) 
    console.log(`delete ${result} file.`)
}
Promise.all([deleteTest('./data/hello.txt'), deleteTest('./data/test.json')])
    .then(s => rmdir('./data'))
    .then(dirname => console.log(`delete ${dirname} dir`))
    .catch((e: Error) => console.log(e.message))
```

#### 테스트 파일 실행 코드
```typescript
ts-node ./src/test/deleteFile-test.ts
```

#### 테스트 파일 실행 결과
```typescript
delete ./data/test.json file.
delete ./data/hello.txt file.
delete ./data dir
```
## 지금까지의 fileApi 코드들을 import 하고 하나의 폴더 ./src/fileApi 에서 export 하는 파일 생성
```typescript
import {fileExists} from './fileExists'
import {mkdir} from './mkdir'
import {rmdir} from './rmdir'
import {writeFile} from './writeFile'
import {readFile} from './readFile'
import {appendFile} from './appendFile'
import {deleteFile} from './deleteFile'

export {fileExists, mkdir, rmdir, writeFile, readFile, appendFile, deleteFile}
```

#### 위의 모든 fileApi들을 import 하는 방법
```typescript
import {fileExists, mkdir, rmdir, writeFile, readFile, appendFile, deleteFile} from './src/fileApi'
```

## 그럴듯한 가짜 데이터 만들기

### 가짜 데이터 (이름, 이메일 주소, 직업, 생년월일, 간단한 프로필(sentence)을 속성으로 포함하는 IFake 인터페이스 생성

src/fake/IFake.ts
```typescript
export interface IFake {
    name: string
    eamil: string
    sentence: string
    profession: string
    birthday: Date
}
```

#### chance 패키지를 사용해 IFake 인터페이스 형태의 데이터를 생성

src/fake/makeFakeData.ts
```typescript
import Chance from 'chance'
import {IFake} from './IFake'

const c = new Chance

export const makeFakeData = (): IFake => ({
    name: c.name(),
    eamil: c.email(),
    profession: c.profession(),
    birthday: c.birthday(),
    sentence: c.sentence(),
})
export {IFake}
```
####
가짜 데이터 만드는 makeFakeData 함수의 테스트 파일 생성

src/test/makeFakeData-test.ts
```typescript
import {makeFakeData, IFake} from '../fake/makeFakeData'

const fakeData: IFake = makeFakeData()
console.log(fakeData)
```

#### 테스트 실행 코드
```typescript
ts-node ./src/test/makeFakeData-test.ts
```

#### 테스트 실행 결과

전에 만든 IFake 인터페이스의 속성에 따른 가짜 데이터가 생성된다 (chance패키지=가짜 데이터 생성 패키지)
```typescript
{
  name: 'Austin Hogan',
  eamil: 'pucenpi@vub.au',
  profession: 'Inside Sales',
  birthday: 2000-04-28T22:12:34.300Z,
  sentence: 'Hu caduvri keif cicuwec edju pog bov dor rehoh vip cavi raregum lace ikrod avaavu rikceh etakiet puf.'
}
```

### Object.keys 와 Object.values 함수를 이용하여 가짜데이터 객체의 속성이름과 값을 분리하여 배열로 저장

src/test/keys-values-test.ts
```typescript
import {IFake, makeFakeData} from '../fake/makeFakeData'

// 객체의 속성이름(keys) 속성값(values)을 분리해주는 자바스크립트의 Object.keys와 Object.values 함수를 이용   
const data: IFake = makeFakeData()
const keys = Object.keys(data)
console.log('keys:', keys)
const values = Object.values(data)
console.log('values:', values)
```

#### 테스트 실행 코드
```typescript
ts-node ./src/test/keys-values-test.ts
```

#### 테스트 결과
```typescript
keys: [ 'name', 'eamil', 'profession', 'birthday', 'sentence' ]
values: [
  'Lester Ross',
  'gahar@tucnoz.ch',
  'Lead Software Test Engineer',
  1991-04-02T08:05:04.479Z,
  'Indif jezaowo odfema pusi laosopi hasubejok holabu vu mog feb awvodob biwzajod zu zekcu jecahogiv zas odo wivfu.'
]
```

### numberOfItems만큼 IFake 객체를 생성하고 속성명과 속성값의 배열을 추출해 filename을 만드는 파일 생성

src/fake/writeCsvFormatFakeData.ts
```typescript
import * as path from 'path'
import {IFake, makeFakeData} from './makeFakeData'
import {mkdir, writeFile, appendFile} from '../fileApi'
import {range} from '../utils/range'

export const writeCsvFormatFakeData = async(filename: string,
    numberOfItems: number): Promise<string> => {
        const dirname = path.dirname(filename)
        await mkdir(dirname)
        const comma = ',', newLine = '\n'
        for(let n of range(numberOfItems)) {
            const fake: IFake = makeFakeData()
            if(n == 0) {
                const keys = Object.keys(fake).join(comma)
                await writeFile(filename, keys)
            }
            const values = Object.values(fake).join(comma)
            await appendFile(filename, newLine + values)
        }
        return `write ${numberOfItems} items to ${filename} file`
    }
```

#### src/fake에 담긴 함수들을 모두 export 하고 import 하는 index.ts 파일 생성

src/fake/index.ts
```typescript
import {IFake, makeFakeData} from './makeFakeData'
import { writeCsvFormatFakeData } from './writeCsvFormatFakeData'

export {IFake, makeFakeData, writeCsvFormatFakeData}
```

#### CSV 파일 포맷으로 IFake 타입 객체를 저장하는 파일 생성
src/writeCsv.ts
```typescript
import { writeCsvFormatFakeData } from "./fake";
import { getFileNameAndNumber } from "./utils/getFileNameAndNumber";

const [filename, numberOfFakeData] = getFileNameAndNumber('./data/fake', 1)
const csvFilename = `${filename}-${numberOfFakeData}.csv`
writeCsvFormatFakeData(csvFilename, numberOfFakeData)
    .then(result => console.log(result))
    .catch((e: Error) => console.log(e.message))
```

#### 테스트 실행 코드
```typescript
ts-node src/writeCsv.ts
```

#### 테스트 코드 실행 결과

package.json이 있는 디렉터리에 data/fake-1.csv 파일이 생성된다.
```typescript
write 1 items to ./data/fake-1.csv file
```
### zip 함수 만들기

#### 객체의 속성명 배열과 속성값 배열을 결합해 객체를 만드는 zip 함수 구현

src/utils/zip.ts
```typescript
export const zip = (keys:string[], values:any[]) => {
    const makeObject = (key:string, value:any) => ({[key]: value})
    const mergeObject = (a:any[]) => a.reduce((sum, val) => ({...sum, ...val}), {})

    let tmp = keys
        .map((key, index) => [key, values[index]])
        .filter(a => a[0] && a[1])
        .map(a => makeObject(a[0], a[1]) )
    return mergeObject(tmp)
}
```
#### utils 폴더안의 함수들을 import하고 index.ts 파일에서 모두 export 하기

src/utils/index.ts
```typescript
import { getFileNameAndNumber, FileNameAndNumber } from "./getFileNameAndNumber";
import {range} from './range'
import {zip} from './zip'

export {getFileNameAndNumber, FileNameAndNumber, range, zip}
```
#### zip 함수 테스트파일 zip-test.ts 파일 생성

src/test/zip-test.ts
```typescript
import {zip} from '../utils'
import {makeFakeData, IFake} from '../fake'
const data = makeFakeData()
const keys = Object.keys(data), values = Object.values(data)

const fake: IFake = zip(keys, values) as IFake
console.log(fake)
```

#### 테스트 실행 코드
```typescript
ts-node ./src/test/zip-test.ts
```

#### 테스트 실행 결과
가짜 데이터가 속성명: 속성값으로 이루어진 IFake 타입 객체로 만들어진다.

```typescript
{
  name: 'Alberta Clarke',
  eamil: 'vo@pow.ec',
  profession: 'Executive Recruiter',
  birthday: 1961-08-15T18:10:09.786Z,
  sentence: 'Gimnalku sidic aho do tewcezsu akgin kivufca koeha cahol wofceg kunciw colhun bawnec gefbolu.'
}
```
