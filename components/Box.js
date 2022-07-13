import React from "react";
import { Physics, usePlane, useBox, useCompoundBody } from '@react-three/cannon'
import { useLoader } from "@react-three/fiber";
import { TextureLoader,RepeatWrapping,MirroredRepeatWrapping } from "three";

function Box(props) {
  /* A Compound shape is a shape built out of other shapes called child-shapes. You can see it as a holder of a group of other shapes */
  const [ref] = useCompoundBody(() => ({
    mass: 12,
    ...props,
    /* This is specifying the collision area of each shape */
    shapes: [
      /* Lateral planks*/
      { type: 'Box',   position: [0, 0.5, 10],  rotation: [0, 0, 0],            args: [19, 1, 1] },
      { type: 'Box',   position: [0, 0.5, -10], rotation: [0, 0, 0],            args: [19, 1, 1] },
      { type: 'Box',   position: [10, 0.5, 0],  rotation: [0, Math.PI / 2, 0],  args: [19, 1, 1] },
      { type: 'Box',   position: [-10, 0.5, 0], rotation: [0, Math.PI / 2, 0],  args: [19, 1, 1] },
      /* Edges */
      { type: 'Box',   position: [10,0,-10],    rotation: [ 0, 0, Math.PI / 2], args: [2, 1, 1] },
      { type: 'Box',   position: [-10,0,-10],   rotation: [ 0, 0, Math.PI / 2], args: [2, 1, 1] },
      { type: 'Box',   position: [10,0,10],     rotation: [ 0, 0, Math.PI / 2], args: [2, 1, 1] },
      { type: 'Box',   position: [-10,0,10],    rotation: [ 0, 0, Math.PI / 2], args: [2, 1, 1] },
      /* Mat */
      { type: 'Plane', position: [0, 0, 0],     rotation: [-Math.PI / 2, 0, 0], args: [20, 1, 20]}
    ]
  }))
  
  const texture_edge = useLoader(TextureLoader, "textures/metal/metal_surface_texture_1_by_fantasystock_d2xdbnz.jpg")
  texture_edge.wrapS = MirroredRepeatWrapping;
  texture_edge.repeat.set(2, 1);
  texture_edge.needsUpdate = true;
  const texture_plank = useLoader(TextureLoader, "textures/wood/wood_texture_by_reaperofblood_db3irh.jpg")
  texture_plank.wrapS = MirroredRepeatWrapping;
  texture_plank.repeat.set(19, 1);
  texture_plank.needsUpdate = true;
  const texture_mat = useLoader(TextureLoader, "textures/pooltable/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcHg5MDgxMDUtaW1hZ2Uta3d5bzUwamkuanBn.webp");

  return (
    <group ref={ref}>
      {/* Lateral planks*/}
      <mesh castShadow receiveShadow position={[0,0.5,10]} roughness={0.1}>
        <boxGeometry args={[19,1,1]} />      
        <meshPhysicalMaterial map={texture_plank} color={"white"} />
      </mesh>
      <mesh castShadow receiveShadow position={[0,0.5,-10]}>
        <boxGeometry args={[19,1,1]} />      
        <meshPhysicalMaterial map={texture_plank} color={"white"} />
      </mesh>
      <mesh castShadow receiveShadow position={[10,0.5,0]} rotation={[ 0, Math.PI / 2,0]}>
        <boxGeometry args={[19,1,1]} />      
        <meshPhysicalMaterial map={texture_plank} color={"white"} />
      </mesh>
      <mesh castShadow receiveShadow position={[-10,0.5,0]} rotation={[ 0, Math.PI / 2,0]}>
        <boxGeometry args={[19,1,1]} />      
        <meshPhysicalMaterial map={texture_plank} color={"white"} />
      </mesh>
      {/*  Edges */}
      <mesh castShadow receiveShadow position={[10,0,-10]} rotation={[ 0, 0, Math.PI / 2]}>
        <boxGeometry args={[2,1,1]} />      
        <meshPhysicalMaterial map={texture_edge} color={"white"} />
      </mesh>
      <mesh castShadow receiveShadow position={[-10,0,-10]} rotation={[ 0, 0, Math.PI / 2]}>
        <boxGeometry args={[2,1,1]} />      
        <meshPhysicalMaterial map={texture_edge} color={"white"} />
      </mesh>
      <mesh castShadow receiveShadow position={[10,0,10]} rotation={[ 0, 0, Math.PI / 2]}>
        <boxGeometry args={[2,1,1]} />      
        <meshPhysicalMaterial map={texture_edge} color={"white"} />
      </mesh>
      <mesh castShadow receiveShadow position={[-10,0,10]} rotation={[ 0, 0, Math.PI / 2]}>
        <boxGeometry args={[2,1,1]} />      
        <meshPhysicalMaterial map={texture_edge} color={"white"} />
      </mesh>
      {/* Mat */}
      <mesh receiveShadow castShadow position={[0,0,0]} rotation={[-Math.PI / 2, 0, 0]} >
        <planeGeometry args={[20, 20] } />
        <meshPhysicalMaterial map={texture_mat} color={"white"} reflectivity={0.1}/>
      </mesh>
    </group>
  )
}

export default Box;