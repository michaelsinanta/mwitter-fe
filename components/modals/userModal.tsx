import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { isUserModalOpenState, editFormDataState, updatingDataState, accessTokenState, tweetUpdateIdState, editUserDataState, imagePreviewState, userInformationState } from '../storage/storage';
import { useRecoilState } from 'recoil';
import { CloseIcon } from "@chakra-ui/icons";
import axios from 'axios';
import { useEffect, useState, useRef } from "react";
import toast from "@/components/commons/toast";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    border: '2px solid blue',
    boxShadow: 20,
    p: 4,
};

export default function UserModal() {
    const [isUserModalOpen, setIsUserModalOpen] = useRecoilState(isUserModalOpenState);
    const [formData, setFormData] = useRecoilState(editUserDataState);
    const [updatingData, setUpdatingData] = useRecoilState(updatingDataState);
    const [imagePreview, setImagePreview] = useRecoilState(imagePreviewState);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [tweetUpdateId, setTweetUpdateId] = useRecoilState(tweetUpdateIdState);
    const [userInformation, setUserInformation] = useRecoilState(userInformationState);
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const { id, email, username, last_login } = userInformation;
    const { bio, photo_profile } = formData;

    const handleClose = () => {
        setIsUserModalOpen(false);
    };


    const addImageToForm = (e) => {
        setFormData({ ...formData, photo_profile: e.target.files[0] })
        const reader = new FileReader();

        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            // @ts-ignore: Object is possibly 'null'.
            setImagePreview(readerEvent.target.result);
        }
        setIsEditing(true);
    }

    const ax = axios.create({
        baseURL: 'https://mwitter.up.railway.app/',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        }
    });


    const submitData = () => {
        setUpdatingData(true);
        const payload = new FormData();
        if (isEditing) {
            payload.append("photo_profile", photo_profile);
        }
        payload.append("bio", bio);
        axios.patch(`https://mwitter.up.railway.app/users/detail`, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
            setUpdatingData(false);
            handleClose();
            setUserInformation({
                id: id,
                email: email,
                username: username,
                bio: res.data.data["bio"],
                photo_profile: res.data.data["photo_profile"],
                last_login: last_login,
            })
            setFormData({
                bio: '',
                photo_profile: ''
            })
            toast.success("Successfully update profile!");
        }).catch(err => {
            setUpdatingData(false);
            toast.error('Failed to update profile!');
        })
    }

    return (
        <div>
            <Modal
                open={isUserModalOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='flex items-center pb-3'>
                        <label className="text-xl font-bold text-blue-900 whitespace-nowrap">Edit Tweet</label>
                        <div className='justify-end w-full flex' onClick={handleClose}>
                            <CloseIcon />
                        </div>
                    </div>
                    <div className="w-full px-8 space-y-2 pb-5">
                        <label className="text-sm font-medium md:text-base flex justify-center items-center">Photo Profile</label>
                        <div className="relative flex justify-center items-center">
                            <div className="absolute flex items-center justify-center pr-48 top-1 hover-animation w-9 h-9"
                                onClick={() => {
                                    setFormData({ ...formData, 'photo_profile': '' })
                                    setImagePreview("/anonymous.jpeg");
                                    // @ts-ignore: Object is possibly 'null'.
                                    fileInputRef.current.value = '';
                                }}
                            >
                                <CloseIcon />
                            </div>
                            <img src={imagePreview} className="object-contain rounded-full lg:w-48 lg:h-48 md:w-48 md:h-48 w-32 h-32 border border-1 border-blue-300" />
                        </div>

                        <input type="file" ref={fileInputRef} onChange={addImageToForm} className="w-full p-2 bg-inherit border border-1 rounded-lg outline-none border-blue-300" />
                    </div>
                    <div className="w-full space-y-1">
                        <label className="text-sm font-medium md:text-base">Bio</label>
                        <input type="text" value={bio} onChange={(e) => setFormData({ ...formData, "bio": e.target.value })} className="w-full p-2 bg-inherit border-2 rounded-lg outline-none border-[#6E7198]" />
                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={submitData}
                        sx={{ mt: 3 }}>
                        Edit
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}