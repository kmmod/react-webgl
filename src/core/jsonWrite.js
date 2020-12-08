export function writeDataToJson(boxes, groups, depthgroups) {
  const elements = boxes.map(item => {
    return `{"${item.id}": {"id": ${item.id},"x0": ${item.x0}, "y0": ${item.y0}, "z0": ${item.z0}, "x1": ${item.x1}, "y1": ${item.y1}, "z1": ${item.z1}}`
  }).join()
  console.log(elements)
  console.log('groupdID : boxesID[]', groups)
  console.log('boxDepth : areaSum', depthgroups)
}