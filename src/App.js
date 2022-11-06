import logo from './logo.svg';
import './App.css';
import "react-uploader";
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {fileCroppedImg, getCroppedImg, getRotatedImage} from './canvasUtils'
import React, { useState, useCallback } from 'react'
import ImgDialog from './ImgDialog'
import { getOrientation } from 'get-orientation/browser'
import { styles } from './styles'
import "./index.css"
import {withStyles} from "@material-ui/core/styles";
import axios from "axios";
const ORIENTATION_TO_ANGLE = {
    '3': 180,
    '6': 90,
    '8': -90,
}

const Demo = ({ classes }) => {
    const [imageSrc, setImageSrc] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            )
            const croppedImageFile = await fileCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            )

            const data = new FormData()
            data.append('file', croppedImageFile)
            axios({
                method: 'post',
                url: "http://localhost:8000/images" + window.location.pathname,
                data: data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
            })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.error(error);
                });
            console.log('donee', { croppedImage })
            setCroppedImage(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }, [imageSrc, croppedAreaPixels, rotation])

    const onClose = useCallback(() => {
        setCroppedImage(null)
    }, [])

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            let imageDataUrl = await readFile(file)

            // apply rotation if needed
            const orientation = await getOrientation(file)
            const rotation = ORIENTATION_TO_ANGLE[orientation]
            if (rotation) {
                imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
            }

            setImageSrc(imageDataUrl)
        }
    }

    return (
        <div>
            {imageSrc ? (
                <React.Fragment>
                    <div className={classes.cropContainer}>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            rotation={rotation}
                            zoom={zoom}
                            aspect={1 / 1}
                            cropShape={'round'}
                            onCropChange={setCrop}
                            onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className={classes.controls}>
                        <Button
                            onClick={showCroppedImage}
                            variant="contained"
                            color="primary"
                            classes={{ root: classes.cropButton }}
                        >
                            Установить фото
                        </Button>
                    </div>
                    <ImgDialog img={croppedImage} onClose={onClose} />
                </React.Fragment>
            ) : (
                <div>
                    <label style={{border: "1px solid #ccc",  display: "inline-block", padding: "6px 12px", cursor: "pointer"}}>
                        <input style={{display: "none"}} type="file" onChange={onFileChange} />
                        <i className="fa fa-cloud-upload" /> Загрузить
                    </label>
                </div>
            )}
        </div>
    )
}

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}
function App() {


// ----------------------------
// Create a Simple React App...
// ----------------------------
    const StyledDemo = withStyles(styles)(Demo)
  return (

    <div className="App">
      <>
        <StyledDemo/>
      </>
    </div>
  );
}

export default App;
