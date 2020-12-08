import {useEffect, useRef} from "react";
import {useScene} from "babylonjs-hook";
import {Color3, MeshBuilder, StandardMaterial, Vector3} from "@babylonjs/core";

const Boxes = (props) => {
  const boxRef = useRef();
  const scene = useScene();

  useEffect(() => {
    if (scene !== null) {
      const boxdef = MeshBuilder.CreateBox("box", {size: 1}, scene);
      boxdef.position = new Vector3(-0.5,-0.5,-0.5);
      boxdef.renderingGroupId = 2;
      boxdef.isPickable = true;
      const boxmat = new StandardMaterial('mat', scene);
      boxmat.diffuseColor = new Color3(0.8,0.5,0.1);
      boxmat.alpha = 0.3;
      boxdef.material = boxmat;

      for (let i = 0; i < props.list.length; i++) {
        const item = props.list[i];
        const newInstance = boxdef.createInstance(item.id);
        newInstance.position = new Vector3(item.posX, item.posY, item.posZ);
        newInstance.scaling = new Vector3(item.width, item.height, item.depth);
      }

      boxdef.setEnabled(false);

      boxRef.current = boxdef;
      return () => {
        boxdef?.dispose();
      }
    }
  }, [props.list])

  return null
}

export default Boxes;