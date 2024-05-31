import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface CustomAlertInterface {
    showAlert: {
        isShow: boolean,
        alertText: string,
        alertType: 'error' | 'warning' | 'info' | 'success'
    };
    handleShowAlert: (isShow:boolean, alertText:string, alertType: 'error' | 'warning' | 'info' | 'success') => void;
}

const CustomAlert: React.FC<CustomAlertInterface> = ({ showAlert, handleShowAlert }) => {

    const action = (
        <>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => handleShowAlert(false, '', 'success')}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </>
    );

    return (
        <Snackbar
            open={showAlert.isShow}
            autoHideDuration={5000}
            onClose={() => handleShowAlert(false, '', 'success')}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
        >
            <Alert severity={showAlert.alertType} action={action}>{showAlert.alertText}</Alert>
        </Snackbar>
    )
}

export default CustomAlert;