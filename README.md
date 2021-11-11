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


