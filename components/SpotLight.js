import React from "react";

function SpotLight(props) {
  return (
    <mesh {...props} >
      <hemisphereLight intensity={1} />
      <spotLight position={[5, 5, 5]} angle={0.75} penumbra={1} intensity={0.5} castShadow shadow-mapSize-width={1028} shadow-mapSize-height={1028} />
    </mesh>
  );
}

export default SpotLight;