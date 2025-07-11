


// All packages for starting our server and connecting it to the Database

const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");

const express = require("express");
const app = express();

app.use(express.json()); // <== REQUIRED to read JSON body


// 0.0.0.0/0 -> THis IP address will provide access of our database to every part of the world.

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers"); // It removes 'node' and 'index.js' from process.argv
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { revertRepo } = require("./controllers/revert");



dotenv.config(); // now all values that are present in the .env file will be accesssible through process

const argv = yargs(hideBin(process.argv))

    .command("start", "Start the new Server", {}, startServer)

    .command("init", "Initialize the repository", {}, initRepo)

    .command(
        "add <file>", // <file> this is our argument that we have passed here 
        "Add a file to the repository",
        (yargs) => {
            yargs.positional("file", { // file -> argument
                type: "string",
                describe: "File to add to the staging area."
            });
        },
        // addRepo
        (argv) => {
            addRepo(argv.file); // In order to send this filePath in our add.js, where we take it and make it's copy.
        }
    )

    .command(
        "commit <message>",
        "Save changes in the staging area",
        (yargs) => {
            yargs.positional("message", {
                type: "string",
                describe: "File to commit."
            });
        },
        (argv) => {
            commitRepo(argv.message);
        }
    )

    .command("push", "Push the commits to S3", {}, pushRepo)

    .command("pull", "Pull commits from S3", {}, pullRepo)

    .command(
        "revert <commitID>",
        "Revert changes to a specific commit",
        (yargs) => {
            yargs.positional("commitID", {
                type: "string",
                describe: "File to revert"
            });
        },
        (argv) => {
            revertRepo(argv.commitID);
        }
    )
    .demandCommand(1, "You must provide a valid command!")
    .help()
    .argv;


function startServer(){

    const app = express();
    // Think of a port like an apartment number in a building. If a courier (client) wants to deliver a package (request) but no apartment number (port) is specified, the delivery (server) will fail.
    const port = process.env.PORT || 3000;
    
    // Used to parse incoming JSON request bodies into JavaScript objects.
    app.use(bodyParser.json());
    app.use(express.json());
    
    const mongoURI = process.env.MONGODB_URI;

    mongoose
        .connect(mongoURI)
        .then( () => console.log("MongoDB connected!"))
        .catch( (err) => console.error("Error in connecting to the database", err));

        
    app.use(cors ({origin: "*"})); // It means our request can come from any URL, thus here we overwrite the security concerns issues
    
    // Now from there we write our all routes in the mainRouter.
    app.use("/", mainRouter);
        
                /// Socket.io
    // Now we need to create socket in order to continuously connects with users and give updates,
    // mostly in those application where we continuously need to connect & disconnect our database then
    // to avoid this we generally make a socket connection 

    // Socket.io is a JavaScript library that enables real-time, bidirectional communication between clients (e.g., web browsers) and a server.

    let user = "Muhammad"; // Default user value

    // Purpose: Allows both HTTP and WebSocket connections. We create an HTTP server using Express so that both HTTP requests and WebSocket connections can work together.
    const httpServer = http.createServer(app);

    // Purpose: Enables real-time bidirectional communication. What happens if removed?: WebSockets won't work, and real-time features like live updates won't function.
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Allow connections from any website (can be restricted for security)
            methods: ["GET", "POST"], // Allow only GET and POST requests
        },
    });
    

    //  This listens for new clients connecting to the server. When a user opens the website, a new WebSocket connection is established.
    // Purpose: Manages WebSocket connections and room joining.
    // What happens if removed?: Clients won't be able to join rooms or communicate in real time.
    io.on("connection", (socket) => {

        // 🔹 When the client sends a "joinRoom" event with a userID:
        // ✅ We store the userID in a variable.
        // ✅ We log the userID for debugging.
        // ✅ The user joins a "room" using socket.join(userID).

        // 🔹 Why use rooms?
        // A room allows us to send messages to specific users instead of broadcasting to everyone.
        // Example: If User A and User B join room "123", we can send messages to only users in "123"

        socket.on("joinRoom", (userID) => {
            user = userID; // Update the global `user` variable with the new userID
            
            console.log("===="); // Debugging separator
            console.log(user); // Log the current user ID
            console.log("===");

            socket.join(userID); // Add the user to a room with the given `userID`
        });
    });

    // Executes operations once the database connection is established.
    const db = mongoose.connection;
    db.once("open", async () => {
        console.log("All the CRUD operations will be called...");
    })

    httpServer.listen(port, () => {
        console.log(`Server is listening to the port ${port}.`);
    })

    
}


// What If We Remove Everything?

// express()	No routes, no middleware, no server.
// bodyParser.json()	Server won’t parse JSON requests.
// mongoose.connect()	No database connectivity.
// cors({ origin: "*" })	Requests from other domains might be blocked.
// http.createServer(app)	No WebSocket support.
// new Server(httpServer, {...})	No real-time communication.
// io.on("connection")	WebSockets won't function.
// db.once("open", async () => {...})	No confirmation when the database is ready.
// httpServer.listen(port, () => {...})	Server won’t start.


// How It Works in Real-Time?
// 1️⃣ A user opens the website, and a WebSocket connection is established.
// 2️⃣ The client sends a "joinRoom" event with a userID.
// 3️⃣ The server:
// Stores the user’s ID.
// Logs it for debugging.
// Joins the user into a private room (so they can receive targeted messages).

// Real-World Example: Chat App
// 📌 Imagine a chat application where users can join chat rooms.
// If userID = "user123", they join room "user123".
// The server can then send messages only to that user instead of broadcasting to all users.

// Final Summary
// ✔ Socket.io enables real-time communication between clients and the server.
// ✔ We listen for connections (io.on("connection")) and specific events (socket.on("joinRoom")).
// ✔ Users are assigned to "rooms" using socket.join(userID), which allows targeted messaging.
