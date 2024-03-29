import { FC, useState,useEffect } from "react"
import { article,outline } from "../api/search_utils/literature_utils"
import '../styles/components.css'


interface props{
  query:string
}



const Article:FC<props> = ({query}) =>{
  const [lrOutput,setLrOutput] = useState('')
  const [generating,setGenerateState] = useState<boolean>(false)
  const [outlinee,setGenerateoutline] = useState<boolean>(false)
  const [outline_o,setOut] = useState('')
  const [isarxiv,setIsarxiv] = useState<boolean>(false)
  const [refs,setRefs] = useState([])
  const handleGenerateButton = ()=>{
    setLrOutput('')
    setGenerateState(true)
  }
  const handleGenerateoutlie = ()=>{
    setLrOutput('')
    setGenerateoutline(true)
  }
  /*
  const handleKeyDown = (event: React.KeyboardEvent) => {
    console.log("uiooi");
    //setLrOutput(event.currentTarget.textContent || '');
    setLrOutput(document?.querySelector('.output-lr')?.textContent)
    console.log(lrOutput);
 };*/
 const handleEditorChange = (event: React.ChangeEvent<HTMLParagraphElement>) => {
  const value = event.target.textContent || '';
  setLrOutput(value);
  console.log(value); // This will log the updated value
 };
 
  useEffect(()=>{
    try{
    if(generating){
      const fetchLR = async ()=>{
        setOut(lrOutput)
        const response = await article(query,refs,outline_o,isarxiv)
        setLrOutput(response.data)
        setOut('')
        setRefs([])
        setIsarxiv(false)
      }
      fetchLR()
    }}
     catch(error){
      if (error instanceof Error) {
        setLrOutput(error.message);
      } else {
        setLrOutput('An unknown error occurred');
      }
    } finally {
      setGenerateState(false)
    }
  
 } ,[generating, query,refs,outline_o,isarxiv])
 useEffect(()=>{
  try{
  if(outlinee){
    const fetchLR = async ()=>{
      const response = await outline(query)
      setLrOutput(response.data.outline)
      setOut(response.data.outline)
      setRefs(response.data.refs)
      setIsarxiv(response.data.arxiv)
    }
    fetchLR()
  }}
   catch(error){
    if (error instanceof Error) {
      setLrOutput(error.message);
    } else {
      setLrOutput('An unknown error occurred');
    }
  } finally {
    setGenerateoutline(false)
  }

} ,[outlinee, query,refs,isarxiv])
  return (
    <>
    <h1>Article</h1>
    <section>
          <button className="gener-lr" onClick={handleGenerateButton}>Generate</button>
          <button className="gener-lr" onClick={handleGenerateoutlie}>Generate outline</button>
          </section>
          <div className="output-lr" onInput={handleEditorChange} contentEditable='true'>{lrOutput}</div>

        </>
  )
}

export default Article