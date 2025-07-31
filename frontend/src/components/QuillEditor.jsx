import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = forwardRef(
    (
        {
            value = "",
            onChange,
            placeholder = "Start typing...",
            readOnly = false,
            className = "",
            style = {},
        },
        ref
    ) => {
        const containerRef = useRef(null);
        const quillRef = useRef(null);
        const isUpdatingRef = useRef(false);

        // Quill configuration
        const quillConfig = {
            theme: "snow",
            placeholder,
            readOnly,
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
                    ["clean"],
                ],
            },
        };

        // Initialize Quill
        useEffect(() => {
            if (!containerRef.current) return;

            // Prevent double initialization in React Strict Mode
            if (quillRef.current) {
                console.log(
                    "Quill instance already exists, skipping initialization"
                );
                return;
            }

            // Clean up any existing Quill editor in the container
            const existingEditor =
                containerRef.current.querySelector(".ql-container");
            if (existingEditor) {
                console.log("Removing existing Quill editor");
                containerRef.current.innerHTML = "";
            }

            // Create Quill instance
            quillRef.current = new Quill(containerRef.current, quillConfig);

            // Handle text changes
            const handleTextChange = (delta, oldDelta, source) => {
                if (isUpdatingRef.current) return;

                const content = quillRef.current.root.innerHTML;
                const cleanContent = content === "<p><br></p>" ? "" : content;

                console.log("Quill text change:", {
                    source,
                    content: cleanContent.substring(0, 50) + "...",
                });

                if (onChange) {
                    onChange(cleanContent, source);
                }
            };

            quillRef.current.on("text-change", handleTextChange);

            // Force enable editor
            quillRef.current.enable(true);
            console.log("Quill editor initialized and enabled");

            // Cleanup
            return () => {
                if (quillRef.current) {
                    console.log("Cleaning up Quill editor");
                    quillRef.current.off("text-change", handleTextChange);
                    // Remove Quill from DOM
                    if (containerRef.current) {
                        containerRef.current.innerHTML = "";
                    }
                    quillRef.current = null;
                }
            };
        }, []);

        // Update content when value prop changes
        useEffect(() => {
            if (!quillRef.current || isUpdatingRef.current) return;

            const currentContent = quillRef.current.root.innerHTML;
            const normalizedValue = value || "";
            const emptyContent = "<p><br></p>";

            // Normalize empty content for comparison
            const normalizedCurrent =
                currentContent === emptyContent ? "" : currentContent;

            if (normalizedCurrent !== normalizedValue) {
                isUpdatingRef.current = true;
                quillRef.current.root.innerHTML =
                    normalizedValue || emptyContent;
                isUpdatingRef.current = false;
                console.log("Quill content updated from props");
            }
        }, [value]);

        // Update readOnly state
        useEffect(() => {
            if (quillRef.current) {
                quillRef.current.enable(!readOnly);
                console.log("Quill readOnly state:", readOnly);
            }
        }, [readOnly]);

        // Update placeholder
        useEffect(() => {
            if (quillRef.current && containerRef.current) {
                const editor = containerRef.current.querySelector(".ql-editor");
                if (editor) {
                    editor.setAttribute("data-placeholder", placeholder);
                }
            }
        }, [placeholder]);

        // Expose methods to parent component
        useImperativeHandle(
            ref,
            () => ({
                getQuill: () => quillRef.current,
                getContent: () => quillRef.current?.root.innerHTML || "",
                setContent: (content) => {
                    if (quillRef.current) {
                        isUpdatingRef.current = true;
                        quillRef.current.root.innerHTML = content || "";
                        isUpdatingRef.current = false;
                    }
                },
                focus: () => quillRef.current?.focus(),
                enable: (enabled = true) => quillRef.current?.enable(enabled),
                disable: () => quillRef.current?.enable(false),
            }),
            []
        );

        return (
            <div className={`quill-wrapper ${className}`} style={style}>
                <div
                    ref={containerRef}
                    className="min-h-[200px] bg-neutral-50 dark:bg-neutral-700"
                    style={{
                        fontSize: "14px",
                        fontFamily:
                            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    }}
                />
            </div>
        );
    }
);

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
