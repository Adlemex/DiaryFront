import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import axios from 'axios';

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    imgContainer: {
        position: 'relative',
        flex: 1,
        padding: 16,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
}

function Transition(props) {
    return <Slide direction="up" {...props} />
}

class ImgDialog extends React.Component {
    state = {
        open: false,
    }

    handleClickOpen = () => {
        console.log(this.props.img)
        console.log(window.location.pathname)

        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }
    render() {
        const { classes } = this.props
        return (
            <Dialog
                fullScreen
                open={!!this.props.img}
                onClose={this.props.onClose}
                TransitionComponent={Transition}
            >
                <div>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                onClick={window.close}
                                aria-label="Close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography
                                variant="title"
                                color="inherit"
                                className={classes.flex}
                            >
                                Фото профиля
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.imgContainer}>
                        <img src={this.props.img} alt="Cropped" className={classes.img} />
                    </div>
                </div>
            </Dialog>
        )
    }
}

export default withStyles(styles)(ImgDialog)