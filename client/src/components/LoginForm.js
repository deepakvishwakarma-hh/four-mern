import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
  // State for user form data, validation, and error alert
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [login, { error }] = useMutation(LOGIN_USER);

  useEffect(() => {
    // Display error alert if there's an error
    setShowAlert(error ? true : false);
  }, [error]);

  const handleInputChange = (event) => {
    // Update user form data on input change
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validate the form
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const { data } = await login({
          variables: { ...userFormData },
        });

        console.log(data);
        Auth.login(data.login.token);
      } catch (e) {
        console.error(e);
      }

      // Clear form values
      setUserFormData({
        email: '',
        password: '',
      });
    }

    // Set the form validation status
    setValidated(true);
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
