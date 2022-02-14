import React, {useEffect, useState} from 'react';
import axios from "axios";

export const EventSourcing = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        subscribe()
    }, [])

    const subscribe = async () => {
        const eventSource = new EventSource('http://localhost:5000/connect')
        eventSource.onmessage = function (event) {
            console.log(event.data)
        }
    }

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: Date.now()
        })
    }

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
                        <div className="message" key={mess.id}>
                            {mess.message}
                        </div>
                      ) : <p>Messages not found...</p>
                  }
              </div>
          </div>
      </div>
    );
};