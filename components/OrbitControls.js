import React, { useRef, useEffect } from "react";
import { extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "../js/three/controls/OrbitControls";

extend({ OrbitControls });

function Controls(props) {
  const { camera, gl } = useThree()
  const controlsRef = useRef()
  /*
  useEffect(() => {
    controlsRef.current.addEventListener('change', function () {      
      if (this.target.y < -10) {
        this.target.y = -10
        camera.position.y = -10
      } else if (this.target.y > 10) {
        this.target.y = 10
        camera.position.y = 10
      }
    })
  }, [])*/

  return <orbitControls ref={controlsRef} 
                        minAzimuthAngle={-Math.PI} 
                        maxAzimuthAngle={Math.PI}  
                        minPolarAngle={-Math.PI} 
                        maxPolarAngle={Math.PI /2} //90 degree
                        minDistance={5}
                        maxDistance={20}
                        enablePan={false} 
                        enableZoom={true} 
                        enableRotate={true} 
                        attach={"orbitControls"}  
                        args={[camera, gl.domElement]} 
          />;
}

export default Controls;