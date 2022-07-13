import React from "react";
import { Physics, usePlane, useBox } from '@react-three/cannon'

function Floor(props) {

  const [ref] = usePlane(() => ({ position:[0,-1,0], rotation: [-Math.PI / 2, 0, 0], ...props }))

  return (
    <mesh {...props} receiveShadow ref={ref}>
      <planeGeometry args={[50, 50]} />
      <meshPhysicalMaterial color={"black"} />
    </mesh>
  );
}

export default Floor;