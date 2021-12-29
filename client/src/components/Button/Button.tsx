import React, { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

type Props = {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  to: string;
}

function Button(props: Props) {
  const {
    children,
    to,
    className: passedClassName = '',
    ...rest
  } = props;

  const className = classNames(passedClassName, 'underline');

  return (
    <Link {...rest} className={className} to={to}>{children}</Link>
  )
}

export default Button;