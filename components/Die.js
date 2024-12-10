import React, {useEffect, useRef, useState} from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useBox } from '@react-three/cannon'

function Die(props) {
  
  const [active, setActive] = useState(props.active)
  
  const dice_texture = [
      useLoader(TextureLoader, "textures/dice/dice_1.jpeg"),
      useLoader(TextureLoader, "textures/dice/dice_2.jpeg"),
      useLoader(TextureLoader, "textures/dice/dice_3.jpeg"),
      useLoader(TextureLoader, "textures/dice/dice_4.jpeg"),
      useLoader(TextureLoader, "textures/dice/dice_5.jpeg"),
      useLoader(TextureLoader, "textures/dice/dice_6.jpeg"),
  ]
  
  const radians_to_degrees = (radians) => {  
    let degrees = Array(0,0,0);
    for (let i = 0; i<3; i++) {
      degrees[i] = ( Math.round(radians[i] * (180 / Math.PI)) + 180 ) % 360  //normalized
    }
    return degrees;
  }

  const check_dice = (rot_triplet) => {
    //console.log(rot_triplet)
    let retval = "undefined"
    switch (rot_triplet[0]) {
      case (0):
        retval = rot_triplet[2]==0 ? 3 : (rot_triplet[2]==90 ? 1 : (rot_triplet[2]==180 ? 4 : 2))
        break;
      case (90):
        retval = rot_triplet[1]==180 ? 5 : "undefined"
        break;
      case (180):
        retval = rot_triplet[2]==0 ? 4 : (rot_triplet[2]==90 ? 2 : (rot_triplet[2]==180 ? 3 : 1))
        break;
      case (270):
        retval = rot_triplet[1]==180 ? 6 : "undefined"
        break;
      default:
        break;
    }
    return retval
  }

  const [ref,api] = useBox(() => ({ 
    mass: 2, 
    //onCollide: (e) => console.log(`Object ${e.target.uuid} collided with the following speed (x,y,z) : ${velocity.current}`), 
    ...props 
  }))

  const getInfo = () => { 
    setActive(!active)
    !active?api.mass.set(20):api.mass.set(2)  //make it ten times heavier when selected so that other dice will collide with it without moving it
    //console.log(`The die (${props.index}) with position ${pos.current} has value ${check_dice(radians_to_degrees(rot.current))} and has been ${!active?'selected':'unselected'}`)      
    window.localStorage.setItem(`die_${props.index}`,check_dice(radians_to_degrees(rot.current)))
  }

  const velocity = useRef([0, 0, 0])
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v))
    return unsubscribe
  }, [])

  const rot = useRef([0, 0, 0])
  useEffect(() => {
    const unsubscribe = api.rotation.subscribe((r) => (rot.current = r))
    return unsubscribe
  }, [])

  const pos = useRef([0, 0, 0])
  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => (pos.current = p))
    return unsubscribe
  }, [])

  return (
    <mesh 
      {...props} 
      onClick={getInfo}
      castShadow 
      receiveShadow 
      ref={ref}
      rotation={rot}
      position={pos}
    >
      <boxGeometry attach="geometry" />      
      <meshStandardMaterial map={dice_texture[0]} attach="material-0" color={active ? "skyblue" : "white"}/>
      <meshStandardMaterial map={dice_texture[1]} attach="material-1" color={active ? "skyblue" : "white"}/>
      <meshStandardMaterial map={dice_texture[2]} attach="material-2" color={active ? "skyblue" : "white"}/>
      <meshStandardMaterial map={dice_texture[3]} attach="material-3" color={active ? "skyblue" : "white"}/>
      <meshStandardMaterial map={dice_texture[4]} attach="material-4" color={active ? "skyblue" : "white"}/>
      <meshStandardMaterial map={dice_texture[5]} attach="material-5" color={active ? "skyblue" : "white"}/>
    </mesh>
  );
}

export default Die;