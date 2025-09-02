import { Draw } from "./Components";
import "./App.css"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { Triangles } from "./Components/Triangles/Triangles";
import { ThreeColoringTriangles } from "./Components/3ColoringTriangles/3ColoringTriangles";
import { Solution } from "./Components/Solution/Solution";
import { Info } from "./Components/Info/Info";

export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Draw />}></Route>
        <Route path="/triangulation" element={<Triangles />}></Route>        
        <Route path="/info" element={<Info />}></Route>   
        <Route path="/3coloring" element={<ThreeColoringTriangles />}></Route>     
        <Route path="/solution" element={<Solution />}></Route>    
      </Routes>
    </BrowserRouter>
    </>
  );
}
