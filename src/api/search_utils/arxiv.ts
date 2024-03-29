
import axios from "axios"
import { resData } from "./types"
import { parse_year } from "./dep"

let errNum = 0;
export default async function searchInArxiv(
  searchQuery: string,
  maxResults?: number
): Promise<resData[]> {
  try {
    // http://export.arxiv.org/api/query?search_query=all:%22black+hole%22
    const response = await axios.get("https://export.arxiv.org/api/query", {
      params: {
        search_query: `all:"${searchQuery}"`,
        start: 0,
        max_results: maxResults || 10,
      },
    });
    const parser = new DOMParser();
    const xmlDoc: XMLDocument = parser.parseFromString(
      response.data,
      "text/xml"
    );
    const articleElements = xmlDoc.querySelectorAll("entry");
    const articles: resData[] = [];

    articleElements.forEach((articleElement) => {
      articles.push({
        id: articles.length,
    title: articleElement.querySelector("title")?.textContent?.trim(),
    author: articleElement.querySelector("author")?.textContent?.trim(),
    published: parse_year(articleElement.querySelector("published")?.textContent?.trim()),
    pdf_url: articleElement.querySelector('link[title="pdf"]')?.getAttribute("href"),
        //abstract: articleElement.querySelector("summary").textContent.trim(),
        
      });
    });
    return articles;
  } catch (error) {
    if (errNum < 3) {
      errNum++;
      console.log(error);
      return searchInArxiv(searchQuery, maxResults);
    } else {
      throw error;
    }
  }
}

