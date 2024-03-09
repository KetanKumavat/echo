import { useState } from "react";
import SpotlightCompo from "./components/SpotlightCompo";

const App = () => {
  const [response, setResponse] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [data, setData] = useState(null);
  const [editable, setEditable] = useState(false);
  async function callBackend() {
    const requestBody = {
      prompt: `write a detailed email body on the subject: ${response}`,
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
        const cleanedData = data.email.replace(/\*/g, "");
        setData(cleanedData);
        setEditable(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    //     <div className="w-full">
    //       <h1 className="text-white text-lg">ECHO</h1>
    //       <textarea
    //         className="w-full bg-gray-800 text-white"
    //         placeholder="Enter the subject of the email"
    //         onChange={(e) => setResponse(e.target.value)}
    //       />
    //       <button
    //         className="bg-blue-500 flex justify-center items-center text-white p-4"
    //         onClick={callBackend}>
    //         Generate Email
    //       </button>
    //       {data !== null && editable ? (
    //         <div className="w-full h-screen">
    //           <textarea
    //             className="w-full bg-gray-800 h-full text-white p-4"
    //             value={data}
    //             onChange={(e) => setData(e.target.value)}
    //             cols={50}
    //             rows={10}
    //           />
    //         </div>
    //       ) : (
    //         <h1>Generating Email</h1>
    //       )}
    //     </div>
    //   );
    // };

    // export default App;

    <div className="w-full h-screen bg-black/[0.96] flex-col justify-center items-center">
      <SpotlightCompo />
      <div className="flex-col justify-center items-center">
        <label htmlFor="">name</label>
        <input
          type="name"
          placeholder="Enter Your Name"
          onChange={(e) => setSenderEmail(e.target.value)}
          className="flex justify-center items-center bg-white text-black p-4"
        />
      </div>
      <div>
        <label htmlFor="">email</label>
        <input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setSenderEmail(e.target.value)}
          className="w-1/2 flex justify-center items-center text-white p-4"
        />
      </div>
      <div>
        <label htmlFor="">subject</label>
        <textarea
          className="w-full bg-gray-800 text-white"
          placeholder="Enter the subject of the email"
          onChange={(e) => setResponse(e.target.value)}
        />
      </div>
      <div>
        {data !== null && editable ? (
          <div className="w-full h-screen">
            <textarea
              className="w-full bg-gray-800 h-full text-white p-4"
              value={data}
              onChange={(e) => setData(e.target.value)}
              cols={50}
              rows={10}
            />
          </div>
        ) : (
          <h1>Generating Email</h1>
        )}
      </div>
      <div>
        <button
          className="bg-blue-500 flex justify-center items-center text-white p-4"
          onClick={callBackend}>
          Generate Email
        </button>
      </div>
    </div>
  );
};

export default App;
