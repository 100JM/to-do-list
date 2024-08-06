import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { modalAction } from '../store/modalSlice';
import { loginAction, kakaoLogoutThunk } from '../store/loginSlice';
import { useAppDispatch } from '../store/hook';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { blue } from '@mui/material/colors';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface UserDialogInterface {
    handleShowAlert: (isShow:boolean, alertText:string, alertType: 'error' | 'warning' | 'info' | 'success') => void;
};

const UserDialog: React.FC<UserDialogInterface> = ({handleShowAlert}) => {
    const isUserDialog = useSelector((state: RootState) => state.modal.isUserDialog);
    const userName = useSelector((state: RootState) => state.login.name);
    const userImg = useSelector((state: RootState) => state.login.profileImage);
    const dispatch = useAppDispatch();

    const closeUserDialog = () => {
        dispatch(modalAction.handleUserModal(false));
    };

    const handleLogout = async () => {
        try {
            await dispatch(kakaoLogoutThunk()).unwrap();
            dispatch(modalAction.handleUserModal(false));
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    const handleReauthorize = () => {
        if(userImg) {
            handleShowAlert(true, '추가 동의 항목이 없습니다.', 'info');
            return;
        }

        if (window.Kakao && window.Kakao.Auth) {
            const state = 'reauthorize';

            window.Kakao.Auth.authorize({
                redirectUri: 'http://192.168.0.127:5173',
                scope: 'profile_image',
                state: state
            });
        }
    };

    return (
        <Dialog
            open={isUserDialog}
            onClose={closeUserDialog}
        >
            <DialogTitle style={{ padding: "10px 16px", borderBottom: "1px solid #eee" }}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        {
                            !userImg &&
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600], marginRight: "8px" }}>
                                <PersonIcon />
                            </Avatar>
                        }
                        {
                            userImg &&
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600], marginRight: "8px" }}>
                                <img src={userImg} />
                            </Avatar>
                        }
                        {` ${userName}님`}
                    </div>
                    <button type="button" style={{ color: "#2c3e50" }} onClick={closeUserDialog}>
                        <FontAwesomeIcon icon={faXmark as IconProp} />
                    </button>
                </div>
            </DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem disableGutters>
                    <ListItemButton onClick={handleReauthorize}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <ManageAccountsIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={'개인정보동의 내역 수정'}></ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <LogoutIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={'로그아웃'}></ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    )
};

export default UserDialog;