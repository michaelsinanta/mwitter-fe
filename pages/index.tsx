import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { accessTokenState, userInformationState, updatingDataState, formDataState, sortState, tweetHomeListState, myTweetListState, myTweetSortState } from '@/components/storage/storage';
import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";
import axios from "axios";

import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import { Button } from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ListItemIcon from "@mui/material/ListItemIcon";
import Tweets from '@/components/commons/tweets';
import TweetModal from '@/components/modals/tweetModal';
import CommentModal from '@/components/modals/addComment';
import toast from "@/components/commons/toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Home() {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [updatingData, setUpdatingData] = useRecoilState(updatingDataState);
  const [formData, setFormData] = useRecoilState(formDataState);
  const [users, setUsers] = useState<any[]>([]);
  const [myTweets, setMyTweets] = useRecoilState(myTweetListState);
  const [tweets, setTweets] = useRecoilState(tweetHomeListState);
  const [sort, setSort] = useRecoilState(sortState);
  const [myTweetSort, setMyTweetSort] = useRecoilState(myTweetSortState);

  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const selectedNames = event.target.value as string[];
    setPersonName(selectedNames);

    const selectedKeys = selectedNames.map(name => {
      const user = users.find(u => u.username === name);
      return user ? user.id : 0; // or use some default value if user not found
    });
    setSelectedIds(selectedKeys);
  };

  const ax = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }
  });

  useEffect(() => {
    if (!formData.is_public) {
      ax.get("users/list")
        .then(res => {
          setUsers(res.data);
        })
    }
  }, [formData.is_public]);


  useEffect(() => {
    if (!accessToken) {
      window.location.replace("/login");
    }
  }, [accessToken]);

  const updateTweetsData = () => {
    ax.get("tweet/friends/")
      .then(res => {
        setTweets(res.data);
      })
  }

  const updateTweetsDataOldest = () => {
    ax.get("tweet/friends/oldest/")
      .then(res => {
        setTweets(res.data);
      })
  }

  const updateMyTweetsData = () => {
    ax.get("tweet/list/")
      .then(res => {
        setMyTweets(res.data);
      })
  }

  const updateMyTweetsDataOldest = () => {
    ax.get("tweet/list/oldest/")
      .then(res => {
        setMyTweets(res.data);
      })
  }

  useEffect(() => {
    if (!updatingData && accessToken) {
      if (sort == "latest" ) {
        updateTweetsData();
        updateMyTweetsData();
      } else if (sort == "oldest") {
        updateTweetsDataOldest();
        updateMyTweetsDataOldest();
      }
      setUpdatingData(true);
    }
  }, [updatingData])

  const handleSortChange = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
    setUpdatingData(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const payload = new FormData();
    setUpdatingData(true);
    payload.append("content", formData.content);
    payload.append("is_public", formData.is_public.toString());
    payload.append("close_friends", selectedIds.join(',').toString());
    ax.post('tweet/', payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    }).then(res => {
      setUpdatingData(false);
      setFormData({
        content: '',
        is_public: true,
        close_friends: []
      });
      toast.success("Successfully create tweet!");
    }).catch(err => {
      setUpdatingData(false);
      toast.error('Failed to create tweet!');
    })
  }

  const handleFormChange = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const handleCheckboxChange = (event) => {
    setFormData(prev => ({ ...prev, 'is_public': event.target.checked }));
  }

  return (
    <>
      <main className={styles.main}>
        {accessToken ?
          <div className='w-full lg:px-80 md:px-30 px-0'>
            <form
              id="login"
              onSubmit={event => handleFormSubmit(event)}
              className="flex flex-col w-full bg-gradient-to-r from-white to-blue-400 rounded-2xl px-12 py-5 mt-24 border border-1 border-blue-600"
            >
              <div className="w-full space-y-2">
                <label className="text-lg font-bold text-blue-900">Let us tweet ...</label>

                <textarea placeholder="What's happening?" value={formData.content} name="content" className="w-full p-2 bg-white bg-opacity-50 border-2 rounded-lg outline-none border-[#6E7198]" onChange={event => handleFormChange(event)} />
              </div>

              <div className="w-full mt-4 space-x-3 flex items-center">
                <input type="checkbox" name="is_public" checked={formData.is_public} onChange={handleCheckboxChange} className="w-4 h-4" />
                <label className="text-base">Public</label>
              </div>
              <div className='flex lg:flex-row md:flex-row flex-col justify-between items-center'>
                {!formData.is_public
                  ?
                  <>
                    <div>
                      <FormControl sx={{ m: 1, width: { xs: "260px", sm: "260px", md: "500px", lg: "500px" } }}>
                        <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
                          multiple
                          value={personName}
                          onChange={handleChange}
                          input={<OutlinedInput label="Name" />}
                          MenuProps={MenuProps}
                        >
                          {users.map((users) => (
                            <MenuItem
                              key={users.id}
                              value={users.username}
                              style={getStyles(users.username, personName, theme)}
                            >
                              <div className='flex'>
                                <div className="pr-3">
                                  <img className="lg:h-8 lg:w-8 md:h-8 md:w-8 h-6 w-6 rounded-full object-cover" src={users.photo_profile == null ? "/anonymous.jpeg" : users.photo_profile}/>
                                </div>
                                {users.username}
                              </div>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </>
                  :
                  <div></div>
                }

                <div className="flex justify-end">
                  <Button
                    variant="contained"
                    disabled={!formData.content}
                    type="submit"
                    className="bg-indigo-500 text-gray-100 w-24 h-10 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none"
                    sx={{ mt: 3, mb: 2 }}>
                    Upload
                  </Button>
                </div>
              </div>
            </form>

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
              <div className='grid grid-cols-1 gap-6 mt-5'>
                {(tweets.map(tweets => <Tweets key={tweets.id} tweets={tweets} />))}
              </div>
            }

          </div>
          :
          <div />
        }
        <TweetModal />
        <CommentModal />
        <ToastContainer />
      </main>
    </>
  )
}
