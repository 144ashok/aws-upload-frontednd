import React, { useState } from "react";
import axios from "axios";

function UploadFile() {
    const [file, setFile] = useState<Blob>(new Blob());
    const [uploadedKey, setUploadedKey] = useState("");

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
        </div>
    );
}

export default UploadFile;
