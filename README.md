<h1>Guess the Number App</h1>

Welcome to the "Guess the Number" app! This is a simple interactive game where players can try to guess a randomly generated number.

The app is divided into two directories: server and client.

**Below are instruction on how to download and play locally**

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

```
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

```
cd client
npm install
```

Also, signup to Cloudinary. 
Then create a .env file in the root of the client folder and populate like so

```
REACT_APP_CLOUDINARY_USERNAME=<your cloudinary username>
REACT_APP_CLOUDINARY_PRESET=<your cloudinary preset>
```

**Running the Client**

To start the client, run the following command within the client directory:

```
npm start
```

This will launch the client application in your browser.

**How to Play**

1. Open your web browser and go to the provided URL where the client is running.
2. You'll be presented with the game interface.
3. Try to guess the randomly generated number by inputting your guess in the provided field and clicking the "Submit" button.
4. The app will give you feedback on whether your guess is too high, too low, or correct.
5. Keep guessing until you find the correct number!

Enjoy playing the "Guess the Number" game!

<h1>Brief</h1>

The two services will play the game “Guess the Number”.  

The first service, the game host, will expose an authenticated REST API, where the other service, the player, can initiate and play the game:  
  
On initiation, the game host assigns a unique identifier and a random number between 1 and 10000 to the game and returns the identifier to the client service.  

In the subsequent steps, the player service sends the identifier and its guess to the game host service, where it receives a response whether that number is equal, smaller, or larger than the one the game host thought of.  
    
When the number was successfully guessed, the instance of the game is considered finished. The respective data can eventually be cleaned up.  

Only registered players can play the game, so all API endpoints of the game host service have to be protected with some kind of authentication.  

The solution should be hosted in Microsoft Azure Cloud using the free subscription and the Azure components of your choice. 

A frontend interface should be built for the player to initiate and play the game.

<h1>Assumptions</h1>

1. I can must host on Azure

2. I can use mongoDB account instead of mongoDB instance through Azure as the minimum throughput on the free azure plan is lower than what my app requires even when scaled down to a minimum.

3. "The respective data can eventually be cleaned up" likely refers to the data associated with each game instance. I will store the game id in session storage and clear it when the correct guess has been made. Logged in user only cleared on log out.

<h1>Self-rating assessment</h1>

Please "rate" yourself on a scale from 1 to 10 for the following categories: 
  
- Solution architecture - 4
   
- Software Development Life Cycle (SDLC) - 4
   
- Cloud providers (GCP, AWS, Azure) - 5
   
- Incident Management - 5
   
- DevOps Engineering - 5
   
Production Readiness - 5

The scale 1 being "I've heard about it at the bar yesterday" while the scale 10 is you wrote a book about it and you're a recognized expert in that area. 