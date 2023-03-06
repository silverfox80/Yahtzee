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

  const empty_score = new Map([['Aces',0],["Twos",0],["Threes",0],["Fours",0],["Fives",0],["Sixes",0],
                               ["TotalUpperNoBonus",0],["Bonus",0],
                               ["ThreeOfAKind",0],["FourOfAKind",0],["FullHouse",0],["SmStraight",0],["LgStraight",0],["Yahtzee",0],["Chance",0],
                               ["TotalUpper",0],["TotalLower",0],["Total",0]])
  //Hooks
  const [round, setRound] = useState(1)
  const [diceList, setDiceList] = useState([])
  const [diceIndexAvailable,setDiceIndexAvailable] = useState([1,2,3,4,5])
  const [diceSelected,setDiceSelected] = useState([ {die:1,active:false,value:0},{die:2,active:false,value:0},{die:3,active:false,value:0},
                                                    {die:4,active:false,value:0},{die:5,active:false,value:0}])
  const [score,setScore] = useState(empty_score)
  const [fixedScore,setFixedScore] = useState(new Map())
  const [allDiceSelected,setAllDiceSelected] = useState(false)
  const [lockScore,setLockScore] = useState(true)
  
  useEffect(() => {
    console.log('fixedScore- Has changed')  
    if (lockScore) return
    resetScore()
    setDiceList([])
    setDiceIndexAvailable([1,2,3,4,5])
    setDiceSelected([{die:1,active:false},{die:2,active:false},{die:3,active:false},{die:4,active:false},{die:5,active:false}])
    setRound(1)    
    localStorage.clear()
    setLockScore(true)
  },[fixedScore]) // <-- the parameter to listen

  useEffect(() => {    
    console.log('allDiceSelected- Has changed')
    if (allDiceSelected) {      
      setLockScore(false)
      calculateScore()      
    } else {
      setLockScore(true)
      resetScore()
    }
  },[allDiceSelected])

  let group = useRef()

  //Event Handlers
  const onDebugBtnClick = () => {
    console.log('ROUND:',round)
    console.log('DICE_LIST:',diceList)
    console.log('DICE_INDEX_AVAILABLE:',diceIndexAvailable)
    console.log('DICE_SELECTION:',diceSelected)
    console.log('DICE_SCORE:',score)
    console.log('DICE_BLOCKED_SCORE:',fixedScore)
    console.log('LOCK SCORESHEET:',lockScore)
  }

  async function onRollAllBtnClick () {
    //needs further understanding
    await sleep(20000);
    //
  }

  const onRollBtnClick = (event) => { 
    //event.target.classList.add(css.test);
    //event.target.disabled = true;
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
    
    resetScore()
    setDiceList([])
    setDiceIndexAvailable([1,2,3,4,5])
    setDiceSelected([{die:1,active:false},{die:2,active:false},{die:3,active:false},{die:4,active:false},{die:5,active:false}])
    setRound(1)    
    
    localStorage.clear()
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
    if (!selectedDie[0].active) localStorage.setItem(`die_${selectedDie[0].die}`,0) //reset local storage value to 0
    diceSelected.find(e => e.die === index).value = localStorage.getItem(`die_${selectedDie[0].die}`);
    /*
    diceSelected.find(e => e.die === index).value = selectedDie[0].active ? 
                                                    localStorage.getItem(`die_${selectedDie[0].die}`) : 
                                                    localStorage.setItem(`die_${selectedDie[0].die}`,0)
                                                    */
    //set state
    setDiceSelected(diceSelected)
        
    checkAllDiceSelected()
  }

  //Helper Functions
  const resetScore = () => {
    // Cycling on Map to reset the score
    score.forEach((value, key) => {
      score.set(key,0)
    })
  }

  const calculateScore = () => {
    let diceFaceRepeated = [0,0,0,0,0,0] //how many 1, how many 2, how many 3....
    let diceValues = [0,0,0,0,0]
    let isTris = false
    let isPoker = false
    let isFullHouse = false
    let isShortStraight = false
    let isFullStraight = false
    let isYahtzee = false
    //chance
    let chance = 0;
    diceSelected.forEach(el => {
      diceValues[(el.die)-1]= (parseInt(el.value))
      chance += parseInt(el.value)
      diceFaceRepeated[(el.value)-1]++
    });
    score.set("Chance",chance)
    //
    diceFaceRepeated.forEach((v,index) => {
      switch(index) {
        case 0:          
          score.set("Aces",v)
          if (score.get("Aces") >= 3) isTris = true
          if (score.get("Aces") >= 4) isPoker = true
          if (score.get("Aces") >= 5) isYahtzee = true
          break
        case 1:
          score.set("Twos",v*2)
          if (score.get("Twos") / 2 >= 3) isTris = true
          if (score.get("Twos") / 2 >= 4) isPoker = true
          if (score.get("Twos") / 2 >= 5) isYahtzee = true
          break
        case 2:
          score.set("Threes",v*3)
          if (score.get("Threes") / 3 >= 3) isTris = true
          if (score.get("Threes") / 3 >= 4) isPoker = true
          if (score.get("Threes") / 3 >= 5) isYahtzee = true
          break
        case 3:
          score.set("Fours",v*4)
          if (score.get("Fours") / 4 >= 3) isTris = true
          if (score.get("Fours") / 4 >= 4) isPoker = true
          if (score.get("Fours") / 4 >= 5) isYahtzee = true
          break
        case 4:
          score.set("Fives",v*5)
          if (score.get("Fives") / 5 >= 3) isTris = true
          if (score.get("Fives") / 5 >= 4) isPoker = true
          if (score.get("Fives") / 5 >= 5) isYahtzee = true
          break
        case 5:
          score.set("Sixes",v*6)
          if (score.get("Sixes") / 6 >= 3) isTris = true
          if (score.get("Sixes") / 6 >= 4) isPoker = true
          if (score.get("Sixes") / 6 >= 5) isYahtzee = true
          break
        default:
          break
      }
    });
    //Tris, Poker, Yahtzee
    score.set("ThreeOfAKind",  isTris ? (chance) : 0)
    score.set("FourOfAKind" ,  isPoker ? (chance) : 0)
    score.set("Yahtzee"     ,  isYahtzee ? 50 : 0)
    //Full House
    if (diceFaceRepeated.includes(3) && diceFaceRepeated.includes(2)) isFullHouse = true
    score.set("FullHouse" , (isFullHouse || isYahtzee) ? 25 : 0)
    
    //Straights
    const zeros = countOccurrences(diceValues,0)
    
    if (zeros == 0) {
      diceValues.sort(function(a, b) {
        return a - b;
      })
      //check full straight
      const differenceAry = diceValues.slice(1).map(function(n, i) { return n - diceValues[i]; })
      const isDifference= differenceAry.every(value => value == 1)
      isFullStraight = isDifference
      //check small straight (4 on 5)
      const uniqArr = diceValues.filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1]
      })
      if(uniqArr.length == 4) {
        //console.log(uniqArr)
        const SMdifferenceAry = uniqArr.sort().slice(1).map(function(n, i) { return n - diceValues[i]; })
        const SMisDifference= SMdifferenceAry.every(value => value == 1)
        isShortStraight = SMisDifference
      }
    }
    
    score.set("SmStraight" , isShortStraight ? 30 : 0)
    score.set("LgStraight" , isFullStraight  ? 40 : 0)

    //console.log(score)
    //console.log(blockedScore)
  }

  const calculateTotal = () => {
    upperScore = parseInt(score.Aces) + parseInt(score.Twos) + parseInt(score.Threes) + parseInt(score.Fours) + parseInt(score.Fives) + parseInt(score.Sixes)
    lowerScore = parseInt(score.ThreeOfAKind) + parseInt(score.FourOfAKind) + parseInt(score.SmStraight) + parseInt(score.LgStraight) + parseInt(score.Yahtzee) + parseInt(score.Chance)
    totalScore = upperScore>=63 ? upperScore+lowerScore+35 : upperScore+lowerScore
    //Upper Score
    score.TotalUpperNoBonus = String(upperScore)
    score.Bonus = upperScore>=63 ? "35" : "0"
    score.TotalUpper = upperScore>=63 ? String(upperScore+35) : upperScore
    //Lower Score
    score.TotalLower = String(lowerScore)
    //Total Score
    score.TotalScore = String(totalScore)
  }

  const checkAllDiceSelected = () => {
    let count = 0;
    Object.values(diceSelected).map(val => {
      if (val['active'])  count++    
    })
    
    count == 5 ?
      setAllDiceSelected(true) :
      setAllDiceSelected(false)
  }

  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  //

  return (
    <div className={css.container}>
      <div className={css.columnRight}>
        <div className={css.controls}>
          <button disabled={true} onClick={onRollAllBtnClick}>Roll All Dice</button>
          <button onClick={onRollBtnClick}>Roll One Die</button>
          <button onClick={onClearBtnClick}>Clear All Dice</button>
          <button onClick={onDebugBtnClick}>Debug Info Console</button>
          <span className={css.round}>ROUND {round}</span>
          <span className={css.right}><b>HINT</b>: Select the dice you want to keep!</span>
        </div>
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
      <div className={css.columnLeft}>
        <ScoreSheet scoreArray={score} confirmedScoreArray={fixedScore} lock={lockScore} onChangeScore={(val)=>setFixedScore(val)} />
      </div>
    </div>
  );
}