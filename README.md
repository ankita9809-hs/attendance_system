# attendance_system

##Project Setup

1. Create a project directory:
   mkdir attendance-management-system
   cd attendance-management-system
2. Initialize the project:
   npm init -y
3. Install dependencies:
   npm install express mongoose dotenv
4. Project Structure:
   attendance_system/
   ├── package.json
   ├── package-lock.json
   ├── .gitignore
   ├── .env
   ├── README.md
   ├── index.js
   └── src/
   ├── apiRoutes/
   │ └── controllers/
   │ └── system.js
   │ └── models/
   │ └── timeSlots.js
   │ └── users.js
   │ └── routes/
   │ └── index.js
   │ └── system.js
   ├── config/
   │ └── database.js
   │ └── env.js
   └── utils/
   └── response
5. package.json: Stores project dependencies and scripts.
6. README.md: This file contains in and out information of project.
7. index.js: The main application entry point.
8. src/apiRoutes/models/timeSlots.js: Defines the Mongoose model for timeSlots data.
9. src/apiRoutes/models/users.js: Defines the Mongoose model for users data.
10. src/apiRoutes/routes/system.js: Defines API endpoints for attendance management.
11. src/apiRoutes/controllers/system.js: Contains all the APIs for attendance management.
12. src/config/database.js: Stores database connection details.
13. src/config/env.js: Contains the environmental variables.
14. src/utils/response.js: Provides common function file to be used entirely in the system.

15. Database Setup
    Create a src/config/database.js file and add MongoDB connection string

16. Assumption:
    1. No two checkedIn times can collide with each other for a single day.
    2. If one checkedIn time is at 10:00 the other checkedIn time for the same day can not be less than 10:00
    3. To input another checkdIn the user has to checkedout first and then only he can checkIn again
    4. CheckedOut time should not be less than the checkedIn time for the particular day.
    5. To get month wise reports, one need to input the months from the given list [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
