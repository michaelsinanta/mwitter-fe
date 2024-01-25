import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { isModalOpenState, editFormDataState, updatingDataState, accessTokenState, tweetUpdateIdState } from '../storage/storage';
import { useRecoilState } from 'recoil';
import { CloseIcon } from "@chakra-ui/icons";
import axios from 'axios';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from "react";
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

export default function TweetModal() {
    const [users, setUsers] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState);
    const [formData, setFormData] = useRecoilState(editFormDataState);
    const [updatingData, setUpdatingData] = useRecoilState(updatingDataState);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [tweetUpdateId, setTweetUpdateId] = useRecoilState(tweetUpdateIdState);

    const handleClose = () => {
        setIsModalOpen(false);
        setPersonName([]);
        setSelectedIds([]);
    };

    const { content, is_public, close_friends } = formData;

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
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
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

    const handleCheckboxChange = (event) => {
        setFormData(prev => ({ ...prev, 'is_public': event.target.checked }));
    }

    const submitData = () => {
        setUpdatingData(true);
        const payload = new FormData();
        payload.append("content", content);
        payload.append("is_public", is_public.toString());
        payload.append("close_friends", selectedIds.join(',').toString());
        ax.patch(`tweet/${tweetUpdateId}`, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
            setUpdatingData(false);
            handleClose();
            setFormData({
                content: '',
                is_public: true,
                close_friends: []
            });
            toast.success("Successfully update tweet!");
        }).catch(err => {
            setUpdatingData(false);
            toast.error('Failed to update tweet!');
        })
    }

    return (
        <div>
            <Modal
                open={isModalOpen}
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

                    <div className="w-full space-y-1">
                        <label className="text-sm font-medium md:text-base">Change it ...</label>
                        <input type="text" value={content} onChange={(e) => setFormData({ ...formData, "content": e.target.value })} className="w-full p-2 bg-inherit border-2 rounded-lg outline-none border-[#6E7198]" />
                    </div>
                    <div className="w-full mt-4 space-x-3 flex items-center">
                        <input type="checkbox" name="is_public" checked={is_public} onChange={handleCheckboxChange} className="w-4 h-4" />
                        <label className="text-base">Public</label>
                    </div>
                    <div className='flex lg:flex-row md:flex-row flex-col justify-between items-center'>
                        {!formData.is_public
                            ?
                            <>
                                <div>
                                    <FormControl sx={{ m: 1, width: { xs: "260px", sm: "260px" } }}>
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
                                                    {users.username}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </>
                            :
                            <div></div>
                        }
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