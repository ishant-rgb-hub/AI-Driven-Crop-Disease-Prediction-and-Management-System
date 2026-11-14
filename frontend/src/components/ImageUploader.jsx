import React, { useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validateImage(file) {
  if (!file) return "Please choose an image.";
  if (!ACCEPTED_TYPES.includes(file.type)) return "Please choose a JPG, JPEG, or PNG image.";
  if (file.size > MAX_FILE_SIZE) return "Images must be 5 MB or smaller.";
  return "";
}

export default function ImageUploader({ file, preview, onSelect, onRemove }) {
  const inputRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);

  function choose(candidate) {
    const error = validateImage(candidate);
    if (error) {
      onSelect(null, error);
      return;
    }
    onSelect(candidate, "");
  }

  return (
    <div className="person1-uploader">
      {!file ? (
        <button
          className="dropzone person1-dropzone"
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            choose(event.dataTransfer.files[0]);
          }}
        >
          <span className="upload-icon">↑</span>
          <strong>Drop a leaf image here</strong>
          <span>or click to browse · JPG, JPEG or PNG · max 5 MB</span>
        </button>
      ) : (
        <div className={`person1-preview ${zoomed ? "person1-preview-zoomed" : ""}`}>
          <img src={preview} alt="Selected crop leaf" />
          <div className="person1-preview-actions">
            <button type="button" className="replace" onClick={() => setZoomed((value) => !value)}>
              {zoomed ? "Close zoom" : "Zoom image"}
            </button>
            <button type="button" className="replace" onClick={() => inputRef.current?.click()}>
              Replace image
            </button>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/png,image/jpeg"
        onChange={(event) => {
          choose(event.target.files[0]);
          event.target.value = "";
        }}
      />
      {file && (
        <div className="selected-file">
          <span>✓</span>
          <div>
            <strong>{file.name}</strong>
            <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
          </div>
          <button type="button" onClick={onRemove}>Remove</button>
        </div>
      )}
    </div>
  );
}
