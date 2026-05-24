const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "royal_bikes");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dztzglzxz/image/upload",
    { method: "POST", body: formData }
  );

  const data = await res.json();
  return data.secure_url; // यो URL Firestore मा save हुन्छ
};

export default uploadImage;