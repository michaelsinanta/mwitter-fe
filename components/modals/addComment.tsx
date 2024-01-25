import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { updatingDataState, accessTokenState, tweetUpdateIdState, commentModalOpenState, commentTweetListState } from '../storage/storage';
import { useRecoilState } from 'recoil';
import { ChatIcon, CloseIcon } from "@chakra-ui/icons";
import axios from 'axios';
import { useEffect, useState, useRef } from "react";
import toast from "@/components/commons/toast";
import { useTheme } from '@mui/material/styles';

export default function CommentModal() {
    const [isCommentModalOpen, setIsCommentModalOpen] = useRecoilState(commentModalOpenState);
    const [updatingData, setUpdatingData] = useRecoilState(updatingDataState);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [tweetUpdateId, setTweetUpdateId] = useRecoilState(tweetUpdateIdState);
    const [commentTweetList, setCommentTweetList] = useRecoilState(commentTweetListState);
    const [comment, setComment] = useState("");

    const theme = useTheme();

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        bgcolor: 'background.paper',
        border: '2px solid blue',
        boxShadow: 20,
        marginBottom: 10,
        p: 4,
        overflow: 'scroll',
        height: '60%',
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
        [theme.breakpoints.up('md')]: {
            width: '50%',
        },
        [theme.breakpoints.up('lg')]: {
            width: '70%',
        },
    };

    const handleClose = () => {
        setIsCommentModalOpen(false);
        setCommentTweetList([]);
    };

    const ax = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        }
    });

    const submitData = () => {
        setUpdatingData(true);
        const payload = new FormData();
        payload.append("comment_content", comment);
        ax.post(`tweet/comment/${tweetUpdateId}`, payload, {
        }).then(res => {
            setUpdatingData(false);
            updateCommentsData();
            toast.success("Successfully add comment!");
        }).catch(err => {
            setUpdatingData(false);
            toast.error('Failed to add comment!');
        })
    }

    const updateCommentsData = () => {
        ax.get(`tweet/comment/${tweetUpdateId}`)
            .then(res => {
                setCommentTweetList(res.data)
            }).catch(err => {
                setCommentTweetList([]);
            })
    }

    return (
        <div>
            <Modal
                open={isCommentModalOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='flex items-center pb-3'>
                        <div className='flex items-center space-x-2'>
                            <ChatIcon />
                            <label className="text-xl font-bold text-blue-900 whitespace-nowrap">Comment</label>
                        </div>
                        <div className='justify-end w-full flex' onClick={handleClose}>
                            <CloseIcon />
                        </div>
                    </div>

                    <div className="w-full space-y-1">
                        <label className="text-sm font-medium md:text-base">Comment</label>
                        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-2 bg-inherit border-2 rounded-lg outline-none border-[#6E7198]" placeholder='Add comment' />
                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={submitData}
                        sx={{ mt: 3 }}>
                        Add Comment
                    </Button>
                    {commentTweetList.length === 0
                        ? <div className="text-xl font-bold text-center flex w-full justify-center mt-5">There are no comments yet! 🥺</div>
                        :
                        <div className='grid grid-cols-1 gap-3 mt-5'>
                            <label className="text-lg font-bold text-blue-900 whitespace-nowrap">List of Comment</label>
                            {(commentTweetList.map(comments =>
                                <div className='border-1 border-black p-2 shadow'>
                                    <div className='flex'>
                                        <div className="pr-2">
                                            <img className="lg:h-8 lg:w-8 md:h-8 md:w-8 h-6 w-6 rounded-full object-cover" src={comments['comment_picture'] == null ? "/anonymous.jpeg" : comments['comment_picture']} />
                                        </div>
                                        <div className="text-md font-bold text-blue-900">{comments['comment_author']}</div>
                                        <div>: {comments['comment_content']}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </Box>
            </Modal>
        </div>
    );
}