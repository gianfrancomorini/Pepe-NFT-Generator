Pepe NFT Generator

Welcome to the Pepe NFT Generator! This project is a web application designed to create and mint custom Pepe NFTs based on user inputs. It’s a complete full-stack solution with a React frontend and a Node.js/Express backend, deployed to AWS Elastic Beanstalk. Explore your creativity and bring your Pepe ideas to life!

Features

Frontend

	•	User Input Form: Collects user inputs such as emotion, clothes, accessories, and background.
	•	AI Image Generation: Sends the input data to the backend for AI-based image generation using OpenAI.
	•	NFT Minting: Allows users to mint the generated Pepe images as NFTs on the blockchain.
	•	Responsive Design: Optimized for desktop and mobile use.

Backend

	•	AI Integration: Generates images using OpenAI’s image generation API.
	•	Pinata Integration: Uploads generated images and metadata to IPFS via Pinata.
	•	Secure API: Implements security best practices with Helmet, rate limiting, and strict CORS policies.
	•	Health Checks: Includes enhanced health-check endpoints for AWS Elastic Beanstalk monitoring.

Deployment

	•	Domain: Hosted on pepenftgenerator.xyz, with SSL secured via AWS Certificate Manager.
	•	Infrastructure: Frontend and backend deployed on AWS Elastic Beanstalk with S3 for static assets and HTTPS support.

How It Works

	1.	User Input: Fill out the form with desired characteristics (e.g., happy emotion, suit, sunglasses, beach background).
	2.	Generate Pepe: Click “Generate Pepe” to trigger the AI-based image generation.
	3.	Mint NFT: If satisfied with the generated image, mint it as an NFT with a single click.
	4.	Own Your NFT: Your Pepe NFT is minted and stored on the blockchain.

Prerequisites

To set up the project locally, you’ll need:
	•	Node.js and npm
	•	React for frontend development
	•	AWS CLI for Elastic Beanstalk
	•	Environment variables:
	•	OPENAI_API_KEY
	•	PINATA_API_KEY
	•	PINATA_API_SECRET

Installation

1. Clone the Repository

	git clone https://github.com/gianfrancomorini/Pepe-NFT-Generator.git
cd Pepe-NFT-Generator

2. Set Up Frontend

	cd frontend
	npm install
	npm start

3. Set Up Backend

	cd backend
	npm install
	npm run dev

4. Environment Variables

Create a .env file in the backend directory:

	OPENAI_API_KEY=your_openai_api_key
	PINATA_API_KEY=your_pinata_api_key
	PINATA_API_SECRET=your_pinata_api_secret

Deployment

AWS Elastic Beanstalk

	1.	Deploy the backend using the AWS CLI:

	eb init
	eb create


	2.	Deploy the frontend:

	npm run build
	aws s3 sync build/ s3://your-s3-bucket-name --acl public-read



Domain and SSL

	•	Domain: pepenftgenerator.xyz
	•	SSL Certificate: Managed by AWS Certificate Manager and associated with the Elastic Load Balancer.

Contributing

Contributions are welcome! Please submit a pull request or open an issue if you have suggestions or bug reports.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Happy minting! 🎨🐸