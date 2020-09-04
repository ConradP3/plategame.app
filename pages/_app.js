import PropTypes from 'prop-types';
import React from 'react';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import '../styles/globals.css';

function LicensePlateGameApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

LicensePlateGameApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape().isRequired,
};

export default LicensePlateGameApp;
