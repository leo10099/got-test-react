import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

// Enums
import { LANG } from '../../../../utils/enums';

// Styles
import './CtaButton.css';

function CtaButton({ lang }) {
  // Effects
  useLayoutEffect(() => {
    if (window.innerWidth < 1024) {
      setInterval(() => document.getElementById('cta-button').classList.toggle('hover'), 2000);
    }
  });

  return (
    <button id="cta-button" className="cta-button">
      {lang === LANG.EN ? 'START' : 'COMENZAR'}
    </button>
  );
}

CtaButton.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default CtaButton;
