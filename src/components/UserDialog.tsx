import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { modalAction } from '../store/modalSlice';
import { loginAction } from '../store/loginSlice';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { blue } from '@mui/material/colors';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const UserDialog: React.FC = () => {
    const isUserDialog = useSelector((state: RootState) => state.modal.isUserDialog);
    const userName = useSelector((state: RootState) => state.login.name);
    const dispatch = useDispatch();

    const closeUserDialog = () => {
        dispatch(modalAction.handleUserModal(false));
    }

    const handleLogout = () => {
        if (window.Kakao && window.Kakao.Auth) {
            window.Kakao.Auth.logout(() => {
                dispatch(modalAction.handleUserModal(false));
                dispatch(loginAction.handleLogout());
            });
        }
    };

    const handleReauthorize = () => {
        if (window.Kakao && window.Kakao.Auth) {
            window.Kakao.Auth.authorize({
                redirectUri: 'http://192.168.0.127:5173',
                scope: 'profile_image', // 다시 동의를 요청할 항목
                success: (response: any) => {
                    console.log('Reauthorize success:', response);
                    dispatch(loginAction.handleLogout());
                },
                fail: (error: any) => {
                    console.error('Reauthorize failed:', error);
                },
            });
        }
    };

    return (
        <Dialog
            open={isUserDialog}
            onClose={closeUserDialog}
        >
            <DialogTitle style={{ padding: "16px" }}>
                <div className="flex justify-between items-center">
                    <span>{`${userName}님`}</span>
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