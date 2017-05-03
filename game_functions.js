

export function verifySet(set, deskCards){
    /* for each position of card values in all cards have to be the same all different 
        initially set is a list of Card objects
        we need to transform it into ist of lists */
    /* [[1,2,3, 4], [5,6,7,8]] => [[1,5], [2,6], ...]  */
        /* [{shape fill color ...}]*/
 
        let setList = Array(4).fill(null);
        setList[0] = set.map((el, i) => deskCards[el].color);
        setList[1] = set.map((el, i) => deskCards[el].fill);
        setList[2] = set.map((el, i) => deskCards[el].shape);
        setList[3] = set.map((el, i) => deskCards[el].number);

      
        let result = setList.map((els, i) => {
            return (((els[0] != els[1]) && (els[1] != els[2] )&& (els[0] != els[2])) || ((els[0] == els[1]) && (els[0] == els[2]) ));
        }
        ).reduce((prev, next) => prev && next, true) 
        return result;
}

export function setExists(deskCards){
        
        /* just a response whether a set exists or not */
        let indices = potentialSets(deskCards);
        return indices.map((el,i) => {
            return this.verifySet(el, deskCards)
        }).reduce((prev, next) => prev || next, false);
        
    }
 
    
export function cartesianProduct(arr)
    {
            return arr.reduce(function(a,b){
                return a.map(function(x){
                    return b.map(function(y){
                        return x.concat(y);
                    })
                }).reduce(function(a,b){ return a.concat(b) },[])
            }, [[]])
    }

/* generate all 3-elements subsequencies of arr */

export function potentialSets(arr){
    let n = arr.length;
    return arr.map((el, i) => {
        if (i < n - 2)
        return arr.map((el2, j) => {
            if (j > i && j < n - 1)
                return arr.map((el3, k) => {
                    if (k > j) return [el, el2, el3]
                }).filter((el) => el)
        
        }).filter((el) =>  el )

      
    }).reduce((prev, next) => {
            return prev.concat(next);}, 
        []).reduce((prev,next)=> prev.concat(next), []).filter((el)=>el); 
}

 
