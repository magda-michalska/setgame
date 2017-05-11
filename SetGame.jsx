import React from 'react';
import classNames from 'classnames';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import cssobj from 'cssobj';
import {cartesianProduct, verifySet, potentialSets, addMoreCards, addCards, setExists} from './game_functions';
import './setstyles.less';

class SetGame extends React.Component {
/* 

    cardList -- list of cards not presented yet
    deskCards -- list of cards on the desk
    geussedSets -- number of guessedSets
    set -- list of cards to verify if that's a set
    lastSet -- if it's coorect, we need to remove those cards from desk list and add new 

    generation of cardList:
        3 features, 3 colors, 3 shapes, 3 fills?
    */
    
    constructor(){
        super();
        let colors = [1,2,3];
        let shapes = [0,1,2];
        let fills = [0,1,2];
        let numbers = [1,2,3];
        let cardList = this.shuffle(this.generate([shapes, colors, numbers, fills]));
        console.log(cardList); 
        let deskCards = cardList.splice(0,12);
        console.log(deskCards);
        this.state = {
            cardList: cardList,
            deskCards: deskCards,
            set: [],
            correct: true,
            inProgress: true,
            finished: false,
            score: 0,
            lastSet: [],
            setExistsMessage: false,
            endMessage: false
        }

    }
    
    componentWillUpdate(){
        console.log("GAME UPDATE");
    }

    generate(arr){
        let cart = cartesianProduct(arr);
        return cart.map(function(el){
            return {
                shape: el[0],
                color: el[1],
                number: el[2],
                fill: el[3]
            }
        })
    }


    shuffle(array) {
        let m = array.length, t = null, i = null;
        while (m) {
                i = Math.floor(Math.random() * m--);
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }

        return array;
    }


    /* i -- index of card in deskCards. When cicked, we want to make her border thicker
        and enlarge current set. 
        If already clicked -- unclick
        If set full -- change last clicked to this one 
        Actually -- first version will be that if we click 3 then it's submitted */

    handleClick(i){
         
        if  (this.state.set.length == 2 && this.state.set.indexOf(i) == -1){       
            /* this is a final click - we will mark card and run validate */
            let set = this.state.set.slice();
            set.push(i);
            let win = verifySet(set, this.state.deskCards);
            let deskCards = this.state.deskCards.slice();
            let cardList = this.state.cardList.slice();  
            
            if (win) {
                let res = addCards(set, deskCards, cardList);
                deskCards = res[0];
                cardList = res[1]; 
            }
            
            let lastSet = set.slice();
            set = [];
            this.setState({set:set, inProgress:false, correct:win, lastSet:lastSet, deskCards:deskCards, cardList:cardList});            
        }
        
        else if (this.state.set.length < 2 && this.state.set.indexOf(i) == -1){
            /* add another card to set */
            let set = this.state.set.slice();
            set.push(i);
            this.setState({set: set, inProgress:true, setExistsMessage:false});

        }
        else if (this.state.set.length <= 2 && this.state.set.indexOf(i) != -1){
            /* unclick an already clicked card*/
            let set = this.state.set.slice();
            let idx = set.indexOf(i);
            set.splice(idx,1);
            this.setState({set: set, inProgress:true, setExistsMessage:false});
        } 
        return;
    }
   
    handleNoSetClick(){
        let result = setExists(this.state.deskCards);
        if (result){
            this.setState({setExistsMessage: true});
            return;
        }
        
        if (this.state.cardList.length == 0){
            this.setState({endMessage:true});
            return;
        }
        let newVals = addMoreCards(this.state.deskCards, this.state.cardList);
        
        this.setState({deskCards:newVals[0], cardList:newVals[1]}); 
        
        
    }
    arrMin(arr){
        return arr.reduce((prev, next) => Math.min(prev, next), 100);
    }
    arrMax(arr){
        return arr.reduce((prev, next) => Math.max(prev, next), -1);
    }

