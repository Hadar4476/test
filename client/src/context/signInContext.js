import React, { useState } from 'react';
import { enableBodyScroll } from 'body-scroll-lock';

import axios from '../axios-users';

const tokenKey = 'token';

export const SignInContext = React.createContext({
  formModal: {},
  displaySignInModal: false,
  isTokenValid: false,
  error: null,
  onDisplaySignInModal: () => {},
  onHideSignInModal: () => {},
  updateFormModal: () => {},
  onSignInFormSubmit: () => {},
  navigateToGallery: () => {},
  setIsTokenValid: () => {},
});

export default (props) => {
  const [formModalState, setFormModalState] = useState({
    email: {
      elementType: 'input',
      labelHTML: 'Email',
      elementConfig: {
        type: 'email',
      },
      value: '',
      valid: false,
    },
    password: {
      elementType: 'input',
      labelHTML: 'Password',
      elementConfig: {
        type: 'password',
      },
      value: '',
      valid: false,
    },
  });

  const [displaySignInModalState, setDisplaySignInModalState] = useState(false);

  const [isTokenValidState, setIsTokenValidState] = useState(false);

  const [errorState, setErrorState] = useState(null);

  const onDisplaySignInModal = () => {
    setDisplaySignInModalState(true);
  };

  const onHideSignInModal = () => {
    enableBodyScroll(document.getElementsByTagName('body')[0]);
    setErrorState(null);
    setDisplaySignInModalState(false);
  };

  const updateFormModal = (updatedFormModal) => {
    setFormModalState(updatedFormModal);
  };

  const onSignInFormSubmit = async (user) => {
    await axios
      .post('/auth', user)
      .then((response) => {
        const copyFormModal = { ...formModalState };
        for (const key in copyFormModal) {
          copyFormModal[key].value = '';
          copyFormModal[key].valid = false;
        }
        updateFormModal(copyFormModal);
        enableBodyScroll(document.getElementsByTagName('body')[0]);
        localStorage.setItem(tokenKey, response.data.token);
        setIsTokenValidState(true);
      })
      .catch((error) => setErrorState(error.response.data));
  };

  return (
    <SignInContext.Provider
      value={{
        formModal: formModalState,
        displaySignInModal: displaySignInModalState,
        isTokenValid: isTokenValidState,
        error: errorState,
        onDisplaySignInModal: onDisplaySignInModal,
        onHideSignInModal: onHideSignInModal,
        updateFormModal: updateFormModal,
        onSignInFormSubmit: onSignInFormSubmit,
        setIsTokenValid: setIsTokenValidState,
      }}
    >
      {props.children}
    </SignInContext.Provider>
  );
};
