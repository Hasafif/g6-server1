import { FC, useState,useEffect } from "react"
import { searchAndProcess } from "../api/search_utils/literature_utils"
import '../styles/components.css'


interface props{
  query:string
}



const LiteratureReview:FC<props> = ({query}) =>{
  const [lrOutput,setLrOutput] = useState('')
  const [style,setStyle] = useState('apa')
  const [generating,setGenerateState] = useState<boolean>(false)
  const handleGenerateButton = ()=>{
    setLrOutput('')
    setGenerateState(true)
  }
  const handleSelectedStyle = (e: React.ChangeEvent<HTMLSelectElement>)=>{
    setStyle(e.target.value)
  }
  useEffect(()=>{
    try{
    if(generating){
      const fetchLR = async ()=>{
        const response = await searchAndProcess(query,style)
        setLrOutput(response.data)
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
  
 } ,[generating, query, style])
 
  return (
    <>
    <h1>Literature Review</h1>
    <section>
  <select onChange={handleSelectedStyle} value={style}  className="cite-lr">
            <option value="" disabled selected>Citation Type</option>
            <option value="apa">APA</option>
            <option value="ieee">IEEE</option>
            <option value="mla">MLA</option>
            <option value="ama">AMA</option>
            <option value="asa">ASA</option>
            <option value="aaa">AAA</option>
            <option value="apsa">APSA</option>
            <option value="mhra">MHRA</option>
            <option value="oscola">OSCOLA</option>
          </select>
          <button className="gener-lr" onClick={handleGenerateButton}>Generate</button>
          </section>
            <p className="output-lr">{lrOutput}</p>
        </>
  )
}

export default LiteratureReview