    render() {

        return (
            <Desk  
            cardList = {this.state.deskCards}
            cols = {this.props.cols}
            set = {this.state.set}
            onClick={ (i) => this.handleClick(i)}
            finished = {this.state.finished}
            correct = {this.state.correct}
            score = {this.state.score}     
            inProgress = {this.state.inProgress}
            setExistsMessage = {this.state.setExistsMessage}
            noSetClick = {()=> this.handleNoSetClick()}
            endMessage = {this.state.endMessage}
            />
        );
    }
};

SetGame.propTypes = {
    /* number of cards */
    cards: PropTypes.number,
    /* number cols to present on the table */
    cols: PropTypes.number,
    /* number of rows to present on the table */
    rows: PropTypes.number

}

SetGame.defaultProps = {
    cards: 81,
    cols: 3,
    rows: 4
}

class Desk extends React.Component{
/* Desk needs also a metadata componenet wih:
score
time
good / wrong
a button to add or remove cards
*/

    
    componentWillUpdate(){
        console.log("DESK UPDATE");
    }
    render(){
        let table = []
        let rows = this.props.cardList.length/this.props.cols;
        let newrow = null
        for (let j = 0; j < rows; j++){
            newrow = [];
            for(let i = 0;i<this.props.cols;i++) 
                newrow.push(this.props.cardList[this.props.cols*j + i]);
            table.push(newrow);
        }
        
        let rw = table.map((r,i) => {
            
            let cl = r.map((c, j) => {
                if (this.props.set.indexOf(i*this.props.cols + j) != -1){
                    return <td><Card key={i*this.props.cols + j} selected={true} {...c} onClick={(e)=>this.props.onClick(i*this.props.cols + j)} /></td>    
                }
                else{
                    return <td><Card key={i*this.props.cols + j} selected={false} {...c} onClick={(e)=>this.props.onClick(i*this.props.cols + j)}/></td>    

                }
            }

            );
            return <tr>{cl}</tr>
        }
        
        );

        return (
            <div id="desk-container" >
            <ControlBoard 
                score={this.props.score} 
                correct={this.props.correct} 
                inProgress={this.props.inProgress} 
                finished={this.props.finished}
                setExistsMessage={this.props.setExistsMessage}
                noSetClick={() => this.props.noSetClick()}
                endMessage={this.props.endMessage}
            />
            <table className="desk">
                {rw}
            </table>
            </div>
        );
    };

}
       
Desk.propTypes = {
        /* 12 elements list containint cards descriptions 
        sample cardList [{shape:1, color:1, number:1, fill:1} ]*/
        cardList: PropTypes.array,
        cols: PropTypes.number,
        set: PropTypes.array,
        onClick: PropTypes.func
        
    };

Desk.defaultProps = {
        cardList: [[{shape:1, color:1, number:1, fill:1} , {shape:1, color:1, number:2, fill:1}, {shape:1, color:1, number:3, fill:1}] ],
        cols: 3
        
}; 

class ControlBoard extends React.Component{
/* presents score, good / bad status, button to continue 
unless this button is pressed the set is still full
first version -- no button, jut it's not a Set, try again -- 
the borders are delicate, they disappear after firs cick,
and the caption disappears as well
Good Set! and new cards on the board, new cards marked by delicate lines, until person chooses first set
old cards visible until some card clicked

 */

