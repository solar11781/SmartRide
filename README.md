# 🚗 SmartRide - Uber Clone

SmartRide is a ride-sharing web application built using:

- **React, Tailwind CSS** (Frontend)
- **PHP** (Backend)
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
2. Copy the backend PHP files into your **XAMPP `htdocs` directory**:
   ```sh
   xampp/htdocs/
   ```
   - Move `api_user.php` and `apis.php` into the above directory.
3. Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
4. Make a database called `smartride` and import the `smartride.sql` database file.

### 3️⃣ Install Dependencies & Start the React App

If this is your **first time cloning the repo**, install the necessary dependencies:

```sh
npm install
```

Then, start the development server:

```sh
npm run dev
```

## 4️⃣ Run Node.js Backend
```sh
cd smartride/backend
node server.js
```

---

## 📌 Project Structure

```
smartride/
│── backend
│── node_modules
│── public
│── src/
│   ├── assets/
│   ├── components/  # Reusable UI components
│   ├── pages/       # App pages
│── .env
│── package.json
│── README.md
│── ...
```