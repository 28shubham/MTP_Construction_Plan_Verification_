const { spawn } = require("child_process");
const path = require("path");

exports.processPDF = (req, res) => {
  const filePath = req.file.path;

  const pythonProcess = spawn("python", [
    path.join(__dirname, "../python/extract_rooms.py"),
    filePath,
  ]);

  let data = "";
  pythonProcess.stdout.on("data", (chunk) => {
    data += chunk;
  });

  pythonProcess.stderr.on("data", (chunk) => {
    console.error(`Error: ${chunk}`);
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.status(200).json({
        status: "success",
        message: "PDF processed successfully",
        data: JSON.parse(data),
      });
    } else {
      res
        .status(500)
        .json({ status: "error", message: "Failed to process PDF" });
    }
  });
};
