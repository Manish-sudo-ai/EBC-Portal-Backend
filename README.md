# EBC Portal Backend

Backend API for EBC Portal built with Node.js and Express.js

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
  - For macOS: `brew install mysql`
  - For Windows: Download MySQL installer
  - For Linux: `sudo apt-get install mysql-server`

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Manish-sudo-ai/EBC-Portal-Backend.git
cd EBC-Portal-Backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `express` - Web framework
- `mysql2` - MySQL client
- `dotenv` - Environment variable management
- `nodemon` - Development auto-reload (dev dependency)

### 3. Database Setup

#### Start MySQL Service

**macOS:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo service mysql start
```

**Windows:**
- Start MySQL service from Services panel or MySQL Workbench

#### Create Database

Connect to MySQL and create the database:

```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE IF NOT EXISTS ebc_portal;
USE ebc_portal;

-- Create users table (example)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (username, email) VALUES 
  ('test_user', 'test@example.com'),
  ('admin', 'admin@ebc-portal.com');
```

Or use the command line directly:
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ebc_portal;"
```

### 4. Environment Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ebc_portal
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password. Leave it empty if you haven't set a password.

### 5. Test Database Connection

Before running the server, you can test your database connection:

```bash
mysql -u root -p -e "USE ebc_portal; SHOW TABLES;"
```

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

The server will start on `http://localhost:3000` and automatically reload when you make changes.

### Production Mode

```bash
npm start
```

### Verify Server is Running

You should see output like:
```
✓ Database connected successfully!
✓ Connected to database: ebc_portal

🚀 Server is running on port 3000
📍 URL: http://localhost:3000

📊 Available endpoints:
   GET  /           - Welcome message
   GET  /health     - Health check
   GET  /db-test    - Test database connection
   GET  /db-tables  - List all database tables
   GET  /users      - Get all users
```

## API Endpoints

### General Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message and API status |
| GET | `/health` | Health check endpoint with timestamp |

### Database Testing Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/db-test` | Test database connection and query execution |
| GET | `/db-tables` | List all tables in the database |
| GET | `/users` | Retrieve all users from the database |

### Example API Calls

**Test Database Connection:**
```bash
curl http://localhost:3000/db-test
```

**Get All Users:**
```bash
curl http://localhost:3000/users
```

**Health Check:**
```bash
curl http://localhost:3000/health
```

## Project Structure

```
EBC-Portal-Backend/
├── config/
│   └── database.js       # Database configuration and connection pool
├── node_modules/         # Dependencies (auto-generated)
├── index.js              # Main application entry point
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Locked versions of dependencies
├── .env                  # Environment variables (not in git)
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore rules
├── LICENSE               # Project license
└── README.md             # This file
```

## Troubleshooting

### Database Connection Issues

**Problem:** `ER_ACCESS_DENIED_ERROR`
- **Solution:** Check your MySQL username and password in `.env`
- Verify MySQL is running: `mysql -u root -p`

**Problem:** `ER_BAD_DB_ERROR`
- **Solution:** Database doesn't exist. Create it using:
  ```bash
  mysql -u root -p -e "CREATE DATABASE ebc_portal;"
  ```

**Problem:** `ECONNREFUSED`
- **Solution:** MySQL service is not running. Start it:
  - macOS: `brew services start mysql`
  - Linux: `sudo service mysql start`

### Port Already in Use

If port 3000 is already in use:
1. Change the `PORT` in your `.env` file
2. Or kill the process using port 3000:
   ```bash
   lsof -ti:3000 | xargs kill
   ```

### Node Version Issues

Check your Node.js version:
```bash
node --version
```

If it's below v18, update Node.js or use [nvm](https://github.com/nvm-sh/nvm) to manage versions.

## Development Workflow

1. **Switch to develop branch:**
   ```bash
   git checkout develop
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and test:**
   ```bash
   npm run dev
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Push to GitHub:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 3000 | No |
| `NODE_ENV` | Environment (development/production) | development | No |
| `DB_HOST` | MySQL host address | localhost | Yes |
| `DB_USER` | MySQL username | root | Yes |
| `DB_PASSWORD` | MySQL password | (empty) | Yes |
| `DB_NAME` | Database name | ebc_portal | Yes |

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL 2** - MySQL client for Node.js
- **dotenv** - Environment variable management
- **Nodemon** - Development auto-reload

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/Manish-sudo-ai/EBC-Portal-Backend/issues)
- Contact the development team

