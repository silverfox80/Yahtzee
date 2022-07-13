import React, { useState,Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, Debug } from '@react-three/cannon'
import { v4 as uuidv4 } from 'uuid';
import css from "../styles/Home.module.css";
import OrbitControls  from "../components/OrbitControls";
import SpotLight from "../components/SpotLight";
import Floor from "../components/Floor";
import Box from "../components/Box";
import Die from "../components/Die";

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
        <SpotLight />        
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