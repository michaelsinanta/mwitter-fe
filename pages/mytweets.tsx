import Tweets from "../components/commons/tweets"
import { useState, useEffect } from "react";
import axios from "axios";
import styles from '@/styles/Home.module.css'
import { useRecoilState } from "recoil";
import { accessTokenState, myTweetListState, updatingDataState, myTweetSortState } from "@/components/storage/storage";
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TweetModal from "@/components/modals/tweetModal";
import CommentModal from "@/components/modals/addComment";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

export default function MyTweets() {
  const [sort, setSort] = useRecoilState(myTweetSortState);
  const [tweets, setTweets] = useRecoilState(myTweetListState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [updatingData, setUpdatingData] = useRecoilState(updatingDataState);

  useEffect(() => {
    if (!accessToken) {
      window.location.replace("/login");
    }
  }, [accessToken]);

  useEffect(() => {
    if (!updatingData && accessToken) {
      if (sort == "latest") {
        updateMyTweetsData();
      } else if (sort == "oldest") {
        updateMyTweetsDataOldest();
      }
      setUpdatingData(true);
    }
  }, [updatingData])

  const ax = axios.create({
    baseURL: 'https://mwitter.up.railway.app/',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }
  });

  const updateMyTweetsData = () => {
    ax.get("tweet/list/")
      .then(res => {
        setTweets(res.data);
      })
  }

  const updateMyTweetsDataOldest = () => {
    ax.get("tweet/list/oldest/")
      .then(res => {
        setTweets(res.data);
      })
  }

  const handleSortChange = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
    setUpdatingData(false);
  };

  return (
    <div className="mt-24 lg:px-80 md:px-30 px-4">
      <div className="flex w-full justify-end mt-5">
        <FormControl sx={{ m: 1, width: 200 }}>
          <InputLabel id="demo-simple-select-label">Sort</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sort}
            label="Sort"
            onChange={handleSortChange}
          >
            <MenuItem value={"oldest"}>Oldest</MenuItem>
            <MenuItem value={"latest"}>Latest</MenuItem>
          </Select>
        </FormControl>
      </div>
      {tweets.length === 0
        ? <div className="text-xl font-bold text-center flex w-full justify-center mt-5">There are no tweets yet! 🥺</div>
        :
        <div className='grid grid-cols-1 gap-8 mt-5'>
          {(tweets.map(tweets => <Tweets key={tweets.id} tweets={tweets} />))}
        </div>
      }
      <TweetModal />
      <CommentModal/>
      <ToastContainer />
    </div>
  )
}