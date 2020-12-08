import React, {useEffect, useState} from 'react';
import {
  ArcRotateCamera,
  Color3,
  DirectionalLight,
  HemisphericLight,
  MeshBuilder,
  Vector3
} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import style from "../styles/Viewport.module.css"
import {GridMaterial} from "@babylonjs/materials";
import Boxes from "./Boxes";
import Groups from "./Groups";

const onSceneReady = scene => {

  const canvas = scene.getEngine().getRenderingCanvas();
  scene.clearColor = new Color3(0.9, 0.9, 0.9);

  var camera = new ArcRotateCamera("camera1", Math.PI * 2, Math.PI / 3, 50, Vector3.Zero(), scene);
  camera.lowerRadiusLimit = 25;
  camera.minZ = 0.01;
  camera.speed = 0.1;
  camera.wheelPrecision = 10;
  camera.wheelDeltaPercentage = 0.01;
  camera.panningSensibility = 50
  camera.attachControl(canvas, true);

  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  var sun = new DirectionalLight("sunlight", new Vector3(-1, -1, -1), scene);
  sun.position = new Vector3(2, 2, 2);
  sun.intensity = 0.4;

  const ground = MeshBuilder.CreateGround("ground", {width: 1000, height: 1000}, scene);
  const gridMat = new GridMaterial('gridmat', scene)
  gridMat.lineColor = new Color3(0.4, 0.7, 0.9);
  gridMat.mainColor = new Color3(0.4, 0.7, 0.9);
  gridMat.opacity = 0.8;

  ground.material = gridMat;
  ground.material.backFaceCulling = false;
  ground.renderingGroupId = 1;

  scene.onPointerDown = (e, pickResult) => {
    if (pickResult.hit) {
      console.log('Picked mesh: ' + pickResult.pickedMesh.name);
    }
  }
}


export default function Viewport(props) {

  const [boxList, setBoxList] = useState([])
  const [groupList, setGroupList] = useState([])

  useEffect(() => {
    setBoxList(props.boxData)
  }, [props.boxData])

  useEffect(() => {
    setGroupList(props.groupData)
  }, [props.groupData])

  return (
    <div className={style.container}>
      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        id='my-canvas'>

        <Boxes list={boxList}/>
        <Groups list={groupList}/>

      </SceneComponent>
    </div>
  )
}