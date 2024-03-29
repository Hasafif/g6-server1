import { FC, useState} from "react";
import { literature } from "../api/search_utils/literature_utils";
import "../styles/components.css";


interface props {
  onExit: (e: boolean) => void;
}
type Item = {
  title: string;
  authors: string;
  published: string;
  pdf_url: string;
  abstract: string;
 };
const LiteraturePopup: FC<props> = ({ onExit }) => {
  // hooks
  const [lrOutput, setLrOutput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    pdf_url: "",
    published: "",
    abstract:"",
  });
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState("apa");
  const [collectedItems, setCollectedItems] = useState<Item[]>([]);
  // Value Handlers

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
   };
   
  const handleSelectedStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
  };
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
   };
   
  const handleSave = () => {
    const { title, authors, published, pdf_url,abstract } = formData;
    if (title.trim() !== "" &&
    authors.trim() !== "" &&// Check if authors array is not empty
    pdf_url.trim() !== "" &&
    published.trim() !== ""&&
     abstract.trim() !== "")
    {const newData = {
      title: title,
      authors: authors,
      published: published,
      pdf_url: pdf_url,
      abstract:abstract,
    };
    
    setCollectedItems((prevData) => [...prevData, newData]);}
    // Clear the input values
    setFormData({
      title: "",
      authors: "",
      pdf_url: "",
      published: "",
      abstract:""
    });
    setSubject("");
  };

  const handleExit = () => {
    onExit(false);
  };
  const handleSendData = async () => {
    try {
      const nonEmpty = collectedItems.filter(
        (ref) =>
          ref.title.trim() !== '' ||
          ref.authors.trim() !== ''|| // Check if authors array is not empty
          ref.pdf_url.trim() !== '' ||
          ref.published.trim() !== '' ||
          ref.abstract.trim() !== ''
      );
      // Create a new list of references with authors as arrays
      const data = nonEmpty.map(ref => ({
        ...ref,
        authors: ref.authors.includes(',') ? ref.authors.split(',').map(author => author.trim()) : [ref.authors.trim()]
      }));
      const response = await literature(data,style,subject)
      setLrOutput(response.data)
      setCollectedItems([]);
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };
  return (
    <section className="custom-lr">
       <section className="custom-lr-data">
        <h1>Saved Data</h1>
        <ul className="output-lr">
          {collectedItems.map((_data, i) => (
            <li key={i}>Saved Data item: {i + 1}</li>
          ))}
        </ul>
      </section>
      <section className="custom-lr-data">
        <h1>Literature Review</h1>
        <input
          value={subject}
          onChange={handleSubjectChange}
          placeholder="Subject"
        />
        <input
          name="title"
          value={formData.title}
          onChange={handleDataChange}
          placeholder="Title"
        />
        <input
          name="authors"
          value={formData.authors}
          onChange={handleDataChange}
          placeholder="Authors"
        />
        <input
          name="published"
          value={formData.published}
          onChange={handleDataChange}
          placeholder="Publish Year"
        />
        <input
          name="pdf_url"
          value={formData.pdf_url}
          onChange={handleDataChange}
          placeholder="PDF URL"
        />
         <textarea
         className="abstract-lr"
          name="abstract"
          value={formData.abstract}
          onChange={handleDataChange}
          placeholder="Abstract"
        ></textarea>

        <select
          onChange={handleSelectedStyle}
          value={style}
          className="cite-lr"
        >
          <option value="" disabled selected>
            Citation Type
          </option>
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
        <section>
          <button className="gener-lr" onClick={handleSave}>
            Save
          </button>
          <button className="gener-lr" onClick={handleSendData}>
            Generate
          </button>
        </section>
        <button className="exit-lr-btn" onClick={handleExit}>
          EXIT
        </button>
      </section>
      <section className="custom-lr-data">
        <h1>Output</h1>
        <p className="output-lr">{lrOutput}</p>
      </section>
    </section>
  );
};

export default LiteraturePopup;
