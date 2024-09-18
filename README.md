# Certificate Management System

This project is a comprehensive system for certificate management. It allows admins to upload, create, and update certificates with integrated QR codes for verification, store them securely in the cloud, and automatically send generated certificates via email to users. The system also includes version history tracking, session management, and secure logout features.


![1](https://github.com/user-attachments/assets/5cdadc2b-869d-4060-bf66-891a43e852da)
![3Certify](https://github.com/user-attachments/assets/0f04465e-c087-4c59-aebf-17669fcdf00a)
![4Certify](https://github.com/user-attachments/assets/fc0436ff-c04a-4068-a518-262e02a9e970)
![5Certify](https://github.com/user-attachments/assets/598ee850-f3f3-48f3-b39b-b3f14e2e1255)
![7](https://github.com/user-attachments/assets/15ad7267-ea60-40ec-bf62-d876af406f82)
![8](https://github.com/user-attachments/assets/d541a5cf-544a-4962-92d0-461805b70d57)
![9](https://github.com/user-attachments/assets/653361fd-d59a-4c5b-9224-a33e90abfdf5)


## Features

- **Certificate Generation**: Admins can dynamically generate certificates from HTML/CSS, embedding QR codes for verification.
- **PDF Creation**: Converts certificate data into PDF format using PDFKit.
- **QR Code Integration**: Automatically adds a QR code on the first page of the generated certificate for easy verification.
- **AWS S3 Storage**: Stores generated certificates securely in an AWS S3 bucket and saves the link in the MongoDB database.
- **Email PDF Delivery**: Automatically sends generated certificates to users via email as PDF attachments using Nodemailer (SMTP).
- **Certificate Validity Management**: Allows admins to mark certificates as valid or invalid and track changes made by admins.
- **Single Logout**: Securely logs users out from all sessions using JWT for enhanced security.
- **Version History**: Tracks and saves changes made by admins to certificate details for accountability.

## Technologies Used

- **Node.js and Express.js** for server-side logic.
- **MongoDB** for storing certificate data and tracking changes.
- **AWS S3** for secure storage of generated certificate PDFs.
- **PDFKit** for generating PDFs from HTML/CSS content.
- **QR Code Generator** for embedding QR codes in certificates.
- **JWT (JSON Web Tokens)** for authentication and session management.
- **Nodemailer (SMTP)** for sending certificates via email.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/ashusatp/Certify.git
