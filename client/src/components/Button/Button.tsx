import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

type Props = {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  type: string;
  to?: string;
};

/**
 * Button component renders the react router Link if to props is present,
 * otherwise renders an anchor element.
 */
function Button(props: Props) {
  const { children, to, className: passedClassName = '', ...rest } = props;

  const className = classNames(passedClassName, 'underline');

  if (to) {
    return (
      <Link {...rest} className={className} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <a {...rest} className={className}>
      {children}
    </a>
  );
}

export default Button;
