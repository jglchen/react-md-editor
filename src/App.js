import React, {useState, useEffect } from 'react';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import {remark} from 'remark';
import html from 'remark-html';
import { useWindowSize } from '@react-hook/window-size'
import './App.css';

function App() {
  let easyMDE;
  let mdeHeight = 420;
  const [width, height] = useWindowSize();
  const [mdeValue, setMdeValue] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [refresh, setRefreh] = useState(0);
  mdeHeight = Math.min(mdeHeight, height > 100 ? (height - 100): height, width > 100 ? (width -100): 100);
  const options = {
      autofocus: true,
      maxHeight: mdeHeight + 'px',
      placeholder: 'Please Enter Markdown Text',
      toolbar: ["bold", "italic", "heading-1", "heading-2", "heading-3", "|", 
                "quote", "unordered-list", "ordered-list", "|",
                "link", "image", "table", "horizontal-rule", "|",
                "guide"
              ]	
  }

  useEffect(() => {
     setMdeValue('');
     setContentHtml('');
     // eslint-disable-next-line react-hooks/exhaustive-deps
     easyMDE = new EasyMDE(options);
     easyMDE.value('');
     easyMDE.codemirror.on("change", () => {
         handleChange();
     });
   
     return (function (){
         easyMDE.toTextArea();
     });
  },[refresh]);

  function handleChange(){
     let mdeStr = easyMDE.value();
     mdeStr = mdeStr.replace(/<\/?[^>]*>/g, ""); 
     setMdeValue(mdeStr);
     if (mdeStr !== easyMDE.value()){
        easyMDE.value(mdeStr);
     }
     convertMDtoHTML(mdeStr);
  }

  async function convertMDtoHTML(str) {
     // Use remark to convert markdown into HTML string
     const processedContent = await remark()
       .use(html)
       .process(str);
     
     setContentHtml(processedContent.toString());
  }

  function copyMarkdown(){
      navigator.clipboard.writeText(mdeValue);
  }

  function clearInput(){
     setRefreh(prevState => prevState + 1);
  }

  return (
    <main>
       <section>
          <div className="full-container">
              <label htmlFor="mde-input">Markdown Editor</label>
              <textarea id="mde-input"></textarea>      
              <input type="button" className="button" value="Copy Markdown" onClick={copyMarkdown} />
              <input type="button" className="button" value="Clear Editor" onClick={clearInput} />
          </div>
       </section>
       <section>
          <div className="full-container">
              <label htmlFor="html-output">HTML Output</label>
              <div className="notepara" id="html-output" style={{height: mdeHeight + 60 + 'px'}} dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
       </section>
    </main>   
  );
}

export default App;

