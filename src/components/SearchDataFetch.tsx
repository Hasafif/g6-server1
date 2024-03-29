import {FC,ReactNode,useState, useEffect } from "react";
import { searchInSemantic } from '../api/search_utils/semantic'
import searchInArxiv from "../api/search_utils/arxiv";
import { searchInArchive } from '../api/search_utils/archive'
import Result from './Result'
import '../styles/components.css'
import { resData } from "../api/search_utils/types";


interface props{
  query:string,
  isSearching:boolean,
  searchEngine:string,
  onFetch:(data:unknown)=>void,
}

const SearchDataFetch:FC<props> = ({ query, isSearching, searchEngine,onFetch }) => {
  const [data, setData] = useState<unknown>(null)
  const [error, setError] = useState('')
  const [loading,setLoading] = useState(false)
  useEffect(() => {
    if (isSearching) {
      const fetchData = async () => {
        try {
          setLoading(true)
         let response:unknown = ''
          switch (searchEngine) {
            case 'semantic':
              response = await searchInSemantic(query)
              break;
            case 'arxiv':
               response = await searchInArxiv(query)
               break;
             case 'archive':
               response = await searchInArchive(query)
               break;
            default:
              response = await searchInSemantic(query)
          }
          onFetch(response)
          setData(response)
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [isSearching, query, searchEngine,onFetch])
if(error){
  return <div className="fetch-container">{error}</div>
}
if(loading){
  return <div className="fetch-container">Searching...</div>
}

return (
    <div className="fetch-container">
      {data as ReactNode && (
        <div>
          {(data as resData[]).map((item:resData) => < Result key={item.id} value={JSON.stringify(item)} />)}
        </div>
      )}
    </div>
  )
}


export default SearchDataFetch
