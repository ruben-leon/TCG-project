import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm.jsx';
import Logo from '../../components/Logo/Logo.jsx';
import ErrorAndSuccessModal from '../../components/ErrorAndSuccessModal/ErrorAndSuccessModal.jsx';
import { isValidEmail } from '../RegisterPage/emailValidation.js';

import './LoginPage.scss';

const LoginPage = ({ isRegisterSuccess, setIsRegisterSuccess }) => {
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [isAllLoginFieldsFilled, setIsAllLoginFieldsFilled] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const navigate = useNavigate();

  const toggleRegisterSuccessModal = () => {
    setTimeout(() => {
      setIsRegisterSuccess(!isRegisterSuccess);
    }, 4000);
  };

  useEffect(() => {
    if (isRegisterSuccess) {
      toggleRegisterSuccessModal();
    }
  }, [isRegisterSuccess]);

  return (
    <div className="LoginPage">
      <Logo height={'80'} />
      <div className="LoginTextAndFormBox">
        <div>
          <h1>Welcome back!</h1>
        </div>

        <LoginForm
          isWrongPassword={isWrongPassword}
          setIsWrongPassword={setIsWrongPassword}
          isAllLoginFieldsFilled={isAllLoginFieldsFilled}
          setIsAllLoginFieldsFilled={setIsAllLoginFieldsFilled}
          isValidEmail={isValidEmail}
          isInvalidEmail={isInvalidEmail}
          setIsInvalidEmail={setIsInvalidEmail}
        />
        <div className="LoginFormContainer">
          {/* <button className="ForgotPasswordButton">
            Forgot your password?
          </button> */}
        </div>
      </div>
      <div className="LoginAndRegisterContainer">
        <button
          className="LoginPageRegisterButton"
          onClick={() => navigate('/register')}
        >
          Register
        </button>
      </div>
      {isRegisterSuccess && (
        <ErrorAndSuccessModal
          customClassName="success-modal"
          easmText={'Successfully registered to TCGmon!'}
        />
      )}

      {isAllLoginFieldsFilled && (
        <ErrorAndSuccessModal
          customClassName="rp-lp-error-style"
          easmText={'All fields must be filled'}
        />
      )}

      {isInvalidEmail && (
        <ErrorAndSuccessModal
          customClassName="rp-lp-error-style"
          easmText={'Invalid email address'}
        />
      )}

      {isWrongPassword && (
        <ErrorAndSuccessModal
          customClassName="rp-lp-error-style"
          easmText={'Wrong email and/or password'}
        />
      )}
    </div>
  );
};

export default LoginPage;
