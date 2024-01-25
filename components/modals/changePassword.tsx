import { accessTokenState, changePasswordModalOpenState } from "@/components/storage/storage";
import { useRecoilState } from "recoil";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";
import toast from "@/components/commons/toast";

export default function ChangePassword() {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [changePasswordModal, setChangePasswordModal] = useRecoilState(changePasswordModalOpenState);

    const handleClose = () => {
        setChangePasswordModal(false);
    };

    const initialState = {
        'current_password': '', 'new_password': ''
    }

    const [form, setForm] = useState(initialState);

    const handleFormChange = (event) => {
        setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        var formdata = new FormData();
        formdata.append("current_password", form.current_password);
        formdata.append("new_password", form.new_password);
        // submit credentials
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}users/change-password`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            body: formdata,
        })
            .then(response => response.json())
            .then(data => {
                setChangePasswordModal(false);
                toast.success("Successfully change password!");
            }).catch(err => {
                toast.error(`Something went wrong! Check your current or new password!`)
            });
    }

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

    return (
        <Modal
            open={changePasswordModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className='flex items-center pb-3'>
                    <label className="text-xl font-bold text-blue-900 whitespace-nowrap">Change Password</label>
                    <div className='justify-end w-full flex' onClick={handleClose}>
                        <CloseIcon />
                    </div>
                </div>
                <Box component="form" noValidate onSubmit={handleSubmit} onChange={event => handleFormChange(event)} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="current_password"
                                label="Current Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="new_password"
                                label="New Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={!form.current_password || !form.new_password}>
                        Change Password
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}