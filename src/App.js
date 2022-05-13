import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Section } from "./components/section";
import "./App.scss";
//Components
import Header from "./components/header";

import { Html, useGLTFLoader } from "drei";
import state from "./components/state";

import { useInView } from "react-intersection-observer";

const Model = ({ modelPath, name }) => {
  const gltf = useGLTFLoader(modelPath, true);
  if (name === "baltoy") {
    return (
      <primitive object={gltf.scene} dispose={null} scale={[20, 20, 20]} />
    );
  } else if (name === "boppin") {
    return (
      <primitive object={gltf.scene} dispose={null} scale={[50, 50, 50]} />
    );
  } else
    return (
      <primitive object={gltf.scene} dispose={null} scale={[1.5, 1.5, 1.5]} />
    );
};

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[0, 10, 0]} intensity={1.5} />
      <spotLight intensity={1} position={[1000, 0, 0]} />
    </>
  );
};

const HTMLContent = ({
  children,
  modelPath,
  position,
  domContent,
  bgColor,
  name,
}) => {
  const ref = useRef(null);
  useFrame(() => (ref.current.rotation.y += 0.01));

  const [refItem, inView] = useInView({ threshold: 0 });

  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  }, [inView]);
  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, position, 0]}>
        <mesh ref={ref} position={[0, -30, 0]}>
          <Model modelPath={modelPath} name={name} />
        </mesh>
        <Html portal={domContent} fullscreen>
          <div className="container" ref={refItem}>
            {children}
          </div>
        </Html>
      </group>
    </Section>
  );
};

export default function App() {
  const domContent = useRef();
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);

  useEffect(() => {
    void onScroll({ target: scrollArea.current });
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <Canvas colorManagement camera={{ position: [0, 0, 120], fov: 70 }}>
          <Lights />
          <Suspense fallback={null}>
            <HTMLContent
              domContent={domContent}
              modelPath="/whimsicott_pokemon/scene.gltf"
              position={250}
              bgColor={"#F59BAD"}
            >
              <h1 className="title">Whimsicott</h1>
            </HTMLContent>
            <HTMLContent
              name="baltoy"
              domContent={domContent}
              modelPath="/baltoy_pokemon/scene.gltf"
              position={0}
              bgColor={"#778BBE"}
            >
              <h1 className="title">Baltoy</h1>
            </HTMLContent>
            <HTMLContent
              name="boppin"
              domContent={domContent}
              modelPath="/boppin_ariados/scene.gltf"
              position={-250}
              bgColor={"#71BC68"}
            >
              <h1 className="title">Boppin</h1>
            </HTMLContent>
          </Suspense>
        </Canvas>
        <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
          <div style={{ position: "sticky", top: 0 }} ref={domContent}></div>
          <div style={{ height: `${state.sections * 100}vh` }}></div>
        </div>
      </div>
    </>
  );
}
