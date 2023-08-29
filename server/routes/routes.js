"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("../models/users"));
const users_2 = __importDefault(require("../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("./auth"));
const cors_1 = __importDefault(require("cors"));
const game_1 = require("../game-logic/game");
const routes = express_1.default.Router();
// Use cors middleware for all routes
routes.use((0, cors_1.default)());
// Index Routes
routes.get('/', (req, res) => {
    res.send('Hello world');
});
// Route to check authentication status
routes.get('/check-auth', (req, res) => {
    res.status(200).json({ authenticated: true });
});
// User Routes
routes.post('/signup', (req, res) => {
    bcrypt_1.default
        .hash(req.body.password, 10)
        .then((hashedPassword) => {
        const user = new users_1.default({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: hashedPassword,
            imageUrl: req.body.imageUrl,
            public_id: req.body.publicId,
        });
        user
            .save()
            .then((result) => {
            res.status(201).send({
                message: 'User Created Successfully',
                result,
            });
        })
            .catch((error) => {
            console.log(error),
                res.status(500).send({
                    message: 'Error creating user',
                    error,
                });
        });
    })
        .catch((e) => {
        res.status(500).send({
            message: 'Password was not hashed successfully',
            e,
        });
    });
});
routes.post('/login', (req, res) => {
    console.log('login route triggered');
    // compare login credentials
    users_2.default.findOne({ email: req.body.email })
        .then((user) => {
        console.log('user object:', user);
        //if no user found, respond not found
        if (!user) {
            res.status(404).send({
                message: 'Email not found',
            });
            return;
        }
        //use bcrypt to to check password with found user
        bcrypt_1.default
            .compare(req.body.password, user.password)
            .then((passwordCheck) => {
            console.log('password check object:', passwordCheck);
            //if false, say login failed
            if (passwordCheck === false) {
                console.log('No password provided or wrong password');
                res.status(200).send({
                    message: 'Login Failed',
                    email: user.email,
                    userId: user._id,
                    passwordCheck
                });
            }
            else {
                // else generate tokens
                const refreshToken = jsonwebtoken_1.default.sign({
                    userId: user._id,
                    userEmail: user.email,
                }, 'refreshTokenSecret', { expiresIn: '7d' });
                const accessToken = jsonwebtoken_1.default.sign({
                    userId: user._id,
                    userEmail: user.email,
                    refreshToken: refreshToken,
                }, 'accessTokenSecret', { expiresIn: '24h' });
                console.log("login route: token ->", accessToken);
                console.log("Login route: refreshToken ->", refreshToken);
                // set httponly tokens
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: false,
                });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: false,
                });
                // send successful login and tokens
                res.status(200).send({
                    message: 'Login Successful',
                    email: user.email,
                    userId: user._id,
                    accessToken,
                    refreshToken
                });
            }
        })
            .catch((error) => {
            res.status(400).send({
                message: 'Passwords do not match',
                error,
            });
        });
    })
        .catch((e) => {
        res.status(500).send({
            message: 'An error occurred',
            error: e,
        });
    });
});
routes.get('/user/show/:id', auth_1.default, (req, res) => {
    const userId = req.params.id;
    console.log('GET SINGLE USER RECORD:', userId);
    users_2.default.findOne({ _id: userId }).then((data) => res.json(data));
});
routes.put('/user/update/:id', auth_1.default, (req, res) => {
    const userId = req.params.id;
    console.log('update user id route', userId);
    users_2.default.updateOne({ _id: userId }, {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId,
    }).then((data) => res.json(data));
});
// Game routes
routes.get('/start-the-game', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, game_1.gameLogic)(req, res);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).json({ error: errorMessage });
        console.log("this is the start-the-game error message");
    }
}));
exports.default = routes;
