import { searchInSemantic } from './semantic';
import { default as axios } from 'axios';
import { resData } from './types';
function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function searchAndProcess(query:string,style:string,retries =  3, delay =  500) {
const spRes:resData[] = []
try {
    let res = await searchInSemantic(query)
    // Handle the response data here
    //console.log(res);
    let filteredResults = res.filter((r) => r.abstract!== null);
    filteredResults = filteredResults.slice(0,5)
    filteredResults.forEach(r => {
      const item:resData = {
        title: r.title,
        authors: r.authors,
        pdf_url: r.pdf_url,
        published: r.published,
        abstract: r.abstract
      };
      spRes.push(item);
    });
    console.log(spRes);
    const res1 = await literature(spRes,style,query);
    console.log(res1);
    return res1;
  } catch (error) {
    if (retries >  0) {
      // Wait for the specified delay before retrying
      await sleep(delay);
      // Retry the request with one less retry attempt and double the delay
      return searchAndProcess(query, style, retries -  1, delay *  2);
    } else {
      // If no more retries left, throw the error
      throw error;
    }
  }
}
export async function literature(items:resData[],style:string,query:string,retries = 3,delay = 500) {
    console.log(items)
    const djUrl = 'http://51.20.165.45';
   // const djUrl = 'http://127.0.0.1:8000';
    const reqData = {
      'Researches': items,
      'style': style,
      'subject':query
    }
    const endpoint = 'literature/'
    try{
    return axios.post(`${djUrl}/${endpoint}`,reqData).then((res) =>{
      console.log(res);
      return res;
    })}catch (error) {
      if (retries >  0) {
        // Wait for the specified delay before retrying
        await sleep(delay);
        // Retry the request with one less retry attempt and double the delay
        return literature(items,style,query, retries -  1, delay *  2);
      } else {
        // If no more retries left, throw the error
        throw error;
      }
    }}

export async function documentation(items:resData[], style:string, retries =  3, delay =  500) {
      console.log(items);
      const djUrl = 'http://51.20.165.45';
      //const djUrl = 'http://127.0.0.1:8000';
      const reqData = {
        'Researches': items,
        'style': style
      };
      const endpoint = 'documentation/';
    
      try {
        // Return the Promise chain from the Axios POST request
        return axios.post(`${djUrl}${endpoint}`, reqData)
          .then(res => {
            console.log(res);
            return res;
          });
      } catch (error) {
        if (retries >  0) {
          // Ensure sleep is awaited
          await sleep(delay);
          // Retry the request with one less retry attempt and double the delay
          return documentation(items, style, retries -  1, delay *  2);
        } else {
          // If no more retries left, throw the error
          throw error;
        }
      }
    }
    
    // Define the sleep function if it's not already defined elsewhere

    
export async function plagiarism(text:string,retries=3,delay=500) {
        console.log(text)
        const djUrl = 'http://51.20.165.45';
        const reqData = {
          'text': text
        }
        const endpoint = 'plagiarism/'
       try {
        return axios.post(`${djUrl}/${endpoint}`,reqData).then((res) =>{
          console.log(res);
          return res;
        })}catch (error) {
          if (retries >  0) {
            // Wait for the specified delay before retrying
            await sleep(delay);
            // Retry the request with one less retry attempt and double the delay
            return plagiarism(text,retries -  1, delay *  2);
          } else {
            // If no more retries left, throw the error
            throw error;
          }}}
        
export async function searchAndDoc(query:string, style:string, retries =  3, delay =  500) {
            const sdRes:resData[] = [];
            try {
              const res = await searchInSemantic(query);
              const filteredResults = res.filter(r => r.pdf_url !== '');
              filteredResults.forEach(r => {
                const item = {
                  title: r.title,
                  authors: r.authors,
                  pdf_url: r.pdf_url,
                  published: r.published,
                };
                sdRes.push(item);
              });
              console.log(sdRes);
              const re = await documentation(sdRes, style);
              console.log(re);
              return re;
            } catch (error) {
              if (retries >  0) {
                // Use setTimeout to create a delay and make it awaitable
                await sleep(delay)
                // Retry the request with one less retry attempt and double the delay
                return searchAndDoc(query, style, retries -  1, delay *  2);
              } else {
                // If no more retries left, throw the error
                throw error;
              }
            }
          }

export async function article(query: string, refs: any[] = [],outline:string,arxiv:boolean,retries = 3, delay = 500) {
    let filteredResults = [];
    if (refs.length == 0 && arxiv==false) {
        let res: any[] = [];
        try {
            res = await searchInSemantic(query, 40);
        } catch (error) {
            console.error('Error in searchInSemantic:', error);
            // If an error occurs, assign an empty array to res
            res = [];
        }
        console.log(res);
        filteredResults = res.filter((r) => r.abstract !== null && r.pdf_url !== '');
    } else {
        filteredResults = refs;
    }

    const djUrl = 'http://51.20.165.45';
    const reqData = {
        'topic': query,
        'res': filteredResults,
        'outline':outline,
        'arxiv':arxiv
    }
    const endpoint = 'article/'
    try {
        return axios.post(`${djUrl}/${endpoint}`, reqData).then((res) => {
            console.log(res);
            return res;
        })
    } catch (error) {
        if (retries > 0) {
            // Wait for the specified delay before retrying
            await sleep(delay);
            // Retry the request with one less retry attempt and double the delay
            return article(query, refs,outline,arxiv,retries - 1, delay * 2);
        } else {
            // If no more retries left, throw the error
            throw error;
        }
    }
}

export async function outline(query:string,retries = 3,delay = 500) {
              let res: any[] = [];
              try {
                   res = await searchInSemantic(query, 40);
               } catch (error) {
                console.error('Error in searchInSemantic:', error);
            // If an error occurs, assign an empty array to res
                  res = [];
                   }
                  console.log(res);
                  let filteredResults = res.filter((r) => r.abstract !== null && r.pdf_url !== '');
                  const djUrl = 'http://51.20.165.45';
                  const reqData = {
                    'topic':query,
                     'res':filteredResults
      
                  }
                  const endpoint = 'outline/'
                  try{
                  return axios.post(`${djUrl}/${endpoint}`,reqData).then((res) =>{
                    console.log(res);
                    return res;
                  })}catch (error) {
                    if (retries >  0) {
                      // Wait for the specified delay before retrying
                      await sleep(delay);
                      // Retry the request with one less retry attempt and double the delay
                      return outline(query, retries -  1, delay *  2);
                    } else {
                      // If no more retries left, throw the error
                      throw error;
                    }
                  }}