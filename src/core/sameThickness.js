export function surfaceAreaCount(boxes, groups) {
  console.time('sameDepthAreaCount');

  const flatgroup = [...new Set(groups.flat(1))];
  const depthgroups = {};
  for (let i = 0; i < flatgroup.length; i++) {
    const box = boxes[flatgroup[i]];
    const sizes = [box.width, box.height, box.depth].sort();
    const depth = sizes[0];
    const area = sizes[1] * sizes[2];
    const current = depthgroups[depth] ? depthgroups[depth] : 0;
    depthgroups[depth] = current + area;

  }
  const result = depthgroups;

  console.timeEnd('sameDepthAreaCount');
  return result; //(7)
}


