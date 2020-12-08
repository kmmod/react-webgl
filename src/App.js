import {useState} from 'react';
import FileUpload from './components/FileUpload';
import Viewport from './components/Viewport'
import {createBoxData, createGroups} from './core/valuesHandler';
import {surfaceAreaCount} from "./core/sameThickness";
import {writeDataToJson} from "./core/jsonWrite";
import './styles/App.css';

function App() {

  const [boxData, setBoxData] = useState([]);
  const [groupData, setGroupData] = useState([])

  const valuesHandler = (values) => {
    const boxes = createBoxData(values)
    const groups = createGroups(boxes)
    const depthgroups = surfaceAreaCount(boxes, groups);
    writeDataToJson(boxes, groups, depthgroups)
    setBoxData(boxes);
    setGroupData(groups);
  }
  
  return (
    <div className="App">
      <FileUpload onFileChange={valuesHandler}/>
      <Viewport boxData={boxData} groupData={groupData}/>
    </div>
  );
}

export default App;
