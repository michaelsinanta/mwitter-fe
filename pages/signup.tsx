import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useRecoilState } from "recoil";
import { accessTokenState, registerDataState, updatingDataState } from '@/components/storage/storage';
import { CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect, useRef } from 'react';
import toast from "@/components/commons/toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

export default function SignUp() {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [registerData, setRegisterData] = useRecoilState(registerDataState);
  const { username, email, password, password2 } = registerData;
  const [updatingData, setUpdatingData] = useRecoilState(updatingDataState);

  const handleFormChange = (event) => {
    setRegisterData(prev => ({ ...registerData, [event.target.name]: event.target.value }));
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    var formdata = new FormData();
    formdata.append("email", email);
    formdata.append("username", username);
    formdata.append("password", password);
    formdata.append("password2", password2);
    await fetch('http://localhost:8000/users/register', {
      method: 'POST',
      body: formdata,
    })
      .then(response => {
        if (response.ok) {
          setRegisterData({
            email: "",
            username: "",
            password: "",
            password2: "",
          });
          toast.success("Successfully register!");
          setTimeout(function () {
            window.location.replace("/login/");
            setUpdatingData(false);
          }, 2000);
        } else {
          toast.error(`Something went wrong! Check your input !`)
        }
      }
      );
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 3,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh'
            }}
          >
            <div className='font-bold lg:text-2xl md:text-2xl text-lg text-blue-900 hover:text-blue-800 mb-5'>
              Sign Up
            </div>
            <Box component="form" noValidate onSubmit={handleSubmit} onChange={event => handleFormChange(event)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password2"
                    label="Repeat Password"
                    type="password"
                    id="password2"
                    autoComplete="repeat-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!username || !email || !password || !password2}>
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Grid>
      <ToastContainer />
    </Grid>
  );
}