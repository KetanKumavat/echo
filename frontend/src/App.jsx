// import { useState } from "react";
// const App = () => {
//   const [response, setResponse] = useState("");
//   const [data, setData] = useState(null);
//   const [editable, setEditable] = useState(false);
//   async function callBackend() {
//     const requestBody = {
//       prompt: `write a detailed email body on the subject: ${response}`,
//     };
//     await fetch("http://localhost:3000/generate-email", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestBody),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         const cleanedData = data.email.replace(/\*/g, "");
//         setData(cleanedData);
//         setEditable(true);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }

//   return (
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

import { useState } from "react";

const App = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [response, setResponse] = useState("");
  const [data, setData] = useState(null);
  const [editable, setEditable] = useState(false);

  async function callBackend() {
    const requestBody = {
      prompt: `write a detailed email body on the subject: ${response}`,
    };

    await fetch("http://localhost:3000/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.email);
        setEditable(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    // <div className="w-full">
    //   <h1 className="text-white text-lg">ECHO</h1>
    //   <input
    //     type="email"
    //     placeholder="Enter your email"
    //     value={senderEmail}
    //     onChange={(e) => setSenderEmail(e.target.value)}
    //     className="w-full bg-gray-800 text-white p-4"
    //   />
    //   <textarea
    //     className="w-full bg-gray-800 text-white p-4"
    //     placeholder="Enter the subject of the email"
    //     onChange={(e) => setResponse(e.target.value)}
    //   />
    //   <button
    //     className="bg-blue-500 flex justify-center items-center text-white p-4"
    //     onClick={callBackend}>
    //     Generate Email
    //   </button>
    //   {data !== null && editable ? (
    //     <div className="w-full h-screen">
    //       <textarea
    //         className="w-full bg-gray-800 h-full text-white p-4"
    //         value={data}
    //         onChange={(e) => setData(e.target.value)}
    //         cols={50}
    //         rows={10}
    //       />
    //     </div>
    //   ) : (
    //     <h1>Generating Email</h1>
    //   )}
    // </div>

    <div className="w-full bg-black ">

    </div>

  );
};

export default App;
