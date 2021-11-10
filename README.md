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

## 명령
```typescript
ts-node ./src/test/getFileNameAndNumber-test.ts data/fake.csv 100000
```

## 실행결과
```typescript
data/fake.csv 100000
```
