import { CalendarIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { useRecoilState } from "recoil";
import { userInformationState, updatingDataState, accessTokenState, tweetUpdateIdState, editFormDataState, isModalOpenState} from "../storage/storage";
import axios from "axios";
import toast from "@/components/commons/toast";

export default function Tweets({ tweets }) {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [userInformation, setUserInformation] = useRecoilState(userInformationState);
    const [updatingData, setUpdatingData] = useRecoilState(updatingDataState);
    const [tweetUpdateId, setTweetUpdateId] = useRecoilState(tweetUpdateIdState);
    const [formData, setFormData] = useRecoilState(editFormDataState);
    const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState);

    const deleteData = (event) => {
        event.preventDefault();
        setUpdatingData(true)
        axios.delete(`http://localhost:8000/tweet/${tweets.id}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(res => {
            setUpdatingData(false);
            toast.success("Successfully delete tweet!");
        }).catch(err => {
            setUpdatingData(false)
            toast.error('Failed to delete tweet!');
        })
    }

    const updateData = (event) => {
        event.preventDefault();
        setTweetUpdateId(tweets.id);
        setFormData({
            content : tweets.content,
            is_public : tweets.is_public,
            close_friends : tweets.close_friends,
        });
        setIsModalOpen(true);
    }

    return (
        <div className="shadow-md bg-indigo-50 hover:shadow-indigo-700 hover:shadow-md transition-all duration-300 ease-in-out rounded-md flex flex-col p-4 w-full">
            <div className="flex justify-between space-x-3">
                <div className="flex items-center space-x-3">
                <img className="h-10 w-10 rounded-full object-cover" src={tweets.profile_picture == null ? "/anonymous.jpeg" : tweets.profile_picture} alt="" />
                <h2 className="text-md font-bold text-blue-900">
                    {tweets.author}
                </h2>
                </div>
                
                {tweets.user == userInformation.id ?
                <div className="flex justify-center space-x-2">
                    <button className="h-10 w-10 flex items-center shadow-md space-x-2 bg-indigo-500 text-gray-100 p-2 rounded-3xl hover:bg-indigo-700 transition-all duration-300 ease-in-out justify-center focus:shadow-outline focus:outline-none" onClick={updateData}><EditIcon /></button>
                    <button className="h-10 w-10 flex items-center shadow-md space-x-2 bg-indigo-500 text-gray-100 p-2 rounded-3xl hover:bg-indigo-700 transition-all duration-300 ease-in-out justify-center focus:shadow-outline focus:outline-none" onClick={deleteData} ><DeleteIcon /></button>
                </div>
                : <div></div>}
            </div>
            <p className="text-gray-600 text-sm flex items-center mt-1">
                <CalendarIcon marginRight={8} />
                {new Date(tweets.publish_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })} {new Date(tweets.publish_date).toLocaleTimeString("en-US", {
                    hour: '2-digit',
                    minute:'2-digit'
                })}
            </p>
            <div className="flex w-full border-1 border border-violet-300 my-3"></div>
            <p className="flex w-full text-gray-800 break-all ">
                {tweets.content}
            </p>
        </div>
    );
}
