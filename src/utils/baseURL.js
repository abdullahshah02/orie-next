const baseURL = process.env.NODE_ENV === "production"
    ? "https://someURL"
    : "http://localhost:3000"

export default baseURL;