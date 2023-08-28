import express, { Request, Response } from 'express';
import { Router } from 'express';
import newUserTemplateCopy from '../models/users';
import Users from '../models/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from './auth';
import cors from 'cors';
import {gameLogic} from '../game-logic/game'

const routes: Router = express.Router();

// Use cors middleware for all routes
routes.use(cors());

// Index Routes
routes.get('/', (req: Request, res: Response) => {
        res.send('Hello world');
    });

// Route to check authentication status
routes.get('/check-auth', (req: Request, res: Response) => {
        res.status(200).json({ authenticated: true });
    });

// User Routes
routes.post('/signup', (req: Request, res: Response) => {
bcrypt
.hash(req.body.password, 10)
.then((hashedPassword) => {
    const user = new newUserTemplateCopy({
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

routes.post('/login', (req: Request, res: Response) => {
    console.log('login route triggered');

    // compare login credentials
    Users.findOne({ email: req.body.email })
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
        bcrypt
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
            } else {
                // else generate tokens
                const refreshToken = jwt.sign(
                    {
                        userId: user._id,
                        userEmail: user.email,
                    },
                    'refreshTokenSecret',
                    { expiresIn: '7d' } 
                );

                const accessToken = jwt.sign(
                    {
                        userId: user._id,
                        userEmail: user.email,
                        refreshToken: refreshToken,
                    },
                    'accessTokenSecret',
                    { expiresIn: '24h' }
                );
                console.log("login route: token ->",accessToken)
                console.log("Login route: refreshToken ->",refreshToken)
                
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

routes.get('/user/show/:id', authMiddleware, (req: Request, res: Response) => {
    const userId = req.params.id;
    console.log('GET SINGLE USER RECORD:', userId);

    Users.findOne({ _id: userId }).then((data) => res.json(data));
    });

routes.put('/user/update/:id', authMiddleware, (req: Request, res: Response) => {
    const userId = req.params.id;
    console.log('update user id route', userId);

    Users.updateOne(
    { _id: userId },
    {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId,
    }
    ).then((data) => res.json(data));
    });

// Game routes

routes.get('/start-the-game', authMiddleware, async (req: Request, res: Response) => {
    try {
        await gameLogic(req, res);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ error: errorMessage });
        console.log("this is the start-the-game error message")
    }
});

export default routes;
