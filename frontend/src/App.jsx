/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import SpotlightCompo from "./components/SpotlightCompo";
import Ellipse from "../../frontend/public/Ellipse 9.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IconBrandGoogle } from "@tabler/icons-react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

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
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = async (e) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      // console.log(result.user);
      toast.success("Logged in successfully!", {
        position: "bottom-right",
      });
      setSender(result.user.displayName);
      setSenderEmail(result.user.email);
      console.log(result.user.displayName);
      console.log(result.user.email);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Error signing in with Google", {
        position: "bottom-right",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  async function callBackend() {
    setLoading(true);
    const requestBody = {
      prompt: `write an email body (write it in html paragraph format) on the subject: ${subject}`,
    };

    try {
      const result = await fetch(
        "https://echo-6oy9.onrender.com/generate-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await result.json();
      const cleanedData = data.email.replace(/\*/g, "");
      setData(cleanedData);
      setEditable(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendEmail() {
    if (!receiverEmail || !subject || !data) {
      toast.error("Please fill in all fields.", {
        position: "bottom-right",
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
    await fetch("https://echo-6oy9.onrender.com/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((subject) => subject.json())
      .then((data) => {
        // console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    toast.success("Email sent successfully!", {
      position: "bottom-right",
    });
  }
  const scroll = () => {
    const imageDropInputSection = document.getElementById("scroll-down");
    if (imageDropInputSection) {
      imageDropInputSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    // <Router>
    //   <ToastContainer
    //     position="bottom-right"
    //     autoClose={5000}
    //     hideProgressBar={false}
    //     newestOnTop={false}
    //     closeOnClick
    //     rtl={false}
    //     pauseOnFocusLoss
    //     draggable
    //     pauseOnHover
    //     theme="light"
    //     transition:Bounce
    //   />
    //   <div className="w-full h-screen bg-black/[0.96] scale-110 md:scale-100 items-center z-50">
    //     <SpotlightCompo className="z-0" />
    //     <div className="w-full flex flex-col justify-center items-center z-50">
    //       {user ? (
    //         <button
    //           className="flex -mt-[80vh] gap-4 border-2 border-white p-3 rounded-xl bg-black bg-opacity-30 z-50"
    //           onClick={handleLogout}>
    //           <span className="flex text-white font-semibold">Logout</span>
    //         </button>
    //       ) : (
    //         <button
    //           className="flex -mt-[80vh] gap-4 border-2 border-white p-3 rounded-xl bg-black bg-opacity-30 z-50"
    //           onClick={handleLogin}>
    //           <IconBrandGoogle className="flex text-white font-semibold" />
    //           <span className="flex text-white font-semibold">
    //             Login With Google
    //           </span>
    //         </button>
    //       )}
    //     </div>
    //     <div
    //       className="w-full flex z-50 text-center justify-center items-center cursor-pointer absolute bottom-10 md:-bottom-8"
    //       onTouchStart={scroll}>
    //       <div className="container" onClick={executeScroll}>
    //         <div className="chevron" onClick={executeScroll}></div>
    //         <div className="chevron" onClick={executeScroll}></div>
    //         <div className="chevron" onClick={executeScroll}></div>
    //       </div>
    //     </div>
    //     <img
    //       src={Ellipse}
    //       alt="ellipse"
    //       className="absolute aspect-square transform  opacity-70 mt-72 md:-mt-[40vh] md:ml-[40vh] md:opacity-35 md:scale-150 pointer-events-none md:absolute z-0 scale-125 "
    //     />

    //     <div
    //       className="h-screen flex justify-center"
    //       ref={myRef}
    //       id="scroll-down">
    //       <div className="w-3/4 bg-[rgba(255,255,255,0.05)] p-5 md:p-20  z-50 backdrop-blur-8xl mt-40 md:mt-[18vh] rounded-2xl transform scale-110 md:scale-100 md:border-none border h-fit md:h-fit  max-h-fit justify-center">
    //         <div className="flex flex-col justify-center md:scale-105">
    //           <div className="flex flex-col lg:flex-row md:col-auto gap-2 w-full ">
    //             <div className="flex flex-col flex-grow">
    //               <label htmlFor="">Name</label>
    //               <input
    //                 type="name"
    //                 placeholder="Enter Your Name"
    //                 onChange={(e) => setSender(e.target.value)}
    //                 value={user ? user.displayName : Sender}
    //                 className="placeholder-opacity-95 bg-zinc-200 placeholder-black text-lg rounded-xl text-black font-semibold p-4"
    //               />
    //             </div>
    //             <div className="flex flex-col flex-grow">
    //               <label htmlFor="">Sender&apos;s Email</label>
    //               <input
    //                 type="email"
    //                 placeholder="Enter Your Email Address"
    //                 onChange={(e) => setSenderEmail(e.target.value)}
    //                 value={user ? user.email : senderEmail}
    //                 className="font-semibold text-left placeholder-opacity-95 rounded-xl bg-zinc-200 text-lg placeholder-black text-black p-4"
    //               />
    //             </div>
    //             <div className="flex flex-col flex-grow">
    //               <label htmlFor="">Recipient&apos;s Email</label>
    //               <input
    //                 type="email"
    //                 placeholder="Enter Recipient's Email Address"
    //                 onChange={(e) => setReceiverEmail(e.target.value)}
    //                 className="font-semibold text-left placeholder-opacity-95 rounded-xl bg-zinc-200 text-lg placeholder-black text-black p-4"
    //               />
    //             </div>
    //           </div>

    //           <br />
    //           <div>
    //             <label htmlFor="">Subject</label>
    //             <input
    //               className="w-full flex font-semibold justify-center text-lg items-center placeholder-opacity-95 rounded-xl bg-zinc-200 placeholder-black text-black p-4 text-md"
    //               placeholder="Enter the subject of the email"
    //               onChange={(e) => setSubject(e.target.value)}
    //             />
    //           </div>
    //           <br />
    //           <div>
    //             <div>
    //               <br />
    //               {loading && editable ? (
    //                 <div>
    //                   <label htmlFor="">Email Body</label>
    //                   <textarea
    //                     className="w-full bg-zinc-200 h-full text-black placeholder-black font-semibold text-lg rounded-xl my-auto mx-auto p-4 overflow-y-scroll"
    //                     value={data}
    //                     contentEditable="false"
    //                     placeholder="Generating Email..."
    //                     rows={6}
    //                     onChange={(e) => setData(e.target.value)}
    //                   />
    //                 </div>
    //               ) : (
    //                 <>
    //                   <label htmlFor="">Email Body</label>
    //                   <textarea
    //                     className="w-full bg-zinc-200 h-full text-black placeholder-black font-semibold text-lg rounded-xl my-auto mx-auto p-4 overflow-y-scroll"
    //                     placeholder="Write Or Generate Email Body"
    //                     value={data}
    //                     rows={4}
    //                     onChange={(e) => setData(e.target.value)}
    //                   />
    //                 </>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="w-full flex gap-4 right-0 mr-[50vh] md:gap-x-10 pt-2 p-2 mt-16 scale-75 md:scale-100 justify-center">
    //           <button
    //             className="px-4 py-2 md:py-3 rounded-lg border-2 border-neutral-100 text-black text-md font-bold bg-white hover:bg-transparent hover:text-white transition duration-200 text-xl focus-visible:font-white focus-visible:font-bold focus-visible:bg-transparent focus-visible:border-2-white focus-visible:text-white focus-visible:rounded-xl"
    //             onClick={callBackend}>
    //             Generate Email
    //           </button>
    //           <button
    //             className="px-8 rounded-lg border-2 border-neutral-100 text-black text-md font-bold bg-white hover:bg-transparent hover:text-white transition duration-200 text-xl focus-visible:font-white focus-visible:font-bold focus-visible:bg-transparent focus-visible:border-2-white focus-visible:text-white focus-visible:rounded-xl"
    //             onClick={sendEmail}>
    //             Send Email
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //     {/* <div className="w-3/4 bg-[rgba(255,255,255,0.05)] p-16 z-50 backdrop-blur-8xl mt-[18vh] rounded-2xl h-3/4">
    //     <Routes>
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/register" element={<Register />} />
    //     </Routes>
    //   </div> */}
    //   </div>
    // </Router>

    //conditional rendering

    <Router>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="w-full h-screen bg-black/[0.96] scale-110 md:scale-100 items-center z-50">
        <SpotlightCompo className="z-0" />
        <div
          className="w-full flex z-50 text-center justify-center items-center cursor-pointer absolute bottom-10 md:-bottom-8"
          onTouchStart={scroll}>
          <div className="container" onClick={executeScroll}>
            <div className="chevron" onClick={executeScroll}></div>
            <div className="chevron" onClick={executeScroll}></div>
            <div className="chevron" onClick={executeScroll}></div>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center z-50">
          {user ? (
            <button
              className="flex -mt-[80vh] gap-4 border-2 border-white p-2 md:scale-125 px-10 rounded-xl bg-black bg-opacity-30 z-50"
              onClick={handleLogout}>
              <span className="flex text-white font-semibold">Logout</span>
            </button>
          ) : (
            <button
              className="flex -mt-[80vh] gap-4 border-2 border-white p-3 py-4 rounded-xl bg-black bg-opacity-30 z-50"
              onClick={handleLogin}>
              <IconBrandGoogle className="flex text-white font-semibold" />
              <span className="flex text-white font-semibold">
                Login With Google
              </span>
            </button>
          )}
        </div>
        {user ? (
          <>
            <img
              src={Ellipse}
              alt="ellipse"
              className="absolute aspect-square transform  opacity-70 mt-72 md:-mt-[40vh] md:ml-[40vh] md:opacity-35 md:scale-150 pointer-events-none md:absolute z-0 scale-125 "
            />
            <div
              className="h-screen flex justify-center"
              ref={myRef}
              id="scroll-down">
              <div className="w-3/4 bg-[rgba(255,255,255,0.05)] p-5 md:p-20  z-50 backdrop-blur-8xl mt-40 md:mt-[18vh] rounded-2xl transform scale-110 md:scale-100 md:border-none border h-fit md:h-fit  max-h-fit justify-center">
                <div className="flex flex-col justify-center md:scale-105">
                  <div className="flex flex-col lg:flex-row md:col-auto gap-2 w-full ">
                    <div className="flex flex-col flex-grow">
                      <label htmlFor="">Name</label>
                      <input
                        type="name"
                        placeholder="Enter Your Name"
                        onChange={(e) => setSender(e.target.value)}
                        value={user ? user.displayName : ""}
                        className="placeholder-opacity-95 bg-zinc-200 placeholder-black text-lg rounded-xl text-black font-semibold p-4"
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <label htmlFor="">Sender&apos;s Email</label>
                      <input
                        type="email"
                        placeholder="Enter Your Email Address"
                        onChange={(e) => setSenderEmail(e.target.value)}
                        value={user ? user.email : ""}
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
                      {loading && editable ? (
                        <div>
                          <label htmlFor="">Email Body</label>
                          <textarea
                            className="w-full bg-zinc-200 h-full text-black placeholder-black font-semibold text-lg rounded-xl my-auto mx-auto p-4 overflow-y-scroll"
                            value={data}
                            contentEditable="false"
                            placeholder="Generating Email..."
                            rows={6}
                            onChange={(e) => setData(e.target.value)}
                          />
                        </div>
                      ) : (
                        <>
                          <label htmlFor="">Email Body</label>
                          <textarea
                            className="w-full bg-zinc-200 h-full text-black placeholder-black font-semibold text-lg rounded-xl my-auto mx-auto p-4 overflow-y-scroll"
                            placeholder="Write Or Generate Email Body"
                            value={data}
                            rows={4}
                            onChange={(e) => setData(e.target.value)}
                          />
                        </>
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
          </>
        ) : (
          <div className="flex w-full h-full md:h-3/4 justify-center items-center mb-20">
            <h1 className="text-3xl md:text-4xl text-white font-semibold">
              Please Login To Continue :)
            </h1>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
