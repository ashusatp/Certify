require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const QRCode = require("qrcode");
const stream = require("stream");
const crypto = require("crypto");
const connectDB = require("./configs/Database");
const cookieParser = require("cookie-parser");
connectDB();

const randomPdfName = (bytes = 16) => crypto.randomBytes(bytes).toString("hex");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { adminRoutes, userRoutes } = require("./routes");
const { default: axios } = require("axios");
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION;
const awsS3BucketName = process.env.AWS_S3_BUCKET_NAME;

const s3 = new S3Client({
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
  region: awsRegion,
});

const app = express();
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Function to generate QR code
// const generateQRCode = async (text) => {
//   return QRCode.toBuffer(text, { type: "png" });
// };

// Function to save the PDF locally
// const savePDFLocally = (pdfBuffer, name) => {
//   const filePath = path.join(__dirname, "certificates", `${name}.pdf`);
//   return new Promise((resolve, reject) => {
//     fs.writeFile(filePath, pdfBuffer, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(filePath);
//       }
//     });
//   });
// };

// Function to delete an object from S3
// const deleteObjectFromS3 = async (fileName) => {
//   const params = {
//     Bucket: bucketName,
//     Key: `certificates/${fileName}`, // Path in the S3 bucket (same as the key used for uploading)
//   };

//   const command = new DeleteObjectCommand(params);

//   try {
//     const response = await s3.send(command);
//     console.log("Successfully deleted:", fileName);
//     return response;
//   } catch (err) {
//     throw new Error(`Failed to delete object from S3: ${err.message}`);
//   }
// };

// Function to save the PDF on S3
// const uploadPDFToS3 = async (pdfBuffer, name) => {
//   const params = {
//     Bucket: awsS3BucketName,
//     Key: `certificates/${randomPdfName()}.pdf`,
//     Body: pdfBuffer,
//     ContentType: "application/pdf",
//   };

//   const command = new PutObjectCommand(params);

//   try {
//     const response = await s3.send(command);
//     return `https://${awsS3BucketName}.s3.amazonaws.com/certificates/${name}.pdf`;
//   } catch (err) {
//     throw new Error(`Failed to upload PDF to S3: ${err.message}`);
//   }
// };

app.get("/api/pdf-proxy", async (req, res) => {
  try {
    const {url} = req.query
    const response = await axios.get(url, { responseType: "arraybuffer" });
    res.set("Content-Type", "application/pdf");
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching the PDF");
  }
});

// app.post("/upload-certificate", async (req, res) => {
//   const { name, image } = req.body;

//   try {
//     // Generate QR code
//     const qrCodeBuffer = await generateQRCode(
//       "https://your-verification-url.com/verify"
//     );

//     // Create a PDF document
//     const doc = new PDFDocument();
//     const pdfStream = new stream.PassThrough();
//     doc.pipe(pdfStream);

//     // // Add the QR code to the first page
//     // doc.addPage();
//     doc.image(qrCodeBuffer, {
//       fit: [300, 300],
//       align: "center",
//       valign: "center",
//     });

//     doc.text("Certificate Verification QR Code", {
//       align: "center",
//       valign: "bottom",
//     });

//     // Add a new page for the certificate
//     doc.addPage();
//     const imgBuffer = Buffer.from(
//       image.replace(/^data:image\/png;base64,/, ""),
//       "base64"
//     );
//     doc.image(imgBuffer, {
//       fit: [500, 400],
//       align: "center",
//       valign: "center",
//     });
//     // Finalize the PDF and end the stream
//     doc.end();

//     // Collect the PDF in a buffer
//     const pdfBuffer = await new Promise((resolve, reject) => {
//       const buffers = [];
//       pdfStream.on("data", buffers.push.bind(buffers));
//       pdfStream.on("end", () => resolve(Buffer.concat(buffers)));
//       pdfStream.on("error", reject);
//     });

//     // Save the PDF locally
//     // const filePath = await savePDFLocally(pdfBuffer, name);

//     // Save the PDF on S3
//     const s3Url = await uploadPDFToS3(pdfBuffer, name);

//     res.status(200).json({
//       message: "Certificate created and uploaded successfully",
//       url: s3Url,
//     });
//   } catch (error) {
//     console.error("Error creating or saving PDF:", error);
//     res.status(500).json({ message: "Error uploading certificate" });
//   }
// });

app.use("/admin", adminRoutes);
app.use("/user", userRoutes)

const PORT = process.env.APP_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
