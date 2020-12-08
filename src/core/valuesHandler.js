export function createBoxData(data) {
  console.time('createBoxData');
  const boxdata = data.map((item) => ({
      id: item[0],
      posX: item[4] - ((item[4] - item[1]) * 0.5),
      posY: item[5] - ((item[5] - item[2]) * 0.5),
      posZ: item[6] - ((item[6] - item[3]) * 0.5),
      width: item[4] - item[1],
      height: item[5] - item[2],
      depth: item[6] - item[3],
      x0: item[1],
      y0: item[2],
      z0: item[3],
      x1: item[4],
      y1: item[5],
      z1: item[6],
      group: null
    }
  ));
  console.timeEnd('createBoxData');
  return boxdata;
}

var groupHandler = {
  grouplist: [],
  set groups(id) {
    this.grouplist = id;
  },
  get groups() {
    return this.grouplist;
  }
}

export function createGroups(boxes) {
  console.time('createGroups');
  groupHandler.grouplist = [];
  const planes = createCommonPlanes(boxes);

  for (let i = 0; i < boxes.length; i++) {
    const planeX = planes.planeX[boxes[i].x0]
    const planeY = planes.planeY[boxes[i].y0]
    const planeZ = planes.planeZ[boxes[i].z0]
    if (planeX) proximityCheck(i, boxes, planeX, 'y', 'z')
    if (planeY) proximityCheck(i, boxes, planeY, 'x', 'z')
    if (planeZ) proximityCheck(i, boxes, planeZ, 'y', 'x')

  }
  console.timeEnd('createGroups');
  const sorted = sortGroupOrder(groupHandler.groups, boxes)
  return sorted;
}


function createCommonPlanes(boxes) {
  console.time('createCommonPlanes');
  const planes = {
    planeX: {},
    planeY: {},
    planeZ: {},
  };

  for (let i = 0; i < boxes.length; i++) {
    const item = boxes[i];
    const id = item.id;
    const arrayX = planes.planeX[item.x1];
    const arrayY = planes.planeY[item.y1];
    const arrayZ = planes.planeZ[item.z1];
    planes.planeX[item.x1] = Array.isArray(arrayX) ? [...arrayX, id] : [id];
    planes.planeY[item.y1] = Array.isArray(arrayY) ? [...arrayY, id] : [id];
    planes.planeZ[item.z1] = Array.isArray(arrayZ) ? [...arrayZ, id] : [id];
  }
  console.timeEnd('createCommonPlanes');
  return planes;
}


function proximityCheck(id, boxes, plane, axis0, axis1) {
  const a = boxes[id];
  function contains(a, b) {
    if (a[axis0 + 0] >= b[axis0 + 1]) return false;
    if (a[axis0 + 1] <= b[axis0 + 0]) return false;
    if (a[axis1 + 0] >= b[axis1 + 1]) return false;
    if (a[axis1 + 1] <= b[axis1 + 0]) return false;
    return true;
  }

  for (let i = 0; i < plane.length; i++) {
    const b = boxes[plane[i]];
    if (contains(a, b)) {
      groupCandidateCheck(a, b);
    }
  }
  return null;
}


function groupCandidateCheck(a, b) {
  let grouplist = groupHandler.groups;

  if (!b.group && a.group) {
    let boxes = grouplist[a.group];
    if (intersectionCheck(b, boxes)) {
      return null;
    } else {
      b.group = a.group;
      boxes.push(b.id);
      grouplist[a.group] = boxes;
      groupHandler.groups = grouplist;
      return
    }
  }

  if (b.group && !a.group) {
    let boxes = grouplist[b.group];
    if (intersectionCheck(a, boxes)) {
      return null;
    } else {
      a.group = b.group;
      boxes.push(a.id);
      grouplist[b.group] = boxes;
      groupHandler.groups = grouplist;
      return
    }
  }

  if (!b.group && !a.group){
    const id = grouplist.length;
    a.group = id;
    b.group = id;
    grouplist[id] = [a.id, b.id];
    groupHandler.groups = grouplist;
  }
}


function intersectionCheck(box, boxes) {

  const a = box;

  function overlap(a,b) {
    if(a.x0 < b.x1 && a.y0 < b.y1 && a.z0 < b.z1
      && (a.x1 > b.x0 || a.y1 > b.y0 || a.z1 > b.z0)){
      return false;
    }
  }

  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];

    if (overlap(a ,b)){
      return true;
    }
  }
}


function sortGroupOrder(groups, boxes) {
  console.time('sortGroupOrder');
  const volumes = []
  for (let i = 0; i < groups.length; i++) {
    const minX = Math.min(...groups[i].map(item => boxes[item].x0));
    const minY = Math.min(...groups[i].map(item => boxes[item].y0));
    const minZ = Math.min(...groups[i].map(item => boxes[item].z0));
    const maxX = Math.min(...groups[i].map(item => boxes[item].x1));
    const maxY = Math.min(...groups[i].map(item => boxes[item].y1));
    const maxZ = Math.min(...groups[i].map(item => boxes[item].z1));
    const width = maxX - minX;
    const height = maxY - minY;
    const depth = maxZ - minZ;
    const volume = width * height * depth;
    volumes.push({volume, i});
  }
  const sorted = volumes.sort((a,b) => (a.volume < b.volume) ? 1 : -1).map(item => groups[item.i]);
  console.timeEnd('sortGroupOrder');
  return sorted;
}


