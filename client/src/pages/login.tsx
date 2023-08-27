import { useContext, useState, FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
// import Cookies from "universal-cookie";
import { UserContext } from '../UserContext';
import { config } from '../config/config';

// const cookies = new Cookies();

const URL = config.url;

const LoginUser: React.FC = () => {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    // const [login, setLogin] = useState(false);
    const [token, setToken] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    function isError(err: any): err is Error {
        return err instanceof Error;
        }
    
    const loginUser = async () => {
        try {
            const response = await fetch(`${URL}/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`,
            },
            });
        
            if (response.ok) {
            const result = await response.json();
            const userEmail = result.email;
            const userId = result.userId;
            const passwordCheck = result.passwordCheck
        
            if (userId !== undefined && userEmail !== undefined && passwordCheck !== false) {

                 // Set HttpOnly cookies
                document.cookie = `accessToken=${result.token}; Secure; HttpOnly; SameSite=Strict`;
                document.cookie = `refreshToken=${result.refreshToken}; Secure; HttpOnly; SameSite=Strict`;

                console.log("logn.tsx token",result.token)
                console.log("logn.tsx refresh token",result.refreshToken)
                
                localStorage.setItem('email', userEmail);
                localStorage.setItem('id', userId);
                setEmail('');
                setPassword('');
                // setLogin(true);
                setToken(result.token);
                setUser(result); 
            } else {
            console.log("Login failed, password or email incorrect");
            alert("Login failed, password or email incorrect");
            }
        }
        } catch (err) {
            if (isError(err)) {
                console.log("password incorrect or missing:",err.message);
            } else {
                console.log("An unknown error occurred:", err);
            }
            }
        };

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginUser();
    navigate('/game');
};

    return (
        <div className="background">   
            <div className="form-container-login">
                <form method="post" onSubmit={handleSubmit} encType="multipart/form-data" className="login-form">
                    <label className="labels">
                        Email
                        <input 
                            type="text" 
                            name="email" 
                            placeholder="email"
                            onChange={e => setEmail(e.target.value)} />
                    </label>
                    <label className="labels">
                        Password
                        <input 
                            type="text" 
                            name="password" 
                            placeholder="password"
                            onChange={e => setPassword(e.target.value)} />
                    </label>
                    <input type="submit" value="Submit" className="primary-submit-button" />
                </form>
            </div>
    </div>
    )
};

export default LoginUser;
