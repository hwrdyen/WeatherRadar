# WeatherRadar

## Overview
![weatherradar-responsive-mockup](https://github.com/user-attachments/assets/ef514f5f-e04e-4672-b043-d1f1c6c9e5b4)

**WeatherRadar** is a responsive full-stack web application for tracking current weather conditions, viewing historical data, and managing weather snapshots with secure authentication. It features real-time data fetching, user-friendly database interactions using Prisma with PostgreSQL, and a dynamic React-based UI that ensures a seamless user experience across all devices.

## Getting Started

### Prerequisites
This is an example of how to install the prerequisite softwares.
- npm
  ```sh
  npm install npm@latest -g
  ```
- Setup front-end env variable (.env file inside client folder)
1. Setup VITE_API_BASE_URL
  ```sh
  VITE_API_BASE_URL=http://localhost:8080/api
  ```
- Setup back-end env variable (.env file inside server folder)
1. Setup PORT
  ```sh
  PORT="8080"
  ```
2. Setup FRONTEND_URL
  ```sh
  FRONTEND_URL=http://localhost:5173
  ```
3. Connect with TEMBO PostgreSQL Database
- Access the Connection String by creating a TEMBO account and setting up a Standard Stack instance. (TEMBO's official website: https://tembo.io/)
- ![image](https://github.com/user-attachments/assets/a370139e-540c-4f38-a115-dcca5613ad70)

  ```sh
  DATABASE_URL={Connection Strings from the created instance}
  TEMBO_CA={Receive the certificate from downloading the SSL certificate}
  ```
4. Setup JWT_SERCRET_KEY (Generate: https://www.javainuse.com/jwtgenerator)
  ```sh
  JWT_SECRET_KEY={Generated JWT key}
  ```
### Installation
_Below is an example of how you can install and set up the WeatherRadar application._
- To start the front-end
1. Change to "client" folder
   ```sh
   cd client
   ```
2. Run the front-end
   ```sh
   npm run dev
   ```
- To start the back-end (PostgreSQL database)
1. Change to "server" folder
   ```sh
   cd server
   ```
2. Run the back-end (PostgreSQL database)
   ```sh
   npm run start
   ```
- To start the database-management (Prisma)
1. Change to "server" folder
   ```sh
   cd server
   ```
2. Run the back-end (Prisma)
   ```sh
   npx prisma studio
   npx prisma generate
   npx prisma db push
   ```

## Introduction
Key tech stack and tools that are utilized in this project:
- Express.js for API routing and user authentication.
- Prisma & PostgreSQL for database management.
- Real-time Weather Data fetching with RESTful APIs.
- Responsive UI with React and advanced hooks like Context API.
- JWT-based Authentication for user security.

## Description
Welcome to WeatherRadar, your all-in-one platform for tracking weather conditions and trends. WeatherRadar is designed to offer users real-time weather data, the ability to save snapshots, and access historical weather data, all in an intuitive and responsive interface. Built with the robust React, Express.js, and PostgreSQL stack, our application delivers a seamless experience whether you're on a desktop or mobile device.

At WeatherRadar, security and ease of use are paramount. Users can register, log in, and store personalized weather snapshots, with secure authentication using JWT. The platform allows users to view current weather conditions, forecasted weather, and 5-day historical temperature charts. The stored weather readings can be easily accessed and managed through the database using Prisma. Our React-based front end ensures smooth transitions and an engaging user experience.

Explore WeatherRadar and take advantage of our cutting-edge features for a comprehensive weather-tracking experience. We’re here to help you stay informed about the weather conditions that matter to you, whether today or in the days ahead.
