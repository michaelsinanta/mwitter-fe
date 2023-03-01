import styles from '@/styles/Home.module.css'
import { useEffect, useState } from "react";
import { accessTokenState, userInformationState, updatingDataState, formDataState, sortState, tweetHomeListState, myTweetListState, myTweetSortState } from '@/components/storage/storage';
import { useRecoilState, useSetRecoilState } from "recoil";
import * as React from 'react';
import axios from 'axios';
import Users from '@/components/commons/users';
import SearchModal from '@/components/modals/searchModal';

export default function SearchUser() {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (!accessToken) {
            window.location.replace("/login");
        }
    }, [accessToken]);


    const handleFormChange = (event) => {
        setSearch(event.target.value);
        updateUsersData();
        updateUsersData();
    }

    const ax = axios.create({
        baseURL: 'https://mwitter.up.railway.app/',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        }
    });

    const updateUsersData = () => {
        ax.get(`users/search/?search=${search}`)
            .then(res => {
                setUsers(res.data);
            })
    }

    return (
        <main className={styles.main}>
            {accessToken ?
                <div className='w-full lg:px-80 md:px-30 px-0'>
                    <div className="flex flex-col w-full bg-gradient-to-r from-white to-blue-400 rounded-2xl px-12 py-5 mt-24 border border-1 border-blue-600">
                        <div className="w-full space-y-2">
                            <label className="text-lg font-bold text-blue-900">Search Users</label>
                            <input placeholder="Find your friends" name="content" value={search} className="w-full p-2 bg-white bg-opacity-50 border-2 rounded-lg outline-none border-[#6E7198]" onChange={event => handleFormChange(event)} />
                        </div>

                    </div>

                    {users.length === 0
                        ? <div className="text-xl font-bold text-center flex w-full justify-center mt-5">Input the username!</div>
                        :
                        <div className='grid grid-cols-1 gap-3 mt-5 cursor-pointer'>
                            {(users.map(users => <Users key={users.id} users={users} />))}
                        </div>
                    }

                </div>
                :
                <div />
            }
            <SearchModal />
        </main>
    );
}