import {IFake, makeFakeData} from '../fake/makeFakeData'

// 객체의 속성이름(keys) 속성값(values)을 분리해주는 자바스크립트의 Object.keys와 Object.values 함수를 이용   
const data: IFake = makeFakeData()
const keys = Object.keys(data)
console.log('keys:', keys)
const values = Object.values(data)
console.log('values:', values)
