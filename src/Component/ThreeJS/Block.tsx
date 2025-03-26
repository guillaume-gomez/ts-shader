import { Mesh } from 'three';
import { TextureLoader } from 'three';
import { useRef, useEffect, useState, RefObject } from 'react';
import useAudioData from "./Hooks/useAudioData";
import { useLoader, extend } from '@react-three/fiber';
import TiltShiftMaterial from "../Shaders/TiltShiftMaterial";


// to notify to three-js (it will not work without)
extend({ TiltShiftMaterial })

function Block() {
	const width = 1;
	const height = 1
	const meshSize = 128;
	
	return (
		<mesh
	      position={[0,0,0]}
	    >
	      <boxGeometry args={[width, height, 0.1, meshSize, meshSize, 1]} />
	      <meshStandardMaterial attach="material-0" color="brown" emissive="#000000" roughness={0} metalness={0} />
	      <meshStandardMaterial attach="material-1" color="red" emissive="#000000" roughness={0} metalness={0} />
	      <meshStandardMaterial attach="material-2" color="green" emissive="#000000" roughness={0} metalness={0} />
	      <meshStandardMaterial attach="material-3" color="purple" emissive="#000000" roughness={0} metalness={0} />
	      <tiltShiftMaterial
	        attach="material-4"
	        wireframe={wireframe}
	        uTexture={texture}
	        uAmplitude={amplitude}
	        uFilter={filter}
	        uInvertColor={invertColor}
	      />
	      <meshStandardMaterial attach="material-5" color="orange" />
	      </mesh>
	)
} 
export default Block;