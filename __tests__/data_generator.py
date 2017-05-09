import json

colors = [1,2,3];
shapes = [0,1,2];
fills = [0,1,2];
numbers = [1,2,3];
"""
no set means every three cards have at least one characteristic
which is not pairwise different or equal
we would like to test having difference on every of 4 characteristics
we would like to test also that it will not be wrongly classified
as wrong if all 3 are equal, so all kinds of equal characteristics
equal at all values
"""
def card(s,c,n,f):
    return {'shape': shapes[s], 'color': colors[c], 'number': numbers[n], 'fill': fills[f]}  
 
def cards_no_set():
    def card(s,c,n,f):
        return {'shape': shapes[s], 'color': colors[c], 'number': numbers[n], 'fill': fills[f]}  
 

    cards = []
    for s in range(2):
        for c in range(2):
            for n in range(2):
                for f in range(2):                
                    cards.append(card(s,c,n,f))
    return cards


def desks_no_set():
    def card(s,c,n,f):
        return {'shape': shapes[s], 'color': colors[c], 'number': numbers[n], 'fill': fills[f]}  
 
    def forbidden(c, forb):
        return c in forb 

    cards = cards_no_set()
 
    added = [card(0,0,2,0)]

    forbidden_lst = [card(0,0,0,0), card(0,0,1,0)]     
    desks = []
    desks.append(cards[:12])
    desks.append(cards[-12:])
    newcards = [c for c in cards if not(forbidden(c, forbidden_lst))][:11]
    newcards += added
    desks.append(newcards) 
    added.append(card(2,1,0,0))        
    forbidden_lst.append(card(0,1,0,0))
    forbidden_lst.append(card(1,1,0,0))
    newcards = [c for c in cards if not(forbidden(c, forbidden_lst))][:10]
    newcards += added
    desks.append(newcards)  
    for d in desks:
        print "len: ", len(d)
 
    return desks


def matching_card(c1,c2):
   
    newcard = [x[0] if x[0] == x[1] else 3 - x[0] - x[1] for x in zip(c1, c2)]
    return newcard

def card_to_list(c):
    return [shapes.index(c['shape']), shapes.index(c['color']), shapes.index(c['number']), shapes.index(c['fill'])]       

""" 
how to make sure a set exists among those cards?
create 4 sets first ?
set with all chars different
set with one char different
set with 2 chars different
wypisze sobie karty w formie tablicy,
strin 3 elementy jakos json.dumps, potem
 
"""
def desks_with_set():
    cards = cards_no_set()  
    desks = []
    c = [
    [0,0,0,0], [1,1,1,1], [2,2,2,2],
    [0,0,0,1], [1,1,2,1], [2,2,1,1],
    [0,0,0,2], [1,1,0,2], [2,2,0,0],
    [1,1,0,1], [1,1,1,0], [1,1,2,2]
    ]
    #c = [card(*x) for x in c]
    desks.append(c)
    for i in range(5):
        c = cards[i:11+i]
        c.append(matching_card(card_to_list(cards[i]), card_to_list(cards[i +1])))
        desks.append(c)
    for d in desks:
        print "len: ", len(d)
    return desks

def create_desks(with_set, no_set):    

    d1 = [[x, True] for x in with_set]
    d2 = [[x, False] for x in no_set]
    return d1 + d2
    
     

def create_sets():
    def card(s,c,n,f):
        return {'shape': shapes[s], 'color': colors[c], 'number': numbers[n], 'fill': fills[f]}  
 
    cards = [
    [0,0,0,0], [1,1,1,1], [2,2,2,2],
    [0,0,0,1], [1,1,2,1], [2,2,1,1],
    [0,0,0,2], [1,1,0,2], [2,2,0,0],
    [1,1,0,1], [1,1,1,0], [1,1,2,2]
    ]

    cards_dict = [card(*x) for x in cards]
    
    
    sets = [
    [[0,1,2],   True],
    [[3,4,5],   True],
    [[6,7,8],   False],
    [[9,10,11], True],
    [[0,3,6],   True],
    [[4,7,10],  True],
    [[2,5,8],   True],
    [[0,3,9],   False],
    [[1,4,7],   False],
    [[2,5,11],  False],
    [[0,4,8],   False],
    [[3,7,11],  False],
    [[9,7,5],   False] 
    ]

    return [sets, cards_dict]




"""
need a way to generate sets that would test failure and success on all possible characteristics
so need to generate good cards.
For now just one setDeskCards, and two more or less random desks for 
setExists
"""

if __name__ == "__main__":


    #f = open('test_data.js', 'w')
    #f.write(setDeskCards_str)
    #f.close()
    cardDesks = create_desks(desks_with_set(), desks_no_set())
    sets, setCardDesk = create_sets() 
    
    #print json.dumps(res1)
    #print json.dumps(sets()) 
    with open('test_data.js', 'w') as f:
            f.write("export const cardDesks = " + json.dumps(cardDesks, sort_keys=True, indent=4) + ";\n")
            f.write("export const setCardDesks = " + json.dumps(setCardDesk, sort_keys=True, indent=4) + ";\n")
            f.write("export const thesets = " + json.dumps(sets, sort_keys=True, indent=4) + ";\n")
 
