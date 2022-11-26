import React, {FC} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type PropsType = {
  hasAlready: boolean
  setHasAlready: (hasAlready: boolean) => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const  TaskSnackbar: FC<PropsType> = ({hasAlready, setHasAlready}) => {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setHasAlready(false);
  };

  return (
    <Snackbar open={hasAlready} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          This task already exists!
      </Alert>
    </Snackbar>
  );
};