import React, { useState,Suspense,useRef,useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, Debug } from '@react-three/cannon'
import { v4 as uuidv4 } from 'uuid';
import css from "../styles/Home.module.css";
import OrbitControls  from "../components/OrbitControls";
import SpotLight from "../components/SpotLight";
import Floor from "../components/Floor";
import Box from "../components/Box";
import DieWrapper from "../components/DieWrapper";
import ScoreSheet from "../components/ScoreSheet";

export default function Home() {

  const [round, setRound] = useState(1)
  const [diceList, setDiceList] = useState([])
  const [diceIndexAvailable,setDiceIndexAvailable] = useState([1,2,3,4,5])
  const [diceSelected,setDiceSelected] = useState([{die:1,active:false},{die:2,active:false},{die:3,active:false},{die:4,active:false},{die:5,active:false}])
  const [score,setScore] = useState({ "Aces":"5","Twos":"10","Threes":"15","Fours":"20","Fives":"25","Sixes":"30",
                                      "TotalScore":"105","Bonus":"35","TotalScoreUpperSection":"140",
                                      "ThreeOfAKind":"30","FourOfAKind":"30","FullHouse":"30","SmStraight":"30","LgStraight":"40",
                                      "Yahtzee":"50","Chance":"30","TotalUpper":"140","TotalLower":"240","Total":"380"
                                    })

  const onDebugBtnClick = () => {
    console.log('ROUND:',round)
    console.log('DICE_LIST:',diceList)
    console.log('DICE_INDEX_AVAILABLE:',diceIndexAvailable)
    console.log('DICE_SELECTION:',diceSelected)    
  }

  async function onRollAllBtnClick () {
    //needs further understanding
    await sleep(20000);
    //
  }

  const onRollBtnClick = () => { 

    const countDiceOnTable = diceList.filter(value => value !== false).length;
    
    if (countDiceOnTable==5 && diceSelected.some(element => element.active === true) && round<3) {
      removeUnSelected()
      setRound(round + 1)
    }
    
    const index = diceIndexAvailable.shift()
    const selectedDie = diceSelected.filter(function (e) {
      return e.die === index;
    })

    if (index && round<=3) {
      setDiceList(diceList.concat(
        <DieWrapper key={uuidv4()} active={selectedDie[0].active} index={index} />
      ));
    }
  }
  
  const onClearBtnClick = () => {
    setDiceList([])
    setDiceIndexAvailable([1,2,3,4,5])
    setDiceSelected([{die:1,active:false},{die:2,active:false},{die:3,active:false},{die:4,active:false},{die:5,active:false}])
    setRound(1)
    console.clear()
  }

  const removeUnSelected = () => {
    
    for (let i=0;i<5;i++){
      
      if(!diceSelected[i].active) {        
        
        diceList.filter((el,index) => { 
          if (el.props.index == diceSelected[i].die) {
            delete diceList[index]
            return true
          }            
        })
        diceSelected[i].active=false;
        diceIndexAvailable.push(i+1);
      }     
    }

    diceList = diceList.filter( e =>String(e).trim() )
  }

  const onClickSelect = (index) => {

    let selectedDie = diceSelected.filter(function (e) {
      return e.die === index;
    })

    diceSelected.find(e => e.die === index).active = !selectedDie[0].active
    setDiceSelected(diceSelected)
    
  }

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  let group = useRef()

  return (
    <div className={css.scene}>
      <div>
        <button disabled={true} onClick={onRollAllBtnClick}>Roll All Dice</button>
        <button onClick={onRollBtnClick}>Roll One Die</button>
        <button onClick={onClearBtnClick}>Clear All Dice</button>
        <button onClick={onDebugBtnClick}>Debug Info Console</button>
        <span className={css.round}>ROUND {round}</span>
        <span className={css.right}><b>HINT</b>: Select the dice you want to keep!</span>
      </div>      
      <ScoreSheet scoreArray={score} />
      <Canvas
        shadows={true}
        className={css.canvas}
        camera={{
          position: [0, 10, 17],
        }}
      >
        <SpotLight />        
        <Physics iterations={6}>          
          <Floor />
          <Box />
          <Suspense fallback={null}>
            <group ref={group} onClick={(e)=>onClickSelect(e.object.index)}>
              {diceList}
            </group>
          </Suspense>
          <OrbitControls />  
        </Physics>        
      </Canvas>
    </div>
  );
}