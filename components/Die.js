import React, {useEffect, useRef, useState} from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useBox } from '@react-three/cannon'

const Die = ({onStateChange,...props}) => {
  
  const [dieState, setDieState] = useState({  index: props.index, 
                                              isActive: false, 
                                              dieValue: "undefined", 
                                              hasStopped: false
                                            })
  
  // Update specific properties of dieState
  const updateDieState = (updates) => {
    setDieState(prevState => ({
      ...prevState,
      ...updates
    }));
  };
  
  const dieStatePrev = useRef(null)

  const diceTextures = useLoader(TextureLoader, [
    "textures/dice/dice_1.jpeg",
    "textures/dice/dice_2.jpeg",
    "textures/dice/dice_3.jpeg",
    "textures/dice/dice_4.jpeg",
    "textures/dice/dice_5.jpeg",
    "textures/dice/dice_6.jpeg",
  ])
  
  const radiansToDegrees = (radians) =>
    radians.map((radian) => Math.round(((radian * (180 / Math.PI) + 180)) % 360)); //approximate within 10 degrees

  const checkDice = (rotTriplet) => {

    const [x, y, z] = rotTriplet;
    //console.log(rotTriplet)
    const faceMapping = {
      "0,0": 3,
      "0,90": 1,
      "0,180": 4,
      "0,270": 2,
      "90,180": 5, // Correctly maps Y-axis rotation for this case
      "180,0": 4,
      "180,90": 2,
      "180,180": 3,
      "180,270": 1,
      "270,180": 6, // Correctly maps Y-axis rotation for this case
    };

    // Use both X-axis and Y/Z-axis rotations as needed
    if (x === 90 && y === 180) return 5; // Special case for 90° X-rotation with 180° Y-rotation
    if (x === 270 && y === 180) return 6; // Special case for 270° X-rotation with 180° Y-rotation

    // Fall back to the mapping based on X and Z
    return faceMapping[`${x},${z}`] || "undefined";
  }

  const [meshRef,api] = useBox(() => ({ 
    mass: 2, 
    //onCollide: (e) => console.log(`Object ${e.target.uuid} collided with the following speed (x,y,z) : ${velocity.current}`), 
    ...props 
  }))

  const toggleSelection = () => { 
    
    if (isNaN(dieState.dieValue)) return
    // Invert selection
    updateDieState({ isActive: !dieState.isActive });
    // Adjust mass based on active state
    api.mass.set(dieState.isActive ? 2 : 10); //make it ten times heavier when selected so that other dice will collide with it without moving it
    //
  }

  // Unified ref for position, rotation, and velocity
  const diePhysicState = useRef({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    velocity: [0, 0, 0],
  })

  useEffect(() => {
  const unsubPosition = api.position.subscribe((p) => {
    diePhysicState.current.position = p;
    
  });
  const unsubRotation = api.rotation.subscribe((r) => {
    diePhysicState.current.rotation = r;
    
  });
  const unsubVelocity = api.velocity.subscribe((v) => {
    diePhysicState.current.velocity = v;

    const speed = Math.sqrt(
      v[0] ** 2 + v[1] ** 2 + v[2] ** 2
    );
    
    const minSpeedTolerance = 0.15 
    //speed is never completely 0 because the Die will vibrate in contact with the floor
    if (speed < minSpeedTolerance && !dieState.hasStopped) {   
      //console.log(`Die ${props.index} has its speed under the tolerance`)
      const rotationInDegrees = radiansToDegrees(diePhysicState.current.rotation)
      const value = checkDice(rotationInDegrees)
      if (value!=="undefined") {
        console.log(`Die ${props.index} stopped and its calculated value is ${value}`)
        updateDieState({ dieValue: value, hasStopped: true })
      } 
      // else {
      //   console.log(`it was not possible to determine its value`)
      // }
    } 
  });

  return () => {
    unsubPosition();
    unsubRotation();
    unsubVelocity();
  };
}, [api,dieState.hasStopped]);

  useEffect(() => {
    // console.log("Previous State",dieStatePrev.current )
    // console.log("Actual State",dieState )
    if (dieState.hasStopped && dieState.dieValue !== "undefined" && dieStatePrev.current !== dieState) {
      //console.log("Die stopped and has the following values:");
      dieStatePrev.current = dieState
      onStateChange?.(dieState);
    }
  }, [dieState]);

  return (
    <mesh 
      {...props} 
      onClick={toggleSelection}
      castShadow 
      receiveShadow 
      ref={meshRef}
      rotation={diePhysicState.current.rotation}
      position={diePhysicState.current.position}
    >
      <boxGeometry attach="geometry" />    
      {diceTextures.map((texture, index) => (
        <meshStandardMaterial
          key={index}
          map={texture}
          attach={`material-${index}`}
          color={dieState.isActive ? "skyblue" : "white"}
        />
      ))}  
    </mesh>
  )
}

export default Die