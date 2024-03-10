import { useState, useRef } from "react";
import SpotlightCompo from "./components/SpotlightCompo";
import Ellipse from "../../frontend/public/Ellipse 9.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  const myRef = useRef(null);
  const executeScroll = () =>
    myRef.current.scrollIntoView({ behavior: "smooth" });
  const [subject, setSubject] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [data, setData] = useState(null);
  const [Sender, setSender] = useState("");
  const [editable, setEditable] = useState(false);
  async function callBackend() {
    const requestBody = {
      prompt: `write a detailed email body on the subject: ${subject}`,
    };
    await fetch("http://localhost:3000/generate-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((subject) => subject.json())
      .then((data) => {
        const cleanedData = data.email.replace(/\*/g, "");
        setData(cleanedData);
        setEditable(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  async function sendEmail() {
    if (!Sender || !senderEmail || !receiverEmail || !subject || !data) {
      toast.error("Please fill in all fields.");
      return;
    }
    const requestBody = {
      sender: Sender,
      senderEmail: senderEmail,
      receiverEmail: receiverEmail,
      subject: subject,
      email: data,
    };
    await fetch("http://localhost:3000/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((subject) => subject.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    toast.success("Email sent successfully!");
  }

  return (
    <div className="w-full h-screen bg-black/[0.96] flex-col justify-center items-center">
      <SpotlightCompo />

      <div
        className="w-full flex absolute z-50 text-center justify-center items-center"
        onClick={executeScroll}>
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

      <div className="h-screen flex justify-center" ref={myRef}>
        <div className="w-3/4 bg-[rgba(255,255,255,0.05)] p-16 z-50 backdrop-blur-8xl mt-[18vh] rounded-2xl h-3/4">
          <div className="flex flex-col justify-center">
            <div className="flex justify-start gap-20 w-full">
              <div className="flex-col justify-center items-center">
                <label htmlFor="">Name</label>
                <input
                  type="name"
                  placeholder="Enter Your Name"
                  onChange={(e) => setSender(e.target.value)}
                  className="flex justify-center items-center placeholder-opacity-95 bg-zinc-200 placeholder-black text-lg rounded-xl w-full text-black font-semibold p-4"
                />
              </div>
              <div>
                <label htmlFor="">Sender&apos;s Email</label>
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="flex font-semibold text-left justify-start placeholder-opacity-95 rounded-xl bg-zinc-200 text-lg placeholder-black text-black p-4 w-[33vh] text-md"
                />
              </div>
              <div>
                <label htmlFor="">Recipient&apos;s Email</label>
                <input
                  type="email"
                  placeholder="Enter Recipient's Email Address"
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  className="flex font-semibold text-left justify-start placeholder-opacity-95 rounded-xl bg-zinc-200 text-lg placeholder-black text-black p-4 w-[33vh] text-md"
                />
              </div>
            </div>
            <br />
            <div>
              <label htmlFor="">Subject</label>
              <input
                className="w-1/2 flex font-semibold justify-center text-lg items-center placeholder-opacity-95 rounded-xl bg-zinc-200 placeholder-black text-black p-4 text-md"
                placeholder="Enter the subject of the email"
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <br />
            <div>
              <div>
                <br />
                {data !== null && editable ? (
                  <div className="border-slate-400 rounded-xl bg-zinc-200 z-0 bg-opacity-10">
                    <label htmlFor="">Email Body</label>
                    <textarea
                      className="w-full bg-transparent opacity-1 z-50 text-white font-semibold h-96 rounded-xl p-4"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="">Email Body</label>
                    <textarea
                      className="w-full bg-zinc-200 h-full text-black place-content-start placeholder-black font-semibold text-lg rounded-xl p-4"
                      placeholder="Write or Generate Email"
                      onChange={(e) => setData(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-10 justify-center items-center -mt-8">
        <button
          className="px-3 py-3 rounded-xl border border-neutral-600 text-black text-md font-bold bg-white hover:bg-transparent hover:text-white transition duration-200 text-lg"
          onClick={callBackend}>
          Generate Email
        </button>
        <button
          className="px-3 py-3 rounded-xl border border-neutral-600 text-black text-md font-bold bg-white text-lg hover:bg-transparent hover:text-white transition duration-200"
          onClick={sendEmail}>
          Send Email
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default App;