import { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            const newSocket = io('/', { // Proxy handles connection to :5000
                transports: ['websocket'],
            });

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket Connected');
                newSocket.emit('join', user._id || user.id);
            });

            newSocket.on('new_notification', (data) => {
                toast.info(data.message);
            });

            return () => newSocket.close();
        } else {
            if (socket) socket.close();
            setSocket(null);
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
