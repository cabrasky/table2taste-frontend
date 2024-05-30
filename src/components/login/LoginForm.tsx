import React, { useState } from 'react';
import {userService} from '../../services/UserService';
import {  useAuth } from '../../contexts/AuthContext';
import { usePopup } from '../../contexts/PopupContext';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const { createPopup } = usePopup();
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const {setToken} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        userService.login(username, password).then(data => {
            setToken(data.accessToken);
            
            navigate("/");
        }).catch(reason => {            
            createPopup("error", reason)
        })
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
