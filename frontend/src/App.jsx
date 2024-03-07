import { useState } from "react";

const App = () => {
  const [response, setResponse] = useState("");
  const [data, setData] = useState(null);

  async function callOpenAI() {
    const APIBody = {
      model: "davinci-002",
      prompt: "write an email on the subject of:" + response,
      max_tokens: 200,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify(APIBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.choices && data.choices.length > 0) {
          setData(data.choices[0].text);
        } else {
          console.error("Invalid response format:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  return (
    <div>
      <h1 className="text-white text-lg">ECHO</h1>
      <textarea
        className="w-full bg-gray-800 text-white p-4"
        placeholder="Enter the subject of the email"
        cols={50}
        rows={10}
        onChange={(e) => setResponse(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-4" onClick={callOpenAI}>
        Generate Email
      </button>
      {data !== null ? (
        <p className="text-white">{data}</p>
      ) : (
        <h1>Generating Email</h1>
      )}
    </div>
  );
};

export default App;
