import React, {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useMemo,
} from 'react';
import classNames from '../../utils/classNames';

type HTMLButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type HTMLAnchorProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

type CustomProps = {
  variant?: 'default' | 'transparent';
};
type ButtonProps = HTMLButtonProps & CustomProps;
type AnchorProps = HTMLAnchorProps & CustomProps;

type SharedProps = ButtonProps | AnchorProps;

const SharedButton = ({
  tagName = 'button',
  allProps,
}: {
  tagName: 'button' | 'a';
  allProps: SharedProps & { disabled?: ButtonProps['disabled'] };
}) => {
  const {
    children,
    className = '',
    variant = 'default',
    disabled = false,
    ...otherProps
  } = allProps;

  return React.createElement(
    tagName,
    {
      className: classNames(
        className,
        'min-w-[260px] inline-flex items-center border border-matte justify-center rounded-full py-2 px-4 text-center font-sans text-base font-normal focus:outline-none no-underline text-matte h-10 hover:bg-matte hover:text-grain hover:border-grain transition-colors duration-[400ms] ease-[ease]',
        variant === 'default' && 'bg-grain',
        variant === 'transparent' && 'bg-transparent',
        disabled ? 'pointer-events-none opacity-60' : 'opacity-100'
      ),
      disabled,
      ...otherProps,
    },
    children
  );
};

function isAnchorProps(props: SharedProps): props is AnchorProps {
  return (props as AnchorProps).href !== undefined;
}

function isButtonProps(props: SharedProps): props is ButtonProps {
  return !isAnchorProps(props);
}

export default function Button(props: SharedProps) {
  const tagName = useMemo(
    () => (isButtonProps(props) ? 'button' : 'a'),
    [props]
  );

  return <SharedButton tagName={tagName} allProps={props} />;
}
