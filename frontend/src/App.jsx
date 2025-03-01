/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import SpotlightCompo from "./components/SpotlightCompo";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";
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
            toast.success(`Welcome ${result.user.displayName}!`, {
                position: "bottom-right",
            });
            setSender(result.user.displayName);
            setSenderEmail(result.user.email);
            console.log(result.user.displayName);
            console.log(result.user.email);
        } catch (error) {
            console.error("Error signing in with Google:", error);
            toast.error(error, {
                position: "bottom-right",
            });
        }
    };

    const handleLogout = async () => {
        try {
            toast.success("Logged out successfully!", {
                position: "bottom-right",
            });
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    async function callBackend() {
        setLoading(true);
        const requestBody = {
            prompt: `Generate a professional and well-structured email body based on the following subject: "${subject}". 

          - The email should start with a proper greeting.
          - Keep the tone formal yet engaging.
          - Provide clear and concise information relevant to the subject.
          - Use proper paragraph formatting with <p> tags.
          - End with a polite closing and a signature placeholder.

          Output only the email body without any additional explanations or notes.
          
          Important: Return only the formatted email content without any code block markers or html tags around the entire content.
          Format paragraphs directly with <p> tags in the content.`,
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
            const cleanedData = data.email.replace(/\*/g, ""); //regex to remove unwanted characters
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

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "blockquote"],
            [{ color: [] }, { background: [] }],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "blockquote",
        "color",
        "background",
    ];

    return (
        <Router>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                theme="light"
            />
            <div className="w-full h-screen bg-black/[0.96] items-center z-50">
                <SpotlightCompo className="z-0" />
                <div
                    className="w-full flex z-50 text-center justify-center items-center cursor-pointer absolute bottom-10 md:-bottom-8"
                    onTouchStart={scroll}
                >
                    {user && (
                        <div className="container" onClick={executeScroll}>
                            <div
                                className="chevron"
                                onClick={executeScroll}
                            ></div>
                            <div
                                className="chevron"
                                onClick={executeScroll}
                            ></div>
                            <div
                                className="chevron"
                                onClick={executeScroll}
                            ></div>
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col justify-center items-center z-50">
                    {user ? (
                        <button
                            className="flex -mt-[60vh] gap-2 border-2 border-white p-2 md:scale-125 rounded-md bg-white"
                            onClick={handleLogout}
                        >
                            <div class="sign">
                                <svg viewBox="0 0 512 512">
                                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                                </svg>
                            </div>
                            <span className="flex text-black font-semibold">
                                Logout
                            </span>
                        </button>
                    ) : (
                        <button
                            className="flex -mt-[60vh] items-center gap-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105"
                            onClick={handleLogin}
                        >
                            <div className="flex items-center gap-3">
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 48 48"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill="#FFC107"
                                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                                    />
                                    <path
                                        fill="#FF3D00"
                                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                                    />
                                    <path
                                        fill="#4CAF50"
                                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                                    />
                                    <path
                                        fill="#1976D2"
                                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                                    />
                                </svg>
                                <span className="text-sm md:text-base">
                                    Sign in with Google
                                </span>
                            </div>
                        </button>
                    )}
                </div>
                {user && (
                    <>
                        <div
                            className="h-screen flex justify-center"
                            ref={myRef}
                            id="scroll-down"
                            hidden={user ? false : true}
                        >
                            <div className="w-3/4 bg-[rgba(255,255,255,0.05)] p-5 md:p-20  z-50 backdrop-blur-8xl mt-40 md:mt-[18vh] rounded-2xl transform scale-110 md:scale-100 md:border-none border h-fit md:h-fit max-h-fit justify-center">
                                <div className="flex flex-col justify-center">
                                    <div className="flex flex-col md:flex-col lg:flex-row gap-4 w-full overflow-hidden">
                                        <div className="flex flex-col w-full">
                                            <label htmlFor="">Name</label>
                                            <input
                                                type="name"
                                                placeholder="Enter Your Name"
                                                onChange={(e) =>
                                                    setSender(e.target.value)
                                                }
                                                value={
                                                    user ? user.displayName : ""
                                                }
                                                className="placeholder-opacity-95 bg-white placeholder-black text-lg rounded-xl text-black font-semibold p-4 w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label htmlFor="">
                                                Sender&apos;s Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Enter Your Email Address"
                                                onChange={(e) =>
                                                    setSenderEmail(
                                                        e.target.value
                                                    )
                                                }
                                                value={user ? user.email : ""}
                                                className="font-semibold text-left placeholder-opacity-95 rounded-xl bg-white text-lg placeholder-black text-black p-4 w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label htmlFor="">
                                                Recipient&apos;s Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Enter Recipient's Email Address"
                                                onChange={(e) =>
                                                    setReceiverEmail(
                                                        e.target.value
                                                    )
                                                }
                                                className="font-semibold text-left placeholder-opacity-95 rounded-xl bg-white text-lg placeholder-black text-black p-4 w-full"
                                            />
                                        </div>
                                    </div>

                                    <br />
                                    <div>
                                        <label htmlFor="">Subject</label>
                                        <input
                                            className="w-full flex font-semibold justify-center text-lg items-center placeholder-opacity-95 rounded-xl bg-white placeholder-black text-black p-4 text-md"
                                            placeholder="Enter the subject of the email"
                                            onChange={(e) =>
                                                setSubject(e.target.value)
                                            }
                                        />
                                    </div>
                                    <br />
                                    {loading ? (
                                        <div className="email-editor-container">
                                            <label htmlFor="">Email Body</label>
                                            <div className="bg-zinc-200 rounded-xl overflow-hidden">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={data || ""}
                                                    onChange={setData}
                                                    modules={modules}
                                                    formats={formats}
                                                    placeholder="Generating Email..."
                                                    readOnly={loading}
                                                    className="bg-white text-black min-h-[200px]"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="email-editor-container">
                                            <label htmlFor="">Email Body</label>
                                            <div className="bg-zinc-200 rounded-xl overflow-hidden">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={data || ""}
                                                    onChange={setData}
                                                    modules={modules}
                                                    formats={formats}
                                                    placeholder="Write Or Generate Email Body"
                                                    className="bg-white text-black min-h-[200px]"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full flex gap-4 right-0 mr-[50vh] md:gap-x-10 pt-2 p-2 mt-16 scale-75 md:scale-100 justify-center">
                                    <button
                                        className="px-4 py-2 md:py-3 rounded-lg border-2 border-neutral-100 text-black text-md font-bold bg-white hover:bg-transparent hover:text-white transition duration-200 text-xl focus-visible:font-white focus-visible:font-bold focus-visible:bg-transparent focus-visible:border-2-white focus-visible:text-white focus-visible:rounded-xl"
                                        onClick={callBackend}
                                    >
                                        Generate Email
                                    </button>
                                    <button
                                        className="px-8 rounded-lg border-2 border-neutral-100 text-black text-md font-bold bg-white hover:bg-transparent hover:text-white transition duration-200 text-xl focus-visible:font-white focus-visible:font-bold focus-visible:bg-transparent focus-visible:border-2-white focus-visible:text-white focus-visible:rounded-xl"
                                        onClick={sendEmail}
                                    >
                                        Send Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Router>
    );
};

export default App;
