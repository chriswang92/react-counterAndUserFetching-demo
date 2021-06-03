import React from 'react';
import axios from 'axios';
import './App.css';

const { useState, useEffect, useRef } = React;
const API_URL = 'https://randomuser.me/api/';
const DEFAULT_JSON = 'NO DATA';

interface User {
    name: { first: string; last: string };
    picture: { thumbnail: string };
}

interface UserInfo {
    name: string;
    picture: string;
}

function App() {
    const [counter, setCounter] = useState(0);
    const [userInfoJSON, setUserInfoJSON] = useState(DEFAULT_JSON);
    const [usersInfo, setUserInfo] = useState<UserInfo[]>([]);
    const [pageNumber, setPageNumber] = useState(1);

    const fetchUserInfo = () => {
        // way 1: use Promise
        axios
            .get(API_URL + `?page=${pageNumber}`)
            .then(response => {
                // handling response in promise handle blocks
                if (!response) {
                    return;
                }
                console.log(response);
                const { data } = response;
                const { results } = data;
                setUserInfoJSON(JSON.stringify(data, null, 2) || DEFAULT_JSON);
                const newUsers = results.map((user: User) => {
                    console.log(user);
                    const {
                        name: { first, last },
                        picture: { thumbnail },
                    } = user;
                    return {
                        name: first + last,
                        picture: thumbnail,
                    };
                });
                setUserInfo([...usersInfo, ...newUsers]);
            })
            .catch(err => {
                console.error(err);
            });
    };

    // way 2: use async/await
    const fetchUserInfo2 = async () => {
        const response = await axios.get(API_URL + `?page=${pageNumber}`);
        // handling the reponse like it's result from a syncronized call
        if (!response) {
            return;
        }
        console.log(response);
        const { data } = response;
        const { results } = data;
        setUserInfoJSON(JSON.stringify(data, null, 2) || DEFAULT_JSON);
        const newUsers = results.map((user: User) => {
            console.log(user);
            const {
                name: { first, last },
                picture: { thumbnail },
            } = user;
            return {
                name: first + last,
                picture: thumbnail,
            };
        });
        setUserInfo([...usersInfo, ...newUsers]);
    };

    const fetchRef = useRef(() => {});
    fetchRef.current = fetchUserInfo; //fetchUserInfo2;

    useEffect(() => {
        fetchRef.current();
    }, [pageNumber]);

    console.log(usersInfo);

    return (
        <div className='App'>
            <div>
                <p>{counter}</p>
                <button onClick={() => setCounter(counter + 1)}>
                    Click to count
                </button>
                <button onClick={() => setPageNumber(pageNumber + 1)}>
                    add more user
                </button>
                <p>{userInfoJSON}</p>
                {usersInfo.map((user, index) => (
                    <div key={index}>
                        <p>{user.name}</p>
                        <img
                            src={user.picture}
                            alt={`${user.name}'s picture`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
