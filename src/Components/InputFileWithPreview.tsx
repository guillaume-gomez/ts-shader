import React from 'react';

interface InputFileWithPreviewProps {
  imageBase64?: string|null;
  onChange: (base64data: string) => void;
}

function InputFileWithPreview({onChange, imageBase64} : InputFileWithPreviewProps) {
  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = function() {
        const image = new Image();
        image.src = reader.result;
        image.onload = function () {
            const base64data = reader.result;
            onChange(base64data as string, image.width, image.height);
        };

      }
    }
  }

  return (
    <div className="flex gap-3">
      <label className="w-full flex flex-col justify-center items-center px-2 bg-base-200 text-primary rounded-lg shadow-lg tracking-wide uppercase border-2 border-primary transition duration-300 ease-in-out bg-opacity-40 cursor-pointer hover:bg-primary hover:text-white">
        <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span className="mt-2 leading-normal">Select a picture</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={loadImage}
        />
      </label>
      {
        imageBase64 ?
        <img src={imageBase64} style={{ minWidth: "64px", maxWidth: "100px"}}/> :
        <span>Nothing to render</span>

      }
    </div>
  );
}

export default InputFileWithPreview;