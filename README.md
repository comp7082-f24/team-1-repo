cd frontend 
<br>
npm i
<br>
npm run build
<br>
<br>
cd ..
<br>
<br>
cd backend
<br>
npm i
<br>
npm start
___
Live Production deployment: https://team-1-repo.onrender.com/
___
Code Structure:

The webapp is split into 2 directories, frontend and backend.

Frontend contains the React framework code while the backend contains the Node & Express code for our own REST API Endpoints.

Frontend structure
```
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── robots.txt
├── src
│   ├── components
│   │   ├── **/*.css
│   ├── images
│   │   ├── **/*.css
│   ├── tests
│   │   ├── **/*.css
│   ├── utils
│   │   ├── **/*.css
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── output.css
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── types.d.ts
├── .npmrc
├── README.md
├── package-lock.json
├── package.json
├── tailwind.config.js
└── tsconfig.json
```
- Public contains files for public deployment such as favicon and robots.txt file
- components, pages, and utils contains js files for frontend work

Backend structure
```
├── backend
│   ├── models
│   ├── tests
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
```
- Models contains the database models for accounts and saved queries/searches
- Tests contains the test cases
- index.js is starting point for server startup
- server.js contains REST API Endpoints seperated by routes
