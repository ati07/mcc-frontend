import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import Employees from "./Employee";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  Backdrop,
  CircularProgress,
  TextField,
} from "@mui/material";
// import TextArea from "./TextArea";
import Textarea from '@mui/joy/Textarea';
import Header from "./Header";
import { toast } from 'react-toastify';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
  height:'100%'
}));

const SchedulingPage = ({ baseUrl }: any) => {
  const [selectedEmployees, setSelectedEmployees] = useState<any>([]);

  const [scheduleDate, setScheduleDate] = React.useState<Dayjs | null>(dayjs(new Date( new Date().getTime() + 60*60*1000)));
  const [scheduleComment, setScheduleComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [ id, setId] = useState('');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [refetch, setRefetch] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState(0);
  const wordLimit = 200;

  const handleCheckboxChange = (SelectedEmployees: any) => {
    setSelectedEmployees(SelectedEmployees);
  };

  const handleSubmit = async (e: any) => {
    // console.log(e)
    e.preventDefault();
    if(selectedEmployees.length ===0){
      toast.warn("Please Select Employee to schedule comment")
      return;
    }
    if (scheduleComment.length > 200) {
      toast.warn("Comment cannot exceed 200 characters!")
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(baseUrl + "/schedule", {
        employees: selectedEmployees,
        scheduleDatetime: scheduleDate,
        comment: scheduleComment,
      },
      {
        headers: {
          Authorization:
            "Basic " + JSON.parse(localStorage.getItem("user") as any).token,
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      setScheduleComment("")
      setSelectedEmployees([])
      // alert("Schedule created successfully!");
      toast.success("Schedule created successfully!")
    } catch (error) {
      toast.error("Error creating schedule!")
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  

  let onSubmitDetail = async () => {
    setLoading(true);
    let response
    if(id ===''){
      response = await axios.post(
        baseUrl + "/employees",
        { name, email },
        {
          headers: {
            Authorization:
              "Basic " + JSON.parse(localStorage.getItem("user") as any).token,
            "Content-Type": "application/json",
          },
        }
      );
    }else{
      response = await axios.put(
        baseUrl + "/employees"+`/${id}`,
        { name, email },
        {
          headers: {
            Authorization:
              "Basic " + JSON.parse(localStorage.getItem("user") as any).token,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    if (response.data.success) {
      setRefetch(true);
      setOpen(false);
      setLoading(false);
      setId('')
      toast.success("Success Notification !");
    }
  };

  
  let onChange = (event:any)=>{

    const inputText = event.target.value;

    if (inputText.length <= wordLimit) {
      // setText(inputText);
      setScheduleComment(event.target.value)
      setWordCount(inputText.length);
    }else{
      toast.warn('Comment cannot exceed 200 characters!')
    }
    // if(scheduleComment.length > 200){
      
    // }else{
      
    // }
    
    
  }
  return (
    <>
    <Header/>
    <Box sx={{ flexGrow: 1 }}>
      
      <Box display={"flex"} marginBottom={"10px"}>
        <button onClick={handleClickOpen}>Add Employee</button>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{xs: 12,sm: 12, md: 8}}>
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={loading}
            // onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Item>
            <Employees
              baseUrl={baseUrl}
              handleCheckboxChange={handleCheckboxChange}
              refetch={refetch}
              setName={(value:any)=>setName(value)}
              setEmail={(value:any)=>setEmail(value)}
              setOpen={setOpen}
              setId={setId}
            />
          </Item>
        </Grid>
        <Grid size={{xs:12,sm: 12, md: 4}}>
          <Item>
            <div className="scheduling-page">
              <h3>Schedule Details</h3>
              <form onSubmit={handleSubmit}>
                <div className="schedule-details">
                  {/* <h3>Schedule Details</h3> */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DateTimePicker", "DateTimePicker"]}
                    >
                      <DateTimePicker
                        label="Select a Date"
                        value={scheduleDate}
                        onChange={(newValue) => setScheduleDate(newValue)}
                        disablePast
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <h4 style={{display:"flex",marginTop:'20px',marginBottom:'20px'}}>Schedule Comment</h4>
               {/* style={{overflow:"scroll"}} disabled={scheduleComment.length >= 200} */}
                    <Textarea  placeholder="Enter comment (200 characters max)" minRows={4} value={scheduleComment} onChange={onChange} />
                    <p>
                      {wordCount}/{wordLimit} words
                    </p>
                </div>
                <button type="submit">Submit Schedule</button>
              </form>
            </div>
          </Item>
        </Grid>
      </Grid>
      <React.Fragment>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          // onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Enter Employee Detail"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField
                    id="standard-basic"
                    label="Name"
                    variant="standard"
                    value={name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setName(event.target.value);
                    }}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    value={email}
                    id="standard-basic"
                    label="Email"
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setEmail(event.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <button onClick={onSubmitDetail}>Submit</button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </Box>
    </>
  );
};

export default SchedulingPage;
