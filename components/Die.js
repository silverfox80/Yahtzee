import React, {useEffect, useRef, useState, forwardRef} from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useBox } from '@react-three/cannon'

const Die = (props) => {
  
  const [active, setActive] = useState(props.active)
  const [dieValue, setDieValue] = useState("undefined");
  const [hasStopped, setHasStopped] = useState(false); // To track if the die has stopped


  const diceTextures = useLoader(TextureLoader, [
    "textures/dice/dice_1.jpeg",
    "textures/dice/dice_2.jpeg",
    "textures/dice/dice_3.jpeg",
    "textures/dice/dice_4.jpeg",
    "textures/dice/dice_5.jpeg",
    "textures/dice/dice_6.jpeg",
  ]);
  
  
  const radiansToDegrees = (radians) => {  
    let degrees = Array(0,0,0);
    for (let i = 0; i<3; i++) {
      degrees[i] = ( Math.round(radians[i] * (180 / Math.PI)) + 180 ) % 360  //normalized
    }
    return degrees;
  }

  const checkDice = (rotTriplet) => {

    const [x, y, z] = rotTriplet;

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

  const [ref,api] = useBox(() => ({ 
    mass: 2, 
    //onCollide: (e) => console.log(`Object ${e.target.uuid} collided with the following speed (x,y,z) : ${velocity.current}`), 
    ...props 
  }))

  const getInfo = () => { 
    // Invert selection
    setActive(!active)
    // Adjust mass based on active state
    api.mass.set(active ? 2 : 20); //make it ten times heavier when selected so that other dice will collide with it without moving it
  }

  // Unified ref for position, rotation, and velocity
  const dieState = useRef({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    velocity: [0, 0, 0],
  })

  useEffect(() => {
  const unsubPosition = api.position.subscribe((p) => {
    dieState.current.position = p;
    
  });
  const unsubRotation = api.rotation.subscribe((r) => {
    dieState.current.rotation = r;
    
  });
  const unsubVelocity = api.velocity.subscribe((v) => {
    dieState.current.velocity = v;

    const speed = Math.sqrt(
      v[0] ** 2 + v[1] ** 2 + v[2] ** 2
    );

    if (speed < 0.01 && !hasStopped) {
      setHasStopped(true);
      const rotationInDegrees = radiansToDegrees(dieState.current.rotation);
      const value = checkDice(rotationInDegrees);
      setDieValue(value);
      window.localStorage.setItem(`die_${props.index}`, value);
    } else if (speed >= 0.01 && hasStopped) {
      setHasStopped(false);
    }
  });

  return () => {
    unsubPosition();
    unsubRotation();
    unsubVelocity();
  };
}, [api,hasStopped]);

  return (
    <mesh 
      {...props} 
      onClick={getInfo}
      castShadow 
      receiveShadow 
      ref={ref}
      rotation={dieState.current.rotation}
      position={dieState.current.position}
    >
      <boxGeometry attach="geometry" />    
      {diceTextures.map((texture, index) => (
        <meshStandardMaterial
          key={index}
          map={texture}
          attach={`material-${index}`}
          color={active ? "skyblue" : "white"}
        />
      ))}  
    </mesh>
  )
}

export default Die