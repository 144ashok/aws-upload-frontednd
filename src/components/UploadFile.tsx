import React, { useEffect, useState } from "react";
import axios from "axios";

function UploadFile() {
    const [file, setFile] = useState<Blob>(new Blob());
    const [uploadedKey, setUploadedKey] = useState("");
    const [documentContents, setDocumentContents] = useState<any[]>([]);

    const uploadFile = async () => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("http://localhost:5000/upload", formData);
        alert("Uploaded!");

        setUploadedKey(res.data.key);
    };

    const downloadFile = () => {
        window.open(`http://localhost:5000/download/${uploadedKey}`);
    };

    const downloadBlobFile = async (fileName: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/download-file/${fileName}`, { responseType: 'blob' });
            const blob = response.data;

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    useEffect(() => {
        const fetchDocumentContents = async () => {
            const res: { data: { message: string; files: any[] } } = await axios.get("http://localhost:5000/allDocument");

            setDocumentContents(res.data.files);
            console.log(res.data.files);
        };

        fetchDocumentContents();
    }, []);

    return (
        <div>
            <h2>Upload File to AWS</h2>

            <input type="file" onChange={(e: any) => setFile(e.target.files[0] as Blob)} />

            <button onClick={uploadFile}>Upload</button>

            <h3>Uploaded File Key:</h3>
            <p>{uploadedKey}</p>

            {uploadedKey && (
                <button onClick={downloadFile}>Download File</button>
            )}

            <h2>All Documents:</h2>
            {documentContents.length > 0 && documentContents.map((document: any, index: number) => (
                <div key={document.key} className="document">
                    <h3>{index}:</h3>
                    <h3>{document.Key}</h3>
                    <button type="button" onClick={() => downloadBlobFile(document.Key)}>Download</button>
                </div>)
            )}
        </div>
    );
}

export default UploadFile;
