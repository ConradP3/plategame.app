import React, { useState } from 'react';
import Head from 'next/head';
import { Container, CustomInput, FormGroup, Navbar, Table, UncontrolledAlert } from 'reactstrap';
import states from '../utils/states.json';

export default function Home() {
  const [found, setFound] = useState(0);

  function handleCheckboxClick(event) {
    event.persist();

    setFound((prevFound) => (event.target.checked ? prevFound + 1 : prevFound - 1));
  }

  return (
    <>
      <Head>
        <title>Play the License Plate Game Online</title>
        <script
          data-ad-client="ca-pub-5242524909426428"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-998540-10" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-998540-10');`,
          }}
        />
      </Head>
      <Navbar color="primary">
        <div className="lead">License Plate Game!</div>
      </Navbar>
      <Container>
        <UncontrolledAlert className="my-3">
          As you spot license plates from different states, check the box for the state you saw!
        </UncontrolledAlert>
        <Table>
          <thead>
            <tr>
              <th>Found</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            <tr className="lead">
              <td>{found}</td>
              <td>{states.length - found}</td>
            </tr>
          </tbody>
        </Table>
        <div className="font-weight-bold border-bottom border-dark pb-3 mb-3">Select State</div>
        {states.map(({ name, abbreviation }) => (
          <FormGroup key={name}>
            <CustomInput id={abbreviation} type="checkbox" label={name} onClick={handleCheckboxClick} />
          </FormGroup>
        ))}
      </Container>
      <footer className="bg-dark p-3">
        &copy; 2020 <a href="https://ryanwalters.dev">Ryan Walters</a>
      </footer>
    </>
  );
}