    render(){
        let msg = this.props.correct ? "Correct SET! :-)": "It's not a SET :-(";
        msg = this.props.finished ? "The End" : msg;
        //style = isSet ? "color: green": "color:red";
        const message = classNames({
            'message': true,
            'hidden':this.props.inProgress,
            'red': !this.props.correct,
            'green':this.props.correct

        });
        const hint = classNames({   
            'red': true,
            'hidden': !this.props.setExistsMessage
        }
        )
        const end = classNames({
            'green': true,
            'hidden': !this.props.endMessage
        }
        )
        return (
            <div className="control-board" >
                <h1 className="title"  id="Title">Game of SET</h1>
                <p className="rules"> <i>(Click <a href="https://en.wikipedia.org/wiki/Set_(game)">here</a> for rules)</i></p>
                <br/>
                <h4 className={message}>
                    {msg}
                </h4>
                <div className="hint-button">
                    <button type="button" className="button" onClick={this.props.noSetClick}>I think there is no set</button>
                    <br/>
                
                    <h5 className={hint}>SET exists among these cards!</h5>
                    <h5 className={end}>Congratulations! You have found all SETs!</h5>

                </div>
            </div>
        )

    }

}


ControlBoard.propTypes = {


}
class Card extends React.Component {
    componentWillUpdate(){
        console.log("CARD UPDATE");
    }
    shoudlCoponentUpdate(nextProps){
        console.log(nextPropd);
        return true;
    }
        
    render() {
        let className=classNames({
            'card': true,
            'selected':this.props.selected,
            'not-selected':!this.props.selected
        });
        let symbols = Array(this.props.number).fill().map((_, i) => <Symbol {...this.props} />) 
        return (
            <div className={className} onClick={this.props.onClick}>
               { symbols }                 
            </div>
        )
    }
}

Card.propTypes = {
        /* Symbol has a shapes array. it's the index of shape */
        shape: PropTypes.number,
        /* Symbol has a colors array. it's the index of the color.
            This needs to be consistent with colors defined as less variables in setvariables.less */
        color: PropTypes.number,
        /* Symbol has a fill types array (e.g. stripes, full, empty), and it's an index.*/
        fill: PropTypes.number,
        /* how many Symbols will be presented */
        number: PropTypes.number,
        /* is part of current set selection? */
        selected: PropTypes.bool,
        onClick: PropTypes.func

    };

Card.defaultProps = {
            shape: 1,
            color: 1,
            fill: 1,
            number: 1,
            selected: false
    };    
 
class Symbol extends React.Component {

/*
div ze stylem ma klase reprezentujaca ze to tlo
ale pobiera kolor i rodzaj wypelnienia
div z ksztaltem ma klase w zaleznosci od koloru

*/

   render() {
        const colors=['#ff1a1a', '#00b300', '#cc99ff'];
        let color = colors[this.props.color - 1];


       /* To be render linear gradient correctly in various browsers I need to use proefixes. */ 
/*        const stripesStyle={
            'backgroundImage': '-moz-linear-gradient(left, '.concat(color, ' 50%, transparent 50%); ', 
            'backgroundImage: linear-gradient(0deg, '.concat(color ,' 50%, transparent 50%)') )

        }*/

        const stripesStyle = {}
        const emptyStyle={
            'background': 'transparent'
        }
        const colorStyle={
            'background': color
        }
     
        const fillStyles=[emptyStyle, stripesStyle, colorStyle];
        const shapes = ['ellipse', 'rect', 'diamond']
        const shapeClass = shapes[this.props.shape].concat(this.props.color) 
    
        const stripesClass = 'stripes'.concat(this.props.color)       
  
        return (
        <div className={stripesClass} style={fillStyles[this.props.fill]}>
            <div className={shapeClass}  ></div>
        </div>)
    }
}

Symbol.propTypes = {
        /* Symbol has a shapes array. it's the index of shape */
        shape: PropTypes.number,
        /* Symbol has a colors array. it's the index of the color.
            This needs to be consistent with colors defined as less variables in setvariables.less */
        color: PropTypes.number,
        /* Symbol has a fill types array (e.g. stripes, full, empty), and it's an index.*/
        fill: PropTypes.number
    };
Symbol.defaultProps = {
            shape: 1,
            color: 1,
            fill: 1
    };

 
//let times = (n) => {
//	return (f) => {
//		Array(n).fill().map((x, i) => f(i));
//	};
//};

render(<SetGame/>, document.getElementById('SetGame'))
