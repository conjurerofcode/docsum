import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./index.css";
import { config } from "dotenv";

const configuration = new Configuration({
  organization: "org-HRpFLdGsffkFpjAoVoPmwGIT",
  apiKey: import.meta.env.VITE_OPEN_AI_API,
});
const openai = new OpenAIApi(configuration);

function App() {
  const [text, setText] = useState("");
  const [returnText, setReturnText] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText((prev) => e.target.value);
  }
  async function handleSubmit() {
    if (text == "") return;
    let newText = "";
    if (text.length > 10000) {
      newText = text.substring(0, 1000);
    } else {
      newText = text;
    }
    const response = await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(newText),
        temperature: 0.6,
        max_tokens: 2048,
        // stream: true
      })
      .then((res) => {
        const resp = res.data.choices[0].text as string;
        setReturnText((prev) => resp);
      });
  }

  return (
    <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 flex flex-col items-center">
      <form className="flex flex-col items-center  w-1/2">
        <label className="m-5">Enter Text:</label>
        <textarea className="m-2 w-full " onChange={handleChange}></textarea>
        <button
          className="bg-transparent m-5 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          Submit
        </button>
      </form>
      {returnText}
    </div>
  );
}

function generatePrompt(prompt: string) {
  return "Summarize the following text paragraph by paragraph: " + prompt;
}

export default App;
