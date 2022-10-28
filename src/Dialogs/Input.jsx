import React, {useState, useContext} from 'react';

import Typography from '@mui/material/Typography';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import Stack from "@mui/material/Stack";


export default function InputDialog(props) {
    const [InputContent, setInputContent] = useState("");

    const getModel = async () => {
        console.log(InputContent);
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>
                Input URL
            </DialogTitle>
            <DialogContent>
                <Stack>
                    <TextField
                        type="text"
                        value={InputContent}
                        variant="outlined"
                        onChange={(e) => setInputContent(e.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => getModel()}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}
