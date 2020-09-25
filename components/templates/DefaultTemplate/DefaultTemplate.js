import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Navbar } from 'reactstrap';

const DefaultTemplate = ({ activeTerritories, children }) => {
  const [isMounted, setIsMounted] = useState(false);

  // Needed to make the previously selected territories in the cookie work ¯\_(ツ)_/¯

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Play the License Plate Game Online for Free</title>
        <meta
          name="description"
          content="No app download required! As you spot license plates from different states and provinces during your trip, check the box!"
        />
      </Head>
      <Navbar color="primary" fixed="top" className="shadow">
        <h1 className="lead mb-0">
          <a href="/">License Plate Game!</a>
        </h1>
        {isMounted && activeTerritories.length > 0 && activeTerritories.length}
      </Navbar>
      <Container>{children}</Container>
      <footer className="bg-dark p-3 mt-3">
        &copy; 2020 <a href="https://ryanwalters.dev">Ryan Walters</a>
      </footer>
    </>
  );
};

DefaultTemplate.propTypes = {
  activeTerritories: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};

DefaultTemplate.defaultProps = {
  activeTerritories: [],
  children: null,
};

export default DefaultTemplate;
