import React, { useState,Suspense,useRef,useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from '@react-three/cannon'
import { v4 as uuidv4 } from 'uuid';
import OrbitControls  from "../components/OrbitControls";
import SpotLight from "../components/SpotLight";
import Floor from "../components/Floor";
import Box from "../components/Box";
import DieWrapper from "../components/DieWrapper";
import ScoreSheet from "../components/ScoreSheet";
import GameOverModal from "../components/GameOverModal"
import {INITIAL_SCORE} from "../constants/score"

export default function Home() {
  // initialize state setting
  const initializeState = () => ({
    round: 0,
    diceList: [],
    diceIndexAvailable: [1, 2, 3, 4, 5],
    diceSelected: Array.from({ length: 5 }, (_, i) => ({
      die: i + 1,
      active: false,
      value: 0,
    })),
    score: new Map(INITIAL_SCORE),
    fixedScore: new Map(),
    allDiceSelected: false,
    lockScore: true,
    isRollDisabled: false,
    openDialog: false
  });
  
  const [state, setState] = useState(initializeState);
  
  // Monitoring state variables, when they change, useEffect will trigger
  useEffect(() => { 
    //if (state.lockScore) return
    //console.log('Call reset when fixedScore changes')
    setState((prevState) => {
      const { diceList,diceIndexAvailable,diceSelected,round,lockScore,allDiceSelected,score } = prevState;
      return {
        ...prevState,
        diceList: [],
        diceIndexAvailable: [1,2,3,4,5],
        diceSelected: [{die:1,active:false},{die:2,active:false},{die:3,active:false},{die:4,active:false},{die:5,active:false}],
        round: 0,
        lockScore: true,
        allDiceSelected: false,
        isRollDisabled: false,
        score: INITIAL_SCORE
      };
    });
    localStorage.clear()
    checkEndConditions()
  },[state.fixedScore]) // <-- the parameter to listen

  useEffect(() => {    
    setState((prevState) => {
      const { lockScore } = prevState;
      return {
        ...prevState,
        lockscore: state.allDiceSelected?false:true,
      };
    });
    state.allDiceSelected? calculateScore() : resetScore();

  },[state.allDiceSelected]) // <-- the parameter to listen
  
  // References
  let group = useRef()
  const countdownRef = useRef(0) // Ref for the countdown value
  const timerRef = useRef(null)  // Ref for the timer ID

  // EVENT HANDLERS
  const onRollAllBtnClick = async (e,activate) => {
    //
    disableRollWithTimer(5) //Disable Roll for 5 seconds

    // Check selection      
    if (countDiceOnTable()==5 && state.round<3) {
      await removeUnSelected()        
    }

    const availableDice = 5 - countDiceSelected()
    // Re-Roll only unselected die/dice
    for (var i=0;i<availableDice;i++) {
      dieRoll()
      await sleep(500); //wait half second between one die and the other, to avoid collisions on air
    }   
    //
  }
  const handleScoreChange = (updatedScore) => {
    setState((prevState) => {
      const { fixedScore } = prevState;
      return {
        ...prevState,
        fixedScore: new Map(updatedScore)
      };
    });
  }
  const openDialogBox = () => {
    setState((prevState) => {
      const { openDialog } = prevState;
      return {
        ...prevState,
        openDialog: true
      };
    });
  }
  // Helper Functions
  const calculateScore = () => {
    const diceFaceCounts = Array(6).fill(0);
    const diceValues = state.diceSelected.map((d) => d.value);
    diceValues.forEach((value) => {
      if (value > 0) diceFaceCounts[value - 1]++;
    });

    const newScore = new Map(state.score);

    // Basic Scoring
    ["Aces", "Twos", "Threes", "Fours", "Fives", "Sixes"].forEach(
      (category, i) => newScore.set(category, diceFaceCounts[i] * (i + 1))
    );

    // Special Scores
    const chance = diceValues.reduce((sum, val) => sum + val, 0);
    const isTris = diceFaceCounts.some((count) => count >= 3);
    const isPoker = diceFaceCounts.some((count) => count >= 4);
    const isYahtzee = diceFaceCounts.some((count) => count === 5);
    const isFullHouse = diceFaceCounts.includes(3) && diceFaceCounts.includes(2);
    const isShortStraight = hasStraight(diceValues, 4);
    const isFullStraight = hasStraight(diceValues, 5);

    newScore.set("Chance", chance);
    newScore.set("ThreeOfAKind", isTris ? chance : 0);
    newScore.set("FourOfAKind", isPoker ? chance : 0);
    newScore.set("Yahtzee", isYahtzee ? 50 : 0);
    newScore.set("FullHouse", isFullHouse ? 25 : 0);
    newScore.set("SmStraight", isShortStraight ? 30 : 0);
    newScore.set("LgStraight", isFullStraight ? 40 : 0);

    setState((prevState) => ({ ...prevState, score: newScore }));
  }
  const checkEndConditions = () => {
    //console.log("checkEndConditions:"+state.fixedScore.size)
    if (state.fixedScore.size == 18) { 
      //console.log("checkEndConditions met requisites")
      openDialogBox()
      setState((prevState) => {
        const { isRollDisabled } = prevState;
        return {
          ...prevState,
          isRollDisabled: true
        };
      });
    }
  }
  const countDiceSelected = () => {
    return (state.diceSelected).filter(value => value.active !== false).length
  }
  const countDiceOnTable = () => {
    return (state.diceList).filter(value => value !== false).length
  }
  const disableRollWithTimer = (timeInSeconds) => {
    
    if (state.round==3) return false

    //Disable Roll temporarily
    setState((prevState) => {
      const { isRollDisabled, round } = prevState;
      return {
        ...prevState,
        isRollDisabled: true,
        round: round+1
      };
    });
    countdownRef.current = timeInSeconds; // Set countdown duration to 5 seconds)
    //
    // Start a timer for the disabling
    timerRef.current = setInterval(() => {
      countdownRef.current -= 1;
      if (countdownRef.current <= 0) {
        clearInterval(timerRef.current); // Clear the timer
        timerRef.current = null; // Reset the timer ref
        
        

        setState((prevState) => {
          const { isRollDisabled,round } = prevState;
          return {
            ...prevState,
            isRollDisabled: round>2 ? true : false
          };
        }); //Re-enable after countdown
        
      }
    }, 1000);
  }
  const hasStraight = (values, length) => {
    const uniqueSorted = [...new Set(values)].sort((a, b) => a - b);
    let count = 1;
    for (let i = 1; i < uniqueSorted.length; i++) {
      count = uniqueSorted[i] === uniqueSorted[i - 1] + 1 ? count + 1 : 1;
      if (count >= length) return true;
    }
    return false;
  }
  const removeUnSelected = async () => {
    setState((prevState) => {
      const { diceList, diceIndexAvailable, diceSelected } = prevState;
      let dia = diceIndexAvailable
      let ds = diceSelected
      const dl = diceList
      

      for (let i=0;i<5;i++){
        
        if(!ds[i].active) {  //if die has not been selected      
          
          dl.filter((el,index) => {  //find it in the list
            if (el.props.index == ds[i].die) {
              delete dl[index] //and remove it from the diceList
              return true
            }            
          })
          //ds[i].active=false;
          dia.push(i+1); //set the die as available
        }     
      }
      console.log("Again available index:"+dia)
      return {
        ...prevState,
        diceSelected: ds,
        diceList:dl.filter( e =>String(e).trim() ),
        diceIndexAvailable: dia,
        
      };
    })
  }
  const resetScore = () => {
    // Cycling on Map to reset the score
    setState((prevState) => {
      const { score } = prevState;
      return {
        ...prevState,
        score: INITIAL_SCORE
      };
    });
  }
  const restartGame = () => {  
    setState(initializeState())
    localStorage.clear()
    console.clear()
  }
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const toggleDieSelection = (index) => {
    setState((prevState) => {
      const diceSelected = [...prevState.diceSelected];
      const die = diceSelected.find((d) => d.die === index);
      die.active = !die.active;
      if (!die.active) {
        localStorage.setItem(`die_${die.die}`, 0); // Reset value
      } else {
        die.value = parseInt(localStorage.getItem(`die_${die.die}`)) || 0;
      }
      return {
        ...prevState,
        diceSelected,
        allDiceSelected: diceSelected.every((d) => d.active),
      };
    });
  }

  // Business Logic for die rolling
  const dieRoll = () => {
    
    setState((prevState) => {
      const { round, diceList, diceIndexAvailable, diceSelected } = prevState;
      
      let dl = diceList;
      let dia = diceIndexAvailable;
      const ds = diceSelected;

      const index = dia.shift()
      //console.log("dieRoll index: "+index)
      const selectedDie = ds.filter(function (e) {
        //console.log(e.die)
        return e.die === index;
      })

      if (index && round<=3) {
        //console.log("dieRoll concat")
        dl=dl.concat(
          <DieWrapper key={uuidv4()} active={selectedDie[0].active} index={index} />
        );      
      }

      return {
        ...prevState,
        diceList: dl,
        diceIndexAvailable: dia,
      };
    });
    
  }

  return (
    <div className="container">
      <div className="columnRight">
        <div className="controls">
          <button className="roll" disabled={state.isRollDisabled} onClick={onRollAllBtnClick}>Roll Dice</button>
          <button className="restart" onClick={openDialogBox}>Restart</button>   
          <span className="round" style={{visibility: state.round ? 'visible' : 'hidden' }}>ROUND { state.round }</span>
          <div className="selectedDiceDisplay">
          {state.diceSelected.map((el, index) => 
            el?.value && el.active==true ? ( // Only render if el.value exists and the die is selected
              <span 
                key={el.id || index} 
                className={`face_${el.value}`} 
                aria-label={`Dice showing ${el.value}`}
              ></span>
            ) : null // Skip rendering if el.value doesn't exist
          )}
          </div>          
          <span className="right"><b>HINT</b>: Select the die you want to keep. <br/>Select all dice to set your score. Good luck!</span>
        </div>
        <Canvas
          shadows={true}
          className="canvas"
          camera={{
            position: [0, 10, 17],
          }}
        >
          <SpotLight />        
          <Physics iterations={6}>          
            <Floor />
            <Box />
            <Suspense fallback={null}>
              <group ref={group} onClick={(e)=>toggleDieSelection(e.object.index)}>
                {state.diceList}
              </group>
            </Suspense>
            <OrbitControls />  
          </Physics>        
        </Canvas>
      </div>
      <div className="columnLeft">
        <ScoreSheet 
          confirmedScoreArray={state.fixedScore}
          scoreArray={new Map(state.score)}
          onChangeScore={handleScoreChange} 
        />
      </div>
      <GameOverModal
        open={state.openDialog}
        onClose={restartGame}
        score={state.fixedScore}
      >
      </GameOverModal>
    </div>
  );
}

//