import React, {useState} from 'react';
import Box from "@mui/material/Box";
import {
    Button,
    FormHelperText,
    Grid,
    Modal,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import PropsAction from "../../interface/PropsAction";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const TextFields = styled(TextField)`
   input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    .MuiFormHelperText-root {
  color: #FF0000 !important;
}
`;

type TextBookType = {
    id:string,
    code: string,
    classification: string,
    textBookType: string,
    name: string,
    numberOfCharacters: string,
    questionCount: string,
    categoryId: string,
    categoryName: string
}
type TextBookSearchModalType = {
    onChange: (name:string, value:string) => void
    onChangeCount: (name:string, value:string) => void

}
const TextBookSearchModal:React.FC<TextBookSearchModalType> = ({onChange, onChangeCount}) => {
    const navigate = useNavigate();
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [modalErrorCode, setModalErrorCode] = useState('');
    const [modalErrorName, setModalErrorName] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);
    const [searchCode, setSearchCode] = useState('');
    const [searchName, setSearchName] = useState('');
    const [rows, setRows] = useState<TextBookType[]>([]);


    const clear = {
        id:'',
        code: '',
        classification: '',
        textBookType: '',
        name: '',
        numberOfCharacters: '',
        questionCount: '',
        categoryId: '',
        categoryName: '',
    }
    const [textBook, setTextBook] = useState({
        id:'',
        code: '',
        classification: '',
        textBookType: '',
        name: '',
        numberOfCharacters: '',
        questionCount: '',
        categoryId: '',
        categoryName: '',
    })

    const onchangeSearchCode = (e:PropsAction) => {
        setSearchCode(e.target.value)
    }
    const onchangeSearchName = (e:PropsAction) => {
        setSearchName(e.target.value)
    }
    const onClickSearch = (item: TextBookType) => {
        onChange('code', item.code);
        onChangeCount('questionCount', item.questionCount);

        setOpenInfo(current => !current);
        setTextBook(clear)
    }
    const clickButton = () => {
        setOpenInfo(current => !current);
        setModalErrorName('')
        setModalErrorCode('');
        setSearchCode('');
        setSearchName('');
    }
    const clickSearchCode = () => {
        if (searchCode === '') {
            setModalErrorCode('?????? ?????? ?????? ????????????.');
            return
        }
        setModalErrorCode('');
        rows.length = 0;
        axios.get(`/api/textbooks/code/${searchCode}`)
            .then(res => {
                setRows([res.data]);
            })
            .catch(error => {
                if (error.response.status === 401) {
                    navigate('/login');
                }
            })
    }
    const clickSearchName = () => {
        if (searchName === '') {
            setModalErrorName('?????? ?????? ?????? ????????????.');
            return
        } else if (searchName.length < 2){
            setModalErrorName('?????? 2????????? ????????? ?????????');
            return;
        }
        setModalErrorName('');
        rows.length = 0;
        axios.get(`/api/textbooks/name/${searchName}`)
            .then(res => {
                let resValue = res.data;
                setRows(resValue);
                if (resValue.length === 0) {
                    setIsEmpty(true)
                }else {
                    setIsEmpty(false);
                }
            })
            .catch(error => {
                if (error.response.status === 401) {
                    navigate('/login');
                }
            })
    }
    return (
        <div>
            <Button
                variant="contained"
                onClick={clickButton}
                endIcon={<SendIcon/>}
            >
                ????????????
            </Button>
            <Box sx={{display: 'flex'}}>
                <Grid item xs={12}>


                </Grid>
            </Box>
            <Modal open={openInfo}>
                <Box sx={style}>
                    <Grid item xl={12} sx={{marginBottom:3}}>
                        <TextFields size='small' name='search' label='?????? ??????' variant="outlined"
                                    error={modalErrorCode !== ''} helperText={modalErrorCode}
                                   focused onChange={onchangeSearchCode} value={searchCode}
                                    placeholder='???????????? ????????? ????????????.' autoFocus
                        />
                        <Button
                            variant="contained"
                            onClick={clickSearchCode}
                            endIcon={<SendIcon/>}
                            sx={{marginLeft:0.5}}
                        >
                            ??????
                        </Button>
                        <TextFields size='small' name='name' label='?????????' variant="outlined"
                                    sx={{marginLeft:4}}
                                    error={modalErrorName !== ''} helperText={modalErrorName}
                                    focused onChange={onchangeSearchName} value={searchName}
                        />
                        <Button
                            variant="contained"
                            onClick={clickSearchName}
                            endIcon={<SendIcon/>}
                            sx={{marginLeft:0.5}}

                        >
                            ??????
                        </Button>
                    </Grid>
                    <Grid>
                        {
                            isEmpty ? <FormHelperText sx={{color: 'red'}}>
                                    ?????? ????????? ????????????.</FormHelperText>
                                : <Table size="small" >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>??????</TableCell>
                                            <TableCell>??????</TableCell>
                                            <TableCell>??????</TableCell>
                                            <TableCell>?????????</TableCell>
                                            <TableCell>????????????</TableCell>

                                            {/*<TableCell align="right">Sale Amount</TableCell>*/}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map(item => {
                                            return <TableRow key={item.id}>
                                                <TableCell>{item.classification}</TableCell>
                                                <TableCell >{item.code}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.questionCount}</TableCell>
                                                <TableCell>{item.id !== ''? <Button onClick={()=>onClickSearch(item)}>??????</Button> : ''}</TableCell>
                                            </TableRow>
                                        })}
                                    </TableBody>
                                </Table>
                        }

                    </Grid>
                    <Button
                        variant="contained"
                        onClick={clickButton}
                        style={{margin: 12,marginTop:30}}
                    >
                        ??????
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}

export default TextBookSearchModal;