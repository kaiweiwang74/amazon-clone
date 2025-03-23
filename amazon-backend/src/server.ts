import app from "./app";

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Server is running!");
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
