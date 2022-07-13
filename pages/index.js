import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, Debug } from '@react-three/cannon'
import css from "../styles/Home.module.css";
import Floor from "../components/Floor";
import Box from "../components/Box";
import Die from "../components/Die";
import LightBulb from "../components/LightBulb";
import OrbitControls  from "../components/OrbitControls";
import {Suspense} from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {

  const randomVal = () => {
      return [  Math.floor(Math.random() * 8 * Math.PI / 4) , 
                Math.floor(Math.random() * 8 * Math.PI / 4) ,
                Math.floor(Math.random() * 8 * Math.PI / 4) ];
  }

  const [diceList, setDiceList] = useState([]);

  const onAddBtnClick = event => {    
    setDiceList(diceList.concat(
      <Die key={uuidv4()} position={[0, 15, 0]} rotation={randomVal()} />
    ));
  };

  const onClearBtnClick = event => {
    setDiceList([])
    console.clear()
  };

  const onCountBtnClick = event => {
    diceList.forEach(element => {      
      console.log(element)
    });
  }
  
  return (
    <div className={css.scene}>
      <button onClick={onAddBtnClick}>Add dice</button>
      <button onClick={onClearBtnClick}>Clear dice</button>
      <button onClick={onCountBtnClick}>Count dice</button>
      <Canvas
        shadows={true}
        className={css.canvas}
        camera={{
          position: [0, 10, 15],
        }}
      >
        <ambientLight color={"white"} intensity={0.3} />
        <LightBulb position={[10, 50, 10]} />
        <Physics iterations={6}>          
          <Floor />
          <Box />
          <Suspense fallback={null}>
            {diceList}
          </Suspense>
          <OrbitControls />  
        </Physics>        
      </Canvas>
    </div>
  );
}