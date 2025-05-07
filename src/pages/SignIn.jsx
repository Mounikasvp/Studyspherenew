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
import { faEnvelope, faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

const SignIn = () => {
  const history = useHistory();
  const [formValue, setFormValue] = React.useState({
    email: '',
    password: '',
  });
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Form validation
  const validateForm = () => {
    if (!formValue.email) {
      Swal.fire({
        title: 'Missing Email',
        text: 'Please enter your email address',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5',
        showClass: {
          popup: 'swal2-show'
        },
        hideClass: {
          popup: 'swal2-hide'
        }
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
        showClass: {
          popup: 'swal2-show'
        },
        hideClass: {
          popup: 'swal2-hide'
        }
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
        showClass: {
          popup: 'swal2-show'
        },
        hideClass: {
          popup: 'swal2-hide'
        }
      });
      return false;
    }

    return true;
  };

  const handleEmailAuth = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let credential;

      if (isSignUp) {
        // Sign up with email/password
        credential = await createUserWithEmailAndPassword(
          auth,
          formValue.email,
          formValue.password
        );

        // Create user profile in database
        await set(ref(database, "users/" + credential.user.uid), {
          name: formValue.email.split('@')[0], // Use part of email as display name
          createdAt: serverTimestamp(),
          avatar: null, // Add empty avatar field for profile completeness
        });
      } else {
        // Sign in with email/password
        credential = await signInWithEmailAndPassword(
          auth,
          formValue.email,
          formValue.password
        );
      }

      // Show success message with SweetAlert2
      await Swal.fire({
        title: 'Success!',
        text: isSignUp ? 'Account created successfully!' : 'Signed in successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        showClass: {
          popup: 'swal2-show'
        },
        hideClass: {
          popup: 'swal2-hide'
        }
      });

      // Navigate to dashboard or home page after successful login
      if (!isSignUp) {
        history.push('/dashboard'); // Redirect to dashboard after successful sign in
      }
    } catch (error) {
      console.error('Email authentication error:', error);

      // Provide more user-friendly error messages
      let errorMessage = error.message;
      let errorTitle = 'Error';

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorTitle = 'Authentication Failed';
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorTitle = 'Email Already Registered';
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorTitle = 'Weak Password';
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorTitle = 'Invalid Email';
        errorMessage = 'Invalid email format. Please enter a valid email address.';
      } else if (error.code === 'auth/network-request-failed') {
        errorTitle = 'Network Error';
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }

      // Show error message with SweetAlert2
      await Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4f46e5',
        showClass: {
          popup: 'swal2-show'
        },
        hideClass: {
          popup: 'swal2-hide'
        }
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
          <Link to="/" className="back-link" style={{ position: 'absolute', top: '20px', left: '20px', color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
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

          <Form fluid formValue={formValue} onChange={value => setFormValue(value)}>
            <Form.Group>
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter your email"
                style={{ paddingLeft: '40px' }}
              />
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{ position: 'absolute', left: '15px', top: '42px', color: '#64748b' }}
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                placeholder="Enter your password"
                style={{ paddingLeft: '40px' }}
              />
              <FontAwesomeIcon
                icon={faLock}
                style={{ position: 'absolute', left: '15px', top: '42px', color: '#64748b' }}
              />
              {isSignUp && <Form.HelpText>Password must be at least 6 characters long</Form.HelpText>}
            </Form.Group>

            <div className="toggle-container">
              <Toggle
                checked={isSignUp}
                onChange={setIsSignUp}
                checkedChildren="Sign Up"
                unCheckedChildren="Sign In"
              />
              <span className="toggle-label">{isSignUp ? 'Creating new account' : 'Already have an account'}</span>
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
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
