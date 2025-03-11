import React from 'react';
import { Container } from '../components/Container';

export default function page() {
  return (
    <Container className="size-full">
      <embed
        className="size-full pt-8"
        src="https://will-white.github.io/resume/William_White_Resume.pdf#view=FitH"
        type="application/pdf"
      />
    </Container>
  );
}
