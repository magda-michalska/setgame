import { verifySet, setExists, cartesianProduct, potentialSets, addMoreCards, addCards } from '../game_functions';
import {cardDesks, thesets, setCardDesks} from './test_data.js'


cardDesks.forEach((el, i) => {
    test('verify if there exists a set in '.concat(JSON.stringify(el[0]), i), () => {
        //console.log(el[0]);
        expect(setExists(el[0])).toEqual(el[1]);
    })
})
/*test('verify if there exists a set', () => { 
        cardDesks.forEach((el) => {
        expect(setExists(el[0])).toEqual(el[1]);
        })
});*/


test('verify if 3 cards are a set ', () => {
    thesets.forEach((el) => {
        expect(verifySet(el[0], setCardDesks)).toEqual(el[1]);
    }) 
});
