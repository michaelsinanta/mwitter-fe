import { useRecoilState } from "recoil";
import { isModalOpenState, searchUserInformationState, searchUserTweetListState, accessTokenState } from "../storage/storage";
import axios from "axios";

export default function Users({ users }) {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [searchUser, setSearchUser] = useRecoilState(searchUserInformationState);
    const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState);
    const [searchUserList, setSearchUserList] = useRecoilState(searchUserTweetListState);

    const handleUser = (event) => {
        event.preventDefault();
        setSearchUser({
            id: users.id,
            email: users.email,
            username: users.username,
            bio: users.bio,
            photo_profile: users.photo_profile,
            last_login: users.last_login,
        })
        updateSearchUserList();
        setIsModalOpen(true);
    }

    const ax = axios.create({
        baseURL: process.env.BASE_URL,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        }
    });

    const updateSearchUserList = () => {
        ax.get(`tweet/search/${users.id}`)
            .then(res => {
                setSearchUserList(res.data);
            })
    }

    return (
        <div className="shadow-sm bg-indigo-50 hover:shadow-indigo-700 hover:shadow-md transition-all duration-300 ease-in-out rounded-md flex flex-col p-4 w-full" onClick={handleUser}>
            <div className="flex justify-between space-x-3">
                <div className="flex items-center space-x-3">
                    <img className="h-10 w-10 rounded-full object-cover" src={users.photo_profile == null ? "/anonymous.jpeg" : users.photo_profile} alt="" />
                    <div>
                        <h1 className="text-md font-bold text-blue-900">
                            {users.username}
                        </h1>
                        <h2 className="text-sm text-blue-600">
                            {users.bio}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}