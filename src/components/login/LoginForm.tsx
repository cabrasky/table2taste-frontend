import React, { useEffect, useState } from 'react';
import {userService} from '../../services/UserService';
import {  useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { showErrorPopup } from '../../utils/popupUtils';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const {setToken} = useAuth();

    useEffect(() => {
        const tableId = searchParams.get("tableId");
        if(tableId){
            login(tableId);
        }
    }, [searchParams])

    const handleSubmit = (e?: React.FormEvent) => {
        if(e){
            e.preventDefault();
        }
        login(username, password);
    }

    const login = async (username: string, password: string = "") => {
        userService.login(username, password).then(data => {
            setToken(data.accessToken);
            
            navigate("/");
        }).catch(reason => {            
            showErrorPopup(reason)
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
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
