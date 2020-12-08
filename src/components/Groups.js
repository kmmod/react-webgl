import {useEffect, useRef} from "react";
import {useScene} from "babylonjs-hook";
import {Color3, MeshBuilder, StandardMaterial} from "@babylonjs/core";


const Groups = (props) => {
  const groupRef = useRef([]);
  const scene = useScene();

  useEffect(() => {
    if (scene !== null) {

      const items = []

      for (let i = 0; i < props.list.length; i++) {
        const group = props.list[i];
        const colorR = Math.random();
        const colorG = Math.random();
        const colorB = Math.random();
        group.map(item => {
          const node = scene.getNodeByName(item);
          if (node) {
            node?.setEnabled(false);
            const boxnode = MeshBuilder.CreateBox(node.name, {size: 1}, scene);
            boxnode.position = node.position;
            boxnode.scaling = node.scaling;
            boxnode.renderingGroupId = 2;
            boxnode.showBoundingBox = true;
            const boxmat2 = new StandardMaterial('mat', scene);
            boxmat2.diffuseColor = new Color3(colorR, colorG, colorB);
            boxmat2.alpha = 1;

            boxnode.material = boxmat2;
            node.dispose();
            items.push(boxnode);

          }
        })
      }
      groupRef.current = items;
      return () => {
        groupRef?.current.map(item => item.dispose());
      }
    }
  }, [props.list])

  return null
}

export default Groups;