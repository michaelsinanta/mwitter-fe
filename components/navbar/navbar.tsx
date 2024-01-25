import Link from "next/link";
import { accessTokenState, userInformationState, updatingDataState, formDataState, sortState, myTweetSortState, tweetHomeListState, myTweetListState } from "../storage/storage";
import { useRecoilState } from "recoil";
import { BsFillChatLeftQuoteFill } from 'react-icons/bs';
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

const Navbar = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [userInformation, setUserInformation] = useRecoilState(userInformationState);
    const { username, bio, photo_profile } = userInformation;
    const [updatingData, setUpdatingData] = useRecoilState(updatingDataState);
    const [formData, setFormData] = useRecoilState(formDataState);
    const [sort, setSort] = useRecoilState(sortState);
    const [mySort, setMySort] = useRecoilState(myTweetSortState);
    const [tweetHomeList, setTweetHomeList] = useRecoilState(tweetHomeListState);
    const [myTweetList, setMyTweetList] = useRecoilState(myTweetListState);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setUpdatingData(false);
    };

    const logOut = async () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}users/logout`, {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                setAccessToken(null);
                setUpdatingData(false);
                setUserInformation({
                    content: '',
                    is_public: true,
                    close_friends: []
                });
                setFormData({
                    content: '',
                    is_public: true,
                    close_friends: []
                });
                setSort('latest');
                setMySort('latest');
                setTweetHomeList([]);
                setMyTweetList([]);
                window.location.replace('/login');
            })
    };

    const StyledMenu = styled((props: MenuProps) => (
        <Menu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            {...props}
        />
    ))(({ theme }) => ({
        '& .MuiPaper-root': {
            borderRadius: 6,
            marginTop: theme.spacing(1),
            minWidth: 180,
            color:
                theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
            boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
                padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
                '& .MuiSvgIcon-root': {
                    fontSize: 18,
                    color: theme.palette.text.secondary,
                    marginRight: theme.spacing(1.5),
                },
                '&:active': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    }));


    return (
        <>
            <header className="fixed flex flex-wrap container mx-auto max-w-full items-center py-4 px-5 justify-between bg-white shadow-md top-0 z-50">
                <div className="flex items-center text-blue-900 hover:text-blue-800 cursor-pointer transition duration-150 ">
                    <Link href="/">
                        <div className="flex items-center space-x-2">
                            <BsFillChatLeftQuoteFill size={25} />
                            <span className="font-semibold lg:text-2xl md:text-2xl text-lg text-blue-900 hover:text-blue-800">
                                Mweet
                            </span>
                        </div>
                    </Link>
                </div>

                <ul className="text-lg inline-block">
                    <>
                        {!accessToken ? (
                            <div>
                                <Button
                                    id="demo-customized-button"
                                    aria-controls={open ? 'demo-customized-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    disableElevation
                                    onClick={handleClick}
                                >
                                    <div className="bg-blue-900 px-2 rounded-lg">
                                        <HamburgerIcon color="white" w={20} h={30} />
                                    </div>
                                </Button>
                                <StyledMenu
                                    id="demo-customized-menu"
                                    MenuListProps={{
                                        'aria-labelledby': 'demo-customized-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <Link href={"/login"}>
                                        <MenuItem onClick={handleClose} disableRipple>
                                            Sign In
                                        </MenuItem>
                                    </Link>
                                    <Link href={"/signup"}>
                                        <MenuItem onClick={handleClose} disableRipple>
                                            Sign Up
                                        </MenuItem>
                                    </Link>
                                </StyledMenu>
                            </div>
                        ) : (

                            <div>
                                <Button
                                    id="demo-customized-button"
                                    aria-controls={open ? 'demo-customized-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    variant="contained"
                                    disableElevation
                                    onClick={handleClick}
                                    sx={{ textTransform: "none" }}
                                    endIcon={<ChevronDownIcon />}
                                >
                                    <div className="flex items-center">
                                        <div className="pr-3">
                                            <img className="lg:h-8 lg:w-8 md:h-8 md:w-8 h-6 w-6 rounded-full object-cover" src={photo_profile == null ? "/anonymous.jpeg" : photo_profile} alt="" />
                                        </div>
                                        <div className="flex flex-1">
                                            <p className="text-sm text-white-500 font-base">{username}</p>
                                        </div>
                                    </div>
                                </Button>
                                <StyledMenu
                                    id="demo-customized-menu"
                                    MenuListProps={{
                                        'aria-labelledby': 'demo-customized-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <Link href={"/"}>
                                        <MenuItem onClick={handleClose} disableRipple>
                                            Home
                                        </MenuItem>
                                    </Link>
                                    <Link href={"/searchuser"}>
                                        <MenuItem onClick={handleClose} disableRipple>
                                            Search
                                        </MenuItem>
                                    </Link>
                                    <Link href={"/mytweets"}>
                                        <MenuItem onClick={handleClose} disableRipple>
                                            My Tweets
                                        </MenuItem>
                                    </Link>
                                    <Divider sx={{ my: 0.5 }} />
                                    <Link href={"/myprofile"}>
                                        <MenuItem onClick={handleClose} disableRipple>
                                            My Profile
                                        </MenuItem>
                                    </Link>

                                    <MenuItem onClick={logOut} disableRipple>
                                        Logout
                                    </MenuItem>
                                </StyledMenu>
                            </div>
                        )}
                    </>
                </ul>
            </header>
            {children}
        </>
    );
};

export default Navbar;