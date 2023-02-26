import { editUserDataState, imagePreviewState, isUserModalOpenState, userInformationState, userUpdateIdState, accessTokenState, changePasswordModalOpenState } from "@/components/storage/storage";
import { useRecoilState } from "recoil";
import { Button } from "@mui/material";
import UserModal from "@/components/modals/userModal";
import { useEffect, useState } from "react";
import ChangePassword from "@/components/modals/changePassword";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

export default function MyProfile() {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [userInformation, setUserInformation] = useRecoilState(userInformationState);
    const { id, email, username, bio, photo_profile, last_login } = userInformation;
    const [userUpdateId, setUserUpdateId] = useRecoilState(userUpdateIdState);
    const [formData, setFormData] = useRecoilState(editUserDataState);
    const [isUserModalOpen, setIsUserModalOpen] = useRecoilState(isUserModalOpenState);
    const [imagePreview, setImagePreview] = useRecoilState(imagePreviewState);
    const [changePasswordModal, setChangePasswordModal] = useRecoilState(changePasswordModalOpenState);

    useEffect(() => {
        if (!accessToken) {
            window.location.replace("/login");
        }
    }, [accessToken]);

    const updateData = () => {
        setUserUpdateId(id);
        setFormData({
            bio: bio,
            photo_profile: photo_profile,
        });
        setIsUserModalOpen(true);
        setImagePreview(photo_profile);
    }

    return (
        <div className="pt-24 lg:mx-80 md:mx-30 mx-4 bg-white h-screen">
            <div className="rounded-t-lg h-52 overflow-hidden">
                <img className="object-cover object-top w-full" src='https://images.unsplash.com/photo-1636728682521-5bf9a2c4f533?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1856&q=80' alt='Mountain' />
            </div>
            <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                <img className="object-cover object-center h-32" src={photo_profile == null ? "/anonymous.jpeg" : photo_profile} />
            </div>
            <div className="text-center mt-2 space-y-2">
                <h2 className="font-semibold text-lg text-blue-900 hover:text-blue-800">{username}</h2>
                <h2 className="font-base text-md text-blue-900 hover:text-blue-800">{email}</h2>
                <p className="text-gray-500">Last Login:&nbsp;
                    {new Date(last_login).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })},{new Date(last_login).toLocaleTimeString("en-US", {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
            </div>
            <div className="mt-6 mx-4">
                <label className="text-lg font-bold text-blue-900">Bio</label>
                <textarea readOnly placeholder="Fill your bio!" defaultValue={bio} name="content" className="w-full p-2 bg-white bg-opacity-50 border-2 rounded-lg outline-none border-[#6E7198]" />
            </div>
            <div className=" flex items-center justify-center w-full px-4 space-x-8">
                <Button
                    fullWidth
                    variant="contained"
                    onClick={updateData}
                    sx={{ mt: 3, mb: 2 }}>
                    Edit Profile
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => { setChangePasswordModal(true) }}
                    sx={{ mt: 3, mb: 2 }}>
                    Change Password
                </Button>
            </div>
            <UserModal />
            <ChangePassword />
            <ToastContainer />
        </div>
    );
}