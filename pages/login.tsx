import Head from 'next/head'
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import { useRecoilState } from "recoil";
import { accessTokenState, userInformationState } from '@/components/storage/storage';
import toast from "@/components/commons/toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

export default function Login() {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [userInformation, setUserInformation] = useRecoilState(userInformationState);

  const initialState = {
    'email': '', 'password': ''
  }

  const [form, setForm] = useState(initialState);

  const handleFormChange = (event) => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    var formdata = new FormData();
    formdata.append("email", form.email);
    formdata.append("password", form.password);
    fetch(`${process.env.BASE_URL}users/login`, {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json())
      .then(data => {
        setAccessToken(data.token.access);
        setUserInformation({
          id: data.data.id,
          email: data.data.email,
          username: data.data.username,
          content: data.data.content,
          photo_profile: data.data.photo_profile,
          last_login: data.data.last_login,
          bio: data.data.bio,
        })
        toast.success("Successfully login!")
      }).catch(err => {
        toast.error(`Something went wrong! Check your email or password!`)
      });
  }

  useEffect(() => {
    if (accessToken) {
      window.location.replace("/");
    }
  }, [accessToken]);

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
          }}
        >
          <div className='font-bold lg:text-2xl md:text-2xl text-lg text-blue-900 hover:text-blue-800'>
            Sign In
          </div>
          <Box component="form" noValidate onSubmit={handleSubmit} onChange={event => handleFormChange(event)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!form.email || !form.password}>
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signup" variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1618005198920-f0cb6201c115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDh8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <ToastContainer />
    </Grid>
  )
}