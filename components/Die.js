import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Physics, usePlane, useBox } from '@react-three/cannon'

function Die(props) {
  const dice_texture = [
      useLoader(TextureLoader, "textures/dice/dice_1.jpeg"),
      useLoader(TextureLoader, "textures/dice/dice_2.jpeg"),
      useLoader(TextureLoader, "textures/dice/dice_3.jpeg"),
      useLoader(TextureLoader, "textures/dice/dice_4.jpeg"),
      useLoader(TextureLoader, "textures/dice/dice_5.jpeg"),
      useLoader(TextureLoader, "textures/dice/dice_6.jpeg"),
  ];
  const [ref] = useBox(() => ({ 
    mass: 1, 
    onCollide: (e) => console.log(e.target), 
    ...props }))
  const test = (e) => { console.log(e)}

  return (
    <mesh {...props} onClick={test} castShadow receiveShadow ref={ref}>
      <boxGeometry attach="geometry" />      
      <meshStandardMaterial map={dice_texture[0]} attach="material-0" />
      <meshStandardMaterial map={dice_texture[1]} attach="material-1" />
      <meshStandardMaterial map={dice_texture[2]} attach="material-2" />
      <meshStandardMaterial map={dice_texture[3]} attach="material-3" />
      <meshStandardMaterial map={dice_texture[4]} attach="material-4" />
      <meshStandardMaterial map={dice_texture[5]} attach="material-5" />
    </mesh>
  );
}

export default Die;