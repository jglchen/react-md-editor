import React, {Component} from 'react';
import SimpleMDE from 'react-simplemde-editor';
import { Remarkable } from 'remarkable';
import 'easymde/dist/easymde.min.css';
import './App.css';

class App extends Component {
  state = {
    mdeValue: ''
  };
  
  handleChange = (value) => {
     this.setState({ mdeValue: value.replace(/<\/?[^>]*>/g, "")});
  };
  
  clearInput = () => {
     this.setState({mdeValue: ''});
  }
  
  copyToClipboard = (text) => {
     if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text); 

     } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
     }
  }; 
  
  copyMarkdown = () => {
      this.copyToClipboard(this.state.mdeValue);  
  }
  
  render() {
     let contentHtml = '';
	 if (this.state.mdeValue) {
        let md = new Remarkable();
        contentHtml = md.render(this.state.mdeValue);
     }
     return (
       <main>
         <section>
         	<div className="full-container">
         	   <SimpleMDE
                  label="Markdown Editor"
                  value={this.state.mdeValue}
                  onChange={this.handleChange}
                  options={{
                     autofocus: true,
                     maxHeight: '420px',
                     placeholder: 'Please Enter Markdown Text',
                     toolbar: ["bold", "italic", "heading-1", "heading-2", "heading-3", "|", 
							"quote", "unordered-list", "ordered-list", "|",
							"link", "image", "table", "horizontal-rule", "|",
							"guide"
							]	
                  }}                 
               />
               <input type="button" className="button" value="Copy Markdown Text" onClick={this.copyMarkdown} />
               <input type="button" className="button" value="Clear Markdown" onClick={this.clearInput} />
         	</div>
         </section>
         <section>
         	<div className="full-container">
               <label htmlFor="html-output">HTML Output</label>
               <div className="notepara" id="html-output" style={{height: '480px'}} dangerouslySetInnerHTML={{ __html: contentHtml }} />
         	</div>
         </section>
       </main>
     );
  }  
  
}

export default App;
