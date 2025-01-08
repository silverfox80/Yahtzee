import React, { useState, useCallback } from "react";
import Die from "./Die";

/* 
   The DieWrapper component is a wrapper around the Die component, 
   adding randomness to its initial position and rotation, along with managing the active state.
*/
const DieWrapper = ({ active, index, onDieStateChange, ...rest }) => {

  const randomVal = useCallback(() => {
    return [
      Math.floor((Math.random() * 8 * Math.PI) / 4),
      Math.floor((Math.random() * 8 * Math.PI) / 4),
      Math.floor((Math.random() * 8 * Math.PI) / 4),
    ];
  }, [])

  const randomPosition = useCallback(() => {
    const range = 5; // Range for random position
    return [
      Math.random() * range * 2 - range, // Random value between -range and range
      15, // Fixed height for initial position
      Math.random() * range * 2 - range,
    ];
  }, [])

  return (
    <Die
      onStateChange={onDieStateChange}
      index={index}
      position={randomPosition()}
      rotation={randomVal()}
      {...rest}
    />
  )
}

export default DieWrapper