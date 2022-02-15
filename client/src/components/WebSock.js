import React, {useState, useRef} from 'react';

export const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')
    const socket = useRef()

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000')
        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            alert('Socket закрыт.')
        }
        socket.current.onerror = () => {
            alert('Ошибка в Socket!')
        }
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if (!connected)
        return (
          <div className="center">
              <div className="form">
                  <input
                    type="text"
                    placeholder="Введите ваш никнейм..."
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                  />
                  <button onClick={connect}>Войти</button>
              </div>
          </div>
        )

    return (
      <div className="center">
          <div>
              <div className="form">
                  <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                  <button onClick={sendMessage}>Отправить</button>
              </div>
              <div className="messages">
                  {
                      messages.length ? messages.map(mess =>
                        <div key={mess.id}>
                            {
                                mess.event === 'connection'
                                ? <div className="connection_message">
                                      Пользователь {mess.username} подключился!
                                </div>

                                : <div className="message">
                                      {mess.username} - {mess.message}
                                </div>
                            }
                        </div>
                      ) : <p>Messages not found...</p>
                  }
              </div>
          </div>
      </div>
    );
};