
import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  Form,
  Toggle,
} from "rsuite";
import { ref, serverTimestamp, set } from "firebase/database";
import { auth, database } from "../misc/firebase.config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const SignIn = () => {
  const history = useHistory();
  const [formValue, setFormValue] = React.useState({
    email: '',
    password: '',
  });

  const [isSignUp, setIsSignUp] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const randomId = React.useMemo(() => Math.random().toString(36).substring(2, 15), []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFormValue({
        email: '',
        password: '',
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    if (!formValue.email) {
      Swal.fire({
        title: 'Missing Email',
        text: 'Please enter your email address',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5',
      });
      return false;
    }

    if (!formValue.password) {
      Swal.fire({
        title: 'Missing Password',
        text: 'Please enter your password',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5',
      });
      return false;
    }

    if (isSignUp && formValue.password.length < 6) {
      Swal.fire({
        title: 'Password Too Short',
        text: 'Password must be at least 6 characters',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5',
      });
      return false;
    }

    return true;
  };

  const guestCredentials = {
    email: "guest@studysphere.com",
    password: "guest123"
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        guestCredentials.email,
        guestCredentials.password
      );

      await Swal.fire({
        title: 'Welcome, Guest!',
        text: 'You are now signed in as a guest user',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
      });

      history.push('/dashboard'); // Redirect after login
    } catch (error) {
      console.error('Guest login error:', error);

      await Swal.fire({
        title: 'Guest Login Failed',
        text: 'Unable to sign in as guest. Please try again or use regular sign in.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      let credential;

      if (isSignUp) {
        credential = await createUserWithEmailAndPassword(
          auth,
          formValue.email,
          formValue.password
        );

        await set(ref(database, "users/" + credential.user.uid), {
          name: formValue.email.split('@')[0],
          createdAt: serverTimestamp(),
          avatar: null,
        });
      } else {
        credential = await signInWithEmailAndPassword(
          auth,
          formValue.email,
          formValue.password
        );
      }

      await Swal.fire({
        title: 'Success!',
        text: isSignUp ? 'Account created successfully!' : 'Signed in successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
      });

      history.push('/dashboard');
    } catch (error) {
      console.error('Email authentication error:', error);

      let errorMessage = error.message;
      let errorTitle = 'Error';

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorTitle = 'Authentication Failed';
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/email-already-in-use':
          errorTitle = 'Email Already Registered';
          errorMessage = 'This email is already in use.';
          break;
        case 'auth/weak-password':
          errorTitle = 'Weak Password';
          errorMessage = 'Password is too weak.';
          break;
        case 'auth/invalid-email':
          errorTitle = 'Invalid Email';
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/network-request-failed':
          errorTitle = 'Network Error';
          errorMessage = 'Please check your internet connection.';
          break;
        default:
          errorTitle = 'Authentication Error';
          errorMessage = error.message;
          break;
      }

      await Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="geometric-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="signin-container">
        <div className="signin-card">
          <Link to="/" className="back-link">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
          </Link>

          <div className="logo-container">
            <div className="logo">
              <div className="logo-icon"></div>
              <h1>StudySphere</h1>
            </div>
            <p>Connect, collaborate, and learn together</p>
          </div>

          <div className="form-header">
            <h2>{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
            <p>{isSignUp ? 'Join our community of learners today' : 'Sign in to continue your learning journey'}</p>
          </div>

          <Form
            key={isSignUp ? 'signup' : 'signin'}
            fluid
            formValue={formValue}
            onChange={(value) => setFormValue(value)}
            autoComplete="new-password"
          >
            <input type="text" style={{ display: 'none' }} />
            <input type="password" style={{ display: 'none' }} />

            <Form.Group>
              <Form.ControlLabel>Email</Form.ControlLabel>
              <div className="input-icon-wrapper">
                <Form.Control
                  name={`user_email_address_${randomId}`}
                  type="email"
                  placeholder="Enter your email"
                  style={{ paddingLeft: '40px' }}
                  autoComplete="new-password"
                  value={formValue.email}
                  onChange={(value) =>
                    setFormValue((prev) => ({ ...prev, email: value }))
                  }
                />
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <div className="input-icon-wrapper">
                <Form.Control
                  name={`user_secret_password_${randomId}`}
                  type="password"
                  placeholder="Enter your password"
                  style={{ paddingLeft: '40px' }}
                  autoComplete="new-password"
                  value={formValue.password}
                  onChange={(value) =>
                    setFormValue((prev) => ({ ...prev, password: value }))
                  }
                />
                <FontAwesomeIcon icon={faLock} className="input-icon" />
              </div>
              {isSignUp && (
                <Form.HelpText>
                  Password must be at least 6 characters long
                </Form.HelpText>
              )}
            </Form.Group>

            <div className="toggle-container">
              <Toggle
                checked={isSignUp}
                onChange={setIsSignUp}
                checkedChildren="Sign Up"
                unCheckedChildren="Sign In"
              />
              <span className="toggle-label">
                {isSignUp ? 'Creating new account' : 'Already have an account'}
              </span>
            </div>

            <Button
              block
              appearance="primary"
              onClick={handleEmailAuth}
              loading={isLoading}
              className="submit-btn"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            <div className="guest-login-container">
              <div className="guest-login-divider">OR</div>

              <Button
                block
                appearance="ghost"
                onClick={handleGuestLogin}
                loading={isLoading}
                className="guest-btn"
              >
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                Continue as Guest
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

