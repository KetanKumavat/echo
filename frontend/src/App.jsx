/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import SpotlightCompo from "./components/SpotlightCompo";
import Ellipse from "../../frontend/public/Ellipse 9.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Signup from "./components/Login";
// import {Register} from "./components/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

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
      prompt: `write an email body (write it in html paragraph format) on the subject: ${subject}`,
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
      toast.error("Please fill in all fields.", {
        position: "bottom-right",
        // theme: "dark"
      });
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
    toast.success("Email sent successfully!", {
      position: "bottom-right",
    });
  }
  // const { user } = useAuth();

  // if (!user) {
  //   return <Signup />;
  // }
  return (
    <Router>
      <GoogleOAuthProvider clientId="686300044731-9dhvddarp1ca8imf9i0sr5a0oco5kepe.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
            console.log(credentialResponse.accessToken);
          }}
          onError={(error) => console.log(error)}
        />
      </GoogleOAuthProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <div className="w-full h-screen bg-black/[0.96] scale-110 md:scale-100 items-center z-50">
        <SpotlightCompo />
        <div
          className="w-full flex z-50 text-center justify-center items-center cursor-pointer absolute bottom-10 md:-bottom-8"
          onClick={executeScroll}>
          <div className="container" onClick={executeScroll}>
            <div className="chevron" onClick={executeScroll}></div>
            <div className="chevron" onClick={executeScroll}></div>
            <div className="chevron" onClick={executeScroll}></div>
          </div>
        </div>
        <img
          src={Ellipse}
          alt="ellipse"
          className="absolute aspect-square transform  opacity-70 mt-72 md:-mt-[40vh] md:ml-[40vh] md:opacity-35 md:scale-150 pointer-events-none md:absolute z-0 scale-125 "
        />

        <div className="h-screen flex justify-center" ref={myRef}>
          <div className="w-3/4 bg-[rgba(255,255,255,0.05)] p-5 md:p-20  z-50 backdrop-blur-8xl mt-40 md:mt-[18vh] rounded-2xl transform scale-110 md:scale-100 md:border-none border h-fit md:h-fit  max-h-fit justify-center">
            <div className="flex flex-col justify-center md:scale-105">
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <div className="flex flex-col flex-grow">
                  <label htmlFor="">Name</label>
                  <input
                    type="name"
                    placeholder="Enter Your Name"
                    onChange={(e) => setSender(e.target.value)}
                    className="placeholder-opacity-95 bg-zinc-200 placeholder-black text-lg rounded-xl text-black font-semibold p-4"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <label htmlFor="">Sender&apos;s Email</label>
                  <input
                    type="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="font-semibold text-left placeholder-opacity-95 rounded-xl bg-zinc-200 text-lg placeholder-black text-black p-4"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <label htmlFor="">Recipient&apos;s Email</label>
                  <input
                    type="email"
                    placeholder="Enter Recipient's Email Address"
                    onChange={(e) => setReceiverEmail(e.target.value)}
                    className="font-semibold text-left placeholder-opacity-95 rounded-xl bg-zinc-200 text-lg placeholder-black text-black p-4"
                  />
                </div>
              </div>

              <br />
              <div>
                <label htmlFor="">Subject</label>
                <input
                  className="w-full flex font-semibold justify-center text-lg items-center placeholder-opacity-95 rounded-xl bg-zinc-200 placeholder-black text-black p-4 text-md"
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
                        className="w-full bg-transparent opacity-1 z-50 text-white font-semibold rounded-xl p-4 overflow-y-scroll"
                        value={data}
                        rows={4}
                        onChange={(e) => setData(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="">Email Body</label>
                      <textarea
                        className="w-full bg-zinc-200 h-full text-black placeholder-black font-semibold text-lg rounded-xl p-4 my-auto mx-auto  overflow-y-auto"
                        placeholder="Write or Generate an Email"
                        rows={4}
                        onChange={(e) => setData(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex gap-4 right-0 mr-[50vh] md:gap-x-10 pt-2 p-2 mt-16 scale-75 md:scale-100 justify-center">
              <button
                className="px-4 py-2 md:py-3 rounded-lg border-2 border-neutral-100 text-black text-md font-bold bg-white hover:bg-transparent hover:text-white transition duration-200 text-xl focus-visible:font-white focus-visible:font-bold focus-visible:bg-transparent focus-visible:border-2-white focus-visible:text-white focus-visible:rounded-xl"
                onClick={callBackend}>
                Generate Email
              </button>
              <button
                className="px-8 rounded-lg border-2 border-neutral-100 text-black text-md font-bold bg-white hover:bg-transparent hover:text-white transition duration-200 text-xl focus-visible:font-white focus-visible:font-bold focus-visible:bg-transparent focus-visible:border-2-white focus-visible:text-white focus-visible:rounded-xl"
                onClick={sendEmail}>
                Send Email
              </button>
            </div>
          </div>
        </div>
        {/* <div className="w-3/4 bg-[rgba(255,255,255,0.05)] p-16 z-50 backdrop-blur-8xl mt-[18vh] rounded-2xl h-3/4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div> */}
      </div>
    </Router>
  );
};

export default App;