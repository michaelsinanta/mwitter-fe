import { useRecoilState } from "recoil";
import { isModalOpenState, searchUserInformationState, searchUserTweetListState, accessTokenState } from "../storage/storage";
import axios from "axios";
import Tweets from "../commons/tweets";
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { CloseIcon } from "@chakra-ui/icons";
import { useTheme } from '@mui/material/styles';

export default function SearchModal() {
    const [searchUser, setSearchUser] = useRecoilState(searchUserInformationState);
    const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState);
    const [searchUserList, setSearchUserList] = useRecoilState(searchUserTweetListState);

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
        height: '90%',
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
        setIsModalOpen(false);
        setSearchUser({
            id: '',
            email: '',
            username: '',
            bio: '',
            photo_profile: '',
            last_login: '',
        });
        setSearchUserList([]);
    };
    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className='flex items-center pb-3'>
                    <label className="text-xl font-bold text-blue-900 whitespace-nowrap">{searchUser.username}'s Tweet</label>
                    <div className='justify-end w-full flex' onClick={handleClose}>
                        <CloseIcon />
                    </div>
                </div>
                <div className="items-center bg-white h-screen">
                    <div className="rounded-t-lg h-52 overflow-hidden">
                        <img className="object-cover object-top w-full" src='https://images.unsplash.com/photo-1636728682521-5bf9a2c4f533?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1856&q=80' alt='Mountain' />
                    </div>
                    <div className="object-cover flex justify-center items-center mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                        <img className="object-cover object-center h-32 w-full" src={searchUser.photo_profile == null ? "/anonymous.jpeg" : searchUser.photo_profile} />
                    </div>
                    <div className="text-center mt-2 space-y-2">
                        <h2 className="font-semibold text-lg text-blue-900 hover:text-blue-800">{searchUser.username}</h2>
                        <p className="text-gray-500">Last Login:&nbsp;
                            {new Date(searchUser.last_login).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })},{new Date(searchUser.last_login).toLocaleTimeString("en-US", {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                    </div>
                    <div className="mt-6 mx-4 space-y-4">
                        <label className="text-lg font-bold text-blue-900">Bio</label>
                        <textarea readOnly placeholder="Fill your bio!" defaultValue={searchUser.bio} name="content" className="w-full p-2 bg-white bg-opacity-50 border-2 rounded-lg outline-none border-[#6E7198]" />
                        <h1 className="text-lg font-bold text-blue-900">Tweets</h1>
                        {searchUserList.length === 0
                            ? <div className="text-xl font-bold text-center flex w-full justify-center mt-5">There are no tweets yet! 🥺</div>
                            :
                            <div className='grid grid-cols-1 gap-6 mt-5 pb-5'>
                                {(searchUserList.map(tweets => <Tweets key={tweets['id']} tweets={tweets} />))}
                            </div>
                        }
                    </div>
                </div>
            </Box>
        </Modal>
    );
}