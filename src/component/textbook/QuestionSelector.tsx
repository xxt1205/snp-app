import React, {useEffect, useState} from 'react';
import {Grid} from "@mui/material/";
import {FormControl, InputLabel, Select, SelectChangeEvent} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

type QuestionType = {
    num:number,
    questionSize:number
    onChangeQuestion: (num:number, name:string, value:string) => void
    getQuestionValue?: QuestionNumberType
}
type QuestionNumberType = {
    number: number, questionType?: string, answerType?: string
}
const QuestionSelector:React.FC<QuestionType> = ({num,questionSize,onChangeQuestion, getQuestionValue}) => {
    const [isDisable, setIsDisable] = useState(true);
    const [questionValue, setQuestionValue] = useState({questionType:'NONE',answerType:'SHORT'});
    useEffect(() => {
        let numSize = num;
        if (numSize <= questionSize || num === 1) {
            setIsDisable(false);
        } else if (numSize > questionSize){
            setIsDisable(true);
            setQuestionValue({...questionValue,questionType: '', answerType: ''})
        }
    },[questionSize]);
    useEffect(() => {
        if (getQuestionValue!==undefined){
            if (getQuestionValue.number === num) {
                let getQuestionType = getQuestionValue.questionType === undefined ? '' : getQuestionValue.questionType;
                let getAnswerType = getQuestionValue.answerType === undefined ? '' : getQuestionValue.answerType;
                if (getQuestionType !== undefined && getAnswerType !== undefined) {
                    setQuestionValue((prevState) => ({
                        ...prevState,questionType:getQuestionType, answerType: getAnswerType
                    }));
                    setIsDisable(false);
                }
            }
        }else {
            setQuestionValue((prevState) => ({
                ...prevState,questionType:'', answerType: ''
            }));
            setIsDisable(true);
        }
    },[getQuestionValue])
    const onChange = (e:SelectChangeEvent) => {
        let name = e.target.name
        let value = e.target.value;
        setQuestionValue((prevState) => ({
            ...prevState,[name]:value
        }))
        onChangeQuestion(num, name, value);
    }

    return (
        <>
            <Grid item xs={12} sm={1}>
                <Typography variant="h6" sx={{marginTop:0.5}}>{num}:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <Select
                        size="small"
                        name='questionType'
                        id='questionType'
                        value={questionValue.questionType}
                        autoWidth={false}
                        onChange={onChange}
                        sx={{minWidth: 120}}
                        disabled={isDisable}
                    >
                        <MenuItem value='NONE'>????????????</MenuItem>
                        <MenuItem value='LOGICAL'>?????????</MenuItem>
                        <MenuItem value='CRITICISM'>?????????</MenuItem>
                        <MenuItem value="ANALYTICAL">?????????</MenuItem>
                        <MenuItem value='CREATIVITY'>?????????</MenuItem>
                        <MenuItem value='REASONING'>?????????</MenuItem>
                    </Select>

                </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                    <Select
                        size="small"
                        name='answerType'
                        id='answerType'
                        value={questionValue.answerType}
                        autoWidth={false}
                        onChange={onChange}
                        sx={{minWidth: 120}}
                        disabled={isDisable}
                    >
                        <MenuItem disabled={true} value=''>????????????</MenuItem>
                        <MenuItem value='SHORT'>??????</MenuItem>
                        <MenuItem value='DESCRIPTION'>??????</MenuItem>
                    </Select>

                </FormControl>
            </Grid>
            </>
    )
}

export default QuestionSelector;