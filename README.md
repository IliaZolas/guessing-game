<h1>Guess the Number App</h1>

Welcome to the "Guess the Number" app! This is a simple interactive game where players can try to guess a randomly generated number.

The app is divided into two directories: server and client.

<h1>Download and play Locally</h1>

<h2>Server</h2>

The server directory contains the backend of the app.

**Installation**

To install the server dependencies, navigate to the server directory:

```
cd server
npm install
```

Also, signup to mongoDB and create a cluster.
Then create a .env file and populate it like so

````
DATABASE_ACCESS=<your-connection-string>
```

**Running the Server**

To start the server, run the following command within the server directory:

```
npm run dev
```

The server will start running, allowing the client to communicate with it.

<h2>Client</h2>

The client directory contains the frontend of the app.

**Installation**

To install the client dependencies, navigate to the client directory:

````
cd client
npm install
````

Also, signup to cloudinary. 
Then create a .env file in the root of the client folder and populate like so

````
REACT_APP_CLOUDINARY_USERNAME=<your cloudinary username>
REACT_APP_CLOUDINARY_PRESET=<your cloudinary preset>
```

**Running the Client**

To start the client, run the following command within the client directory:

````
npm start
````

This will launch the client application in your browser.

**How to Play**

1. Open your web browser and go to the provided URL where the client is running.
2. You'll be presented with the game interface.
3. Try to guess the randomly generated number by inputting your guess in the provided field and clicking the "Submit" button.
4. The app will give you feedback on whether your guess is too high, too low, or correct.
5. Keep guessing until you find the correct number!

Enjoy playing the "Guess the Number" game!