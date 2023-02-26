import { toast } from 'react-toastify';

const config = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
}

const error = (message) => {
    toast.error(message, config);
}

const success = (message) => {
    toast.success(message, config);
}

const Toast = { success, error }
export default Toast