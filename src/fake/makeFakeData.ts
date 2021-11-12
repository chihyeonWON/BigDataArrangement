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