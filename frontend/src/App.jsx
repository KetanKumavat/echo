import { useState, useRef } from "react";
import SpotlightCompo from "./components/SpotlightCompo";
import Ellipse from "../../frontend/public/Ellipse 9.svg";

const App = () => {
  const myRef = useRef(null);
   const executeScroll = () =>
     myRef.current.scrollIntoView({ behavior: "smooth" });    
  const [response, setResponse] = useState("");
  // eslint-disable-next-line no-unused-vars
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

      <div
        className="w-full flex absolute z-50 text-center justify-center items-center"
        onChange={executeScroll}>
        <div className="container">
          <div className="chevron"></div>
          <div className="chevron"></div>
          <div className="chevron"></div>
        </div>
      </div>

      <img
        src={Ellipse}
        alt="ellipse"
        className="absolute aspect-square -mt-[28vh] ml-[25vh] opacity-35 pointer-events-none"
      />

      <div
        className="h-screen w-full flex justify-center"
        ref={myRef}>
        <div className="w-3/4 bg-[rgba(255,255,255,0.05)] p-16 z-50 backdrop-blur-8xl mt-[20vh] rounded-2xl h-3/4">
          <div className="flex flex-col justify-center">
            <div className="flex justify-start gap-24 w-full">
              <div className="flex-col justify-center items-center">
                <label htmlFor="">Name</label>
                <input
                  type="name"
                  placeholder="Enter Your Name"
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="flex justify-center items-center placeholder-opacity-95 bg-zinc-200 placeholder-black rounded-xl w-full text-black font-semibold p-4"
                />
              </div>
              <div>
                <label htmlFor="">Email</label>
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="flex font-semibold text-left justify-start placeholder-opacity-95 rounded-xl bg-zinc-200 placeholder-black text-black p-4 w-[33vh] text-md"
                />
              </div>
            </div>
            <br />
            <div>
              <label htmlFor="">Subject</label>
              <input
                className="w-1/2 flex font-semibold justify-center items-center placeholder-opacity-95 rounded-xl bg-zinc-200 placeholder-black text-black p-4 text-md"
                placeholder="Enter the subject of the email"
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
            <br />
            <div>
              <div>
                <br />
                {data !== null && editable ? (
                  <div className="border-slate-400 rounded-xl bg-zinc-600 z-0 bg-opacity-30">
                    <textarea
                      className="w-full bg-transparent opacity-1 z-50 text-white font-semibold h-96 rounded-xl p-4"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                    />
                  </div>
                ) : (
                  <textarea
                    className="w-full bg-gray-800 h-full text-white p-4"
                    placeholder="Generated Email will be shown here"
                    onChange={(e) => setData(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        className="px-3 py-3 rounded-xl border border-neutral-600 text-black text-md font-bold bg-white/85 hover:bg-transparent hover:text-white transition duration-200"
        onClick={callBackend}>
        Generate Email
      </button>
    </div>
  );
};

export default App;
