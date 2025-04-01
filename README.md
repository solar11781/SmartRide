# 🚗 SmartRide - Online Ride-Sharing Platform

SmartRide is a ride-sharing web application built using:

- **React, Tailwind CSS** (Frontend)
- **Node.js** (Backend)
- **MySQL** (Database)
- **Mapbox API** (Maps & Navigation)

---

## 🚀 How to Run the Project

### 1️⃣ Create a Mapbox Account & Get an API Token

1. Go to [Mapbox](https://www.mapbox.com).
2. Sign up or log in.
3. Copy your **Mapbox Access Token**
4. Create a `.env` file in the root directory and add your token:

   ```ini
   VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
   ```

### 2️⃣ Set Up XAMPP (PHP & MySQL Backend)

1. Open **XAMPP** and **start** the following services:
   - **Apache** (for PHP)
   - **MySQL** (for the database)
2. Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Make a database called `smartride` and import the `smartride.sql` database file (from src\assets).

### 3️⃣ Install Dependencies & Start the React App

If this is your **first time cloning the repo**, install the necessary dependencies:

```sh
npm install
```

Then, start the development server:

```sh
npm run dev
```

## 4️⃣ Install Backend Dependencies & Run the Node.js Server

Open another command prompt and install the backend dependencies:

```sh
cd backend
npm install
```

And then start the development server:

```sh
node server.js
```

---

Admin account:
   - **Username**: admin
   - **Password**: 111
   
(All dummy accounts imported into the database have the same password)

---

## 📌 Project Structure

```
smartride/
│── backend
│── node_modules
│── public
│── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│── .env
│── package.json
│── README.md
│── ...
```
