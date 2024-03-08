import { useState } from "react";

const App = () => {
  const [response, setResponse] = useState("");
  const [data, setData] = useState(null);

  async function callBackend() {
    const requestBody = {
      prompt:
        `write a letter on the subject: ${response}`,
    };

    await fetch("http://localhost:3000/generate-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.email);
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
      <button className="bg-blue-500 text-white p-4" onClick={callBackend}>
        Generate Email
      </button>
      {data !== null ? (
        <div className="email">
          <p>From: Your Email Address</p>
          <p>To: Recipient's Email Address</p>
          <p>Subject: {response}</p>
          <p>Date: {new Date().toLocaleDateString()}</p>
          <hr />
          <p>{data}</p>
        </div>
      ) : (
        <h1>Generating Email</h1>
      )}
    </div>
  );
};

export default App;
