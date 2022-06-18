import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
};

/**
 * Button component
 */
function Button(props: Props) {
  const { children, className: passedClassName = '', type = 'button', ...rest } = props;

  const className = classNames(passedClassName, 'underline');

  return (
    <button {...rest} className={className} type={type}>
      {children}
    </button>
  );
}

export default Button;
