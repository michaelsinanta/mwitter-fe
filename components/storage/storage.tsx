import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()

export const accessTokenState = atom({
    key: 'accessTokenState',
    default: null,
    effects_UNSTABLE: [persistAtom],
})

export const userInformationState = atom({
    key: 'userInformationState',
    default: {
        id : '',
        email : '',
        username: '',
        bio : '',
        photo_profile : '',
        last_login : '',
    },
    effects_UNSTABLE: [persistAtom],
})

export const searchUserInformationState = atom({
    key: 'searchUserInformationState',
    default: {
        id : '',
        email : '',
        username: '',
        bio : '',
        photo_profile : '',
        last_login : '',
    },
})

export const updatingDataState = atom({
    key: 'updatingDataState',
    default: false,
    effects_UNSTABLE: [persistAtom],
})

export const formDataState = atom({
    key: 'formDataState',
    default: {
        content : '',
        is_public : true,
        close_friends : []
    },
    effects_UNSTABLE: [persistAtom],
})

export const editFormDataState = atom({
    key: 'editFormDataState',
    default: {
        content : '',
        is_public : true,
        close_friends : []
    },
})

export const isModalOpenState = atom({
    key: 'isModalOpenState',
    default: false,
})

export const commentModalOpenState = atom({
    key: 'commentModalOpenState',
    default: false,
})

export const changePasswordModalOpenState = atom({
    key: 'changePasswordModalOpenState',
    default: false,
})

export const isUserModalOpenState = atom({
    key: 'isUserModalOpenState',
    default: false,
})

export const sortState = atom({
    key: 'sortState',
    default: 'latest',
    effects_UNSTABLE: [persistAtom],
})

export const myTweetSortState = atom({
    key: 'myTweetSortState',
    default: 'latest',
    effects_UNSTABLE: [persistAtom],
})

export const todosUpdateIdState = atom({
    key: 'todosUpdateIdState',
    default: null
})

export const registerDataState = atom({
    key: 'registerDataState',
    default: {
        username: '',
        email: '',
        password: '',
        password2: '',
    },
})

export const editUserDataState = atom({
    key: 'editUserDataState',
    default: {
        bio: '',
        photo_profile: '/anonymous.jpeg',
    },
})

export const imagePreviewState = atom({
    key: 'imagePreviewState',
    default: "/anonymous.jpeg",
})

export const userUpdateIdState = atom({
    key: 'userUpdateIdState',
    default: null
})

export const tweetUpdateIdState = atom({
    key: 'tweetUpdateIdState',
    default: null
})

export const tweetHomeListState = atom({
    key: 'tweetHomeListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
})

export const myTweetListState = atom({
    key: 'myTweetListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
})

export const searchUserTweetListState = atom({
    key: 'searchUserTweetListState',
    default: [],
})

export const commentTweetListState = atom({
    key: 'commentTweetListState',
    default: [],
